// Copyright (c) Tetrate, Inc 2022 All Rights Reserved.

import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DefaultCustomResourceDrawer } from '../DefaultCustomResourceDrawer';
import { StructuredMetadataTable } from '@backstage/core-components';

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
  return (
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
        <Button variant="outlined" onClick={e => e.stopPropagation()}>
          Edit
        </Button>
      </Grid>
      <Grid item xs="auto">
        <Button variant="outlined" onClick={e => e.stopPropagation()}>
          Delete
        </Button>
      </Grid>
    </Grid>
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
