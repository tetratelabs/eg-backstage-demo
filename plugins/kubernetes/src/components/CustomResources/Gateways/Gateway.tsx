// Copyright (c) Tetrate, Inc 2022 All Rights Reserved.

import React, { MouseEvent, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DefaultCustomResourceDrawer } from '../DefaultCustomResourceDrawer';
import { StructuredMetadataTable } from '@backstage/core-components';
import { GatewayDrawer } from './GatewayDrawer';
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesApiRef } from '../../../api/types';

type GatewayAccordionsProps = {
  customResources: any[];
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type GatewayAccordionProps = {
  customResource: any;
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type GatewaySummaryProps = {
  customResource: any;
  customResourceName: string;
  children?: React.ReactNode;
};

const GatewayResourceSummary = ({
  customResource,
  customResourceName,
}: GatewaySummaryProps) => {
  const [isAlertOpen, setAlertOpen] = useState(false);
  const kubernetesApi = useApi(kubernetesApiRef);

  const handleClickDelete = (e: MouseEvent) => {
    e.stopPropagation();
    setAlertOpen(true);
  };

  const handleDeleteDialogNo = (e: MouseEvent) => {
    e.stopPropagation();
    setAlertOpen(false);
  };

  const handleDeleteDialogYes = async (e: MouseEvent) => {
    e.stopPropagation();
    const apiVersions = customResource?.apiVersion?.split('/');
    await kubernetesApi.deleteCustomObject({
      group: apiVersions[0],
      version: apiVersions[1],
      namespace: customResource?.metadata?.namespace,
      plural: `${customResource?.kind?.toLowerCase()}s`,
      name: customResource?.metadata?.name,
    });
    setAlertOpen(false);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid xs={3} item>
          <DefaultCustomResourceDrawer
            customResource={customResource}
            customResourceName={customResourceName}
          />
        </Grid>
        <Grid item xs>
          <Divider style={{ height: '5em' }} orientation="vertical" />
        </Grid>
        <Grid item xs="auto">
          <GatewayDrawer
            labelButton="Edit"
            title={customResource.metadata.name}
            subtitle="Edit Gateway Instance"
            customResource={customResource}
          />
        </Grid>
        <Grid item xs="auto">
          <Button variant="outlined" onClick={handleClickDelete}>
            Delete
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={isAlertOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogNo}>No</Button>
          <Button onClick={handleDeleteDialogYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const GatewayAccordion = ({
  customResource,
  customResourceName,
  defaultExpanded,
}: GatewayAccordionProps) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <GatewayResourceSummary
          customResource={customResource}
          customResourceName={customResourceName}
        />
      </AccordionSummary>
      <AccordionDetails>
        {customResource.hasOwnProperty('status') && (
          <StructuredMetadataTable metadata={customResource.status} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const GatewayAccordions = ({
  customResources,
  customResourceName,
  defaultExpanded = false,
}: GatewayAccordionsProps) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {customResources.map((cr, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
            <GatewayAccordion
              defaultExpanded={defaultExpanded}
              customResource={cr}
              customResourceName={customResourceName}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
