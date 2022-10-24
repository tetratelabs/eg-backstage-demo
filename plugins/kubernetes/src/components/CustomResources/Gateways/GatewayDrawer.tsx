/* eslint-disable no-alert */
// Copyright (c) Tetrate, Inc 2022 All Rights Reserved.

import React, { MouseEvent, useState } from 'react';
import {
  Button,
  createStyles,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
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
      width: '24rem',
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

type GatewayDrawerProps = {
  labelButton: String;
  title?: String;
  subtitle?: String;
  customResource?: any;
};

const DEFAULT_GATEWAY_NAME = 'unnamed-gateway';
const DEFAULT_GATEWAY_PORT = 8080;

export const GatewayDrawer = ({
  labelButton,
  title,
  subtitle,
  customResource,
}: GatewayDrawerProps) => {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState(DEFAULT_GATEWAY_NAME);
  const [port, setPort] = useState(DEFAULT_GATEWAY_PORT);
  const classes = useDrawerStyles();
  const kubernetesApi = useApi(kubernetesApiRef);

  const handleCloseDrawer = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleOpenDrawer = (e: MouseEvent) => {
    e.stopPropagation();

    // Sync states to props.
    const gatewayName = customResource?.metadata?.name;
    const firstListenerPort = customResource?.spec?.listeners?.[0]?.port;
    setName(gatewayName || DEFAULT_GATEWAY_NAME);
    setPort(firstListenerPort || DEFAULT_GATEWAY_PORT);

    setOpen(true);
  };

  const handleSave = async (e: MouseEvent) => {
    e.stopPropagation();
    const body = {
      apiVersion: 'gateway.networking.k8s.io/v1beta1',
      kind: 'Gateway',
      metadata: {
        name: name,
        labels: {
          'data-plane': customResource?.metadata?.labels?.['data-plane'],
        },
        namespace: customResource?.metadata?.namespace || 'default',
      },
      spec: {
        gatewayClassName:
          customResource?.spec?.gatewayClassName ||
          customResource?.metadata?.name,
        listeners: [
          {
            allowedRoutes: { namespaces: { from: 'Same' } },
            name: 'http',
            port: port,
            protocol: 'HTTP',
          },
        ],
      },
    };

    const apiVersions = body.apiVersion?.split('/');
    const request = {
      group: apiVersions[0],
      version: apiVersions[1],
      namespace: body?.metadata?.namespace,
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
            <TextField
              disabled={customResource?.kind === 'Gateway'}
              label="Gateway Name"
              variant="filled"
              size="small"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Gateway Port"
              variant="filled"
              size="small"
              type="number"
              value={port}
              onChange={event => setPort(parseInt(event.target.value, 10))}
            />
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
