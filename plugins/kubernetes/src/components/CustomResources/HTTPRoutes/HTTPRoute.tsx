// Copyright (c) Tetrate, Inc 2022 All Rights Reserved.

import React, { MouseEvent, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StructuredMetadataTable } from '@backstage/core-components';
import { DefaultCustomResourceDrawer } from '../DefaultCustomResourceDrawer';
import { HTTPRouteDrawer } from './HTTPRouteDrawer';
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesApiRef } from '../../../api/types';

type HTTPRouteAccordionProps = {
  customResource: any;
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type HTTPRouteAccordionsProps = {
  customResources: any[];
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type HTTPRouteSummaryProps = {
  resource: any;
  resourceName: string;
  children?: React.ReactNode;
};

function renderResource(resource: any) {
  const newResource = { hostnames: [], parentRefs: [], managers: [] };
  newResource.hostnames = resource?.spec?.hostnames || [];
  newResource.parentRefs = resource?.spec?.parentRefs?.map((ref: any) => {
    return { name: ref.name, kind: ref.kind, group: ref.group };
  });
  newResource.managers = resource?.metadata?.managedFields?.map(
    (manager: any) => {
      return {
        manager: manager.manager,
        operation: manager.operation,
        subresource: manager.subresource,
        time: manager.time,
      };
    },
  );
  return { ...newResource, ...resource };
}

const HTTPRouteSummary = ({
  resource,
  resourceName,
}: HTTPRouteSummaryProps) => {
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
    const apiVersions = resource?.apiVersion?.split('/');
    await kubernetesApi.deleteObject({
      group: apiVersions[0],
      version: apiVersions[1],
      namespace: resource?.metadata?.namespace,
      plural: `${resource?.kind?.toLowerCase()}s`,
      name: resource?.metadata?.name, // TODO(dio): Set name from the current entity.
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
            customResource={renderResource(resource)}
            customResourceName={resourceName}
          />
        </Grid>
        <Grid item xs>
          <Divider style={{ height: '5em' }} orientation="vertical" />
        </Grid>
        <Grid item xs="auto">
          <HTTPRouteDrawer
            labelButton="Edit"
            title={resource.metadata.name}
            subtitle="Edit HTTPRoute"
            resource={resource}
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

const HTTPRouteAccordion = ({
  customResource: resource,
  customResourceName: resourceName,
  defaultExpanded,
}: HTTPRouteAccordionProps) => {
  // Prepare data to render.
  const metadata = { hostnames: [], gateways: [], rules: [] };
  metadata.hostnames = resource?.spec?.hostnames || [];
  metadata.gateways = resource?.spec?.parentRefs?.map((ref: any) => {
    return { name: ref.name, kind: ref.kind, group: ref.group };
  });
  metadata.rules = resource?.spec?.rules?.map((rule: any) => {
    return {
      ports: rule?.backendRefs?.map((ref: any) => ref.port),
      paths: rule?.matches?.map((match: any) => {
        return { path: match.path.value, type: match.path.type };
      }),
    };
  });

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <HTTPRouteSummary resource={resource} resourceName={resourceName} />
      </AccordionSummary>
      <AccordionDetails>
        {resource.hasOwnProperty('metadata') && (
          <StructuredMetadataTable metadata={metadata} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const HTTPRouteAccordions = ({
  customResources: resources,
  customResourceName: resourceName,
  defaultExpanded = false,
}: HTTPRouteAccordionsProps) => (
  <Grid
    container
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-start"
  >
    {resources.map((cr, i) => (
      <Grid container item key={i} xs>
        <Grid item xs>
          <HTTPRouteAccordion
            defaultExpanded={defaultExpanded}
            customResource={cr}
            customResourceName={resourceName}
          />
        </Grid>
      </Grid>
    ))}
  </Grid>
);
