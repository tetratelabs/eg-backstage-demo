/* eslint-disable no-alert */
/* eslint-disable notice/notice */
// Copyright (c) Tetrate, Inc 2022 All Rights Reserved.

import React, { MouseEvent, useState } from 'react';
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

export const HTTPRouteDrawer = ({
  labelButton,
  title,
  subtitle,
}: {
  labelButton: String;
  title?: String;
  subtitle?: String;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [hostnames, setHostnames] = useState<string[]>(['']);
  const [paths, setPaths] = useState<string[]>(['']);
  const classes = useDrawerStyles();

  const handleToggleDrawer = (e: MouseEvent) => {
    setOpen(!isOpen);
    e.stopPropagation();
  };

  const handleAddHostname = (e: MouseEvent) => {
    setHostnames([...hostnames, '']);
    e.stopPropagation();
  };

  const handleAddPath = (e: MouseEvent) => {
    setPaths([...paths, '']);
    e.stopPropagation();
  };

  const handleSave = (e: MouseEvent) => {
    alert(JSON.stringify({ parentRefName: 'eg', hostnames, paths }));
    e.stopPropagation();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleToggleDrawer}>
        {labelButton}
      </Button>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        anchor="right"
        open={isOpen}
        onClose={handleToggleDrawer}
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
            onClick={handleToggleDrawer}
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
                Parent Ref
              </InputLabel>
              <Select
                labelId="parent-select-label"
                id="parent-select"
                value="eg"
                label="Parent Ref"
                variant="filled"
              >
                <MenuItem value="eg">eg (gateway.networking.k8s.io)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Typography variant="h5">Hostnames</Typography>
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
            <Typography variant="h5">Paths</Typography>
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
