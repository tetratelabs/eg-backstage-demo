/* eslint-disable no-alert */
// Copyright (c) Tetrate, Inc 2022 All Rights Reserved.

import React, { MouseEvent, useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesApiRef } from '../../../api/types';

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      padding: theme.spacing(2.5),
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    errorMessage: {
      marginTop: '1em',
      marginBottom: '1em',
    },
    options: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    icon: {
      fontSize: 20,
    },
    content: {
      height: '80%',
    },
  }),
);

type HTTPRouteDrawerProps = {
  labelButton: String;
  title?: String;
  subtitle?: String;
  resource?: any;
};

export const HTTPRouteDrawer = ({
  labelButton,
  title,
  subtitle,
  resource,
}: HTTPRouteDrawerProps) => {
  const [isOpen, setOpen] = useState(false);
  const [hostnames, setHostnames] = useState<string[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [parentName, setParentName] = useState('');
  const classes = useDrawerStyles();
  const kubernetesApi = useApi(kubernetesApiRef);
  const [parentRefs, setParentRefs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchParents() {
      const { items } = await kubernetesApi.listCustomObjects({
        group: 'gateway.networking.k8s.io',
        version: 'v1beta1',
        namespace: resource?.metadata?.namespace,
        plural: 'gateways',
      });
      setParentRefs(items);
    }
    fetchParents();
  }, [resource, kubernetesApi]);

  const handleCloseDrawer = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleOpenDrawer = (e: MouseEvent) => {
    e.stopPropagation();

    // Sync states to props.

    // Sync hostnames.
    setHostnames(resource?.spec?.hostnames?.slice() || []);

    // Sync paths.
    const newPaths: string[] = [];
    const rulesLength = resource?.spec?.rules?.length || 0;
    for (let i = 0; i < rulesLength; i++) {
      const matches = resource.spec.rules[i].matches;
      const matchesLength = matches?.length || 0;
      for (let j = 0; j < matchesLength; j++) {
        const match = matches[j];
        if (match?.path?.value) {
          newPaths.push(match.path.value);
        }
      }
    }
    setPaths(newPaths);

    // Sync parent ref.
    // TODO(nascode): check if we should support many parent refs.
    setParentName(resource?.spec?.parentRefs?.[0]?.name);

    setOpen(true);
  };

  const handleAddHostname = (e: MouseEvent) => {
    e.stopPropagation();
    setHostnames([...hostnames, '']);
  };

  const handleAddPath = (e: MouseEvent) => {
    e.stopPropagation();
    setPaths([...paths, '']);
  };

  const handleSave = async (e: MouseEvent) => {
    e.stopPropagation();
    const body = {
      apiVersion: 'gateway.networking.k8s.io/v1beta1',
      kind: 'HTTPRoute',
      metadata: {
        name: resource?.metadata?.name,
        labels: {
          app: resource?.metadata?.labels?.app,
        },
      },
      spec: {
        parentRefs: [
          {
            name: parentName,
          },
        ],
        hostnames: hostnames,
        rules: [
          {
            backendRefs: [
              {
                group: '',
                kind: 'Service',
                name: resource?.metadata?.name,
                port: resource?.spec?.ports?.[0].port,
                weight: 1,
              },
            ],
            matches: paths.map(path => {
              return {
                path: {
                  type: 'PathPrefix',
                  value: path,
                },
              };
            }),
          },
        ],
      },
    };
    if (Array.isArray(resource.spec?.rules)) {
      body.spec.rules = resource.spec?.rules;
    }
    const apiVersions = body.apiVersion?.split('/');
    const request = {
      group: apiVersions[0],
      version: apiVersions[1],
      namespace: resource?.metadata?.namespace,
      plural: `${body?.kind?.toLowerCase()}s`,
      body,
    };
    await kubernetesApi.applyCustomObject(request);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpenDrawer}>
        {labelButton}
      </Button>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        anchor="right"
        open={isOpen}
        onClose={handleCloseDrawer}
        onClick={event => event.stopPropagation()}
      >
        <div className={classes.header}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <Typography variant="h5">{title || 'Unknown Title'}</Typography>
            </Grid>
            {subtitle && (
              <Grid item>
                <Typography color="textSecondary" variant="body1">
                  {subtitle}
                </Typography>
              </Grid>
            )}
          </Grid>
          <IconButton
            key="dismiss"
            title="Close the drawer"
            onClick={handleCloseDrawer}
            color="inherit"
          >
            <Close className={classes.icon} />
          </IconButton>
        </div>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="parent-select-label" variant="filled">
                Gateway instance
              </InputLabel>
              <Select
                labelId="parent-select-label"
                id="parent-select"
                value={parentName || ''}
                label="Gateway instance"
                variant="filled"
                onChange={(event: any) => {
                  setParentName(event?.target?.value?.toString() || '');
                }}
              >
                {parentRefs.map((parentRef: any) => (
                  <MenuItem
                    key={parentRef.metadata?.name}
                    value={parentRef.metadata?.name}
                  >
                    {parentRef.metadata?.name} ({parentRef.apiVersion})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Typography variant="h6">Hostnames</Typography>
          </Grid>
          {hostnames.map((name, index) => (
            <Grid item key={index}>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <TextField
                    variant="filled"
                    size="small"
                    hiddenLabel
                    value={name}
                    onChange={event => {
                      hostnames[index] = event.target.value;
                      setHostnames([...hostnames]);
                    }}
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="Add"
                    size="small"
                    onClick={() => {
                      hostnames.splice(index, 1);
                      setHostnames([...hostnames]);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item>
            <Button variant="outlined" onClick={handleAddHostname}>
              Add Hostname
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h6">Paths</Typography>
          </Grid>
          {paths.map((name, index) => (
            <Grid item key={index}>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <TextField
                    variant="filled"
                    size="small"
                    hiddenLabel
                    value={name}
                    onChange={event => {
                      paths[index] = event.target.value;
                      setPaths([...paths]);
                    }}
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="Add"
                    size="small"
                    onClick={() => {
                      paths.splice(index, 1);
                      setPaths([...paths]);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item>
            <Button variant="outlined" onClick={handleAddPath}>
              Add Path
            </Button>
          </Grid>
          <Grid item>
            <Button fullWidth variant="outlined" onClick={handleSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};
