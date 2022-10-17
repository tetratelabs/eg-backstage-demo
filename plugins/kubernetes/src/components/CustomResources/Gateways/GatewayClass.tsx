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

type GatewayClassAccordionsProps = {
  customResources: any[];
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type GatewayClassAccordionProps = {
  customResource: any;
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type GatewayClassSummaryProps = {
  customResource: any;
  customResourceName: string;
  children?: React.ReactNode;
};

const GatewayClassResourceSummary = ({
  customResource,
  customResourceName,
}: GatewayClassSummaryProps) => {
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
          Create Instance
        </Button>
      </Grid>
    </Grid>
  );
};

const GatewayClassAccordion = ({
  customResource,
  customResourceName,
  defaultExpanded,
}: GatewayClassAccordionProps) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <GatewayClassResourceSummary
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

export const GatewayClassAccordions = ({
  customResources,
  customResourceName,
  defaultExpanded = false,
}: GatewayClassAccordionsProps) => {
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
            <GatewayClassAccordion
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
