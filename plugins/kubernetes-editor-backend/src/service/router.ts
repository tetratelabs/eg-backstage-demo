/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

import {
  KubeConfig,
  CustomObjectsApi,
} from '@kubernetes/client-node';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  // The hack begins here:
  const kc = new KubeConfig();
  kc.loadFromDefault(); // We always fo loadFromDefault here.

  const customObjectApiClient = kc.makeApiClient(CustomObjectsApi);

  router.post('/cr/apply', async (request, response) => {
    const action = request.body;
    // The right way to do this is by doing patching.
    try {
      await customObjectApiClient.deleteNamespacedCustomObject(
        action.group,
        action.version,
        action.namespace,
        action.plural,
        action.name
      )
    } catch {
      // Nothing to do here.
    }

    const { body } = await customObjectApiClient.createNamespacedCustomObject(
      action.group,
      action.version,
      action.namespace,
      action.plural,
      action.body
    )
    response.json(body);
  });

  router.post('/cr/delete', async (request, response) => {
    const action = request.body;
    const { body } = await customObjectApiClient.deleteNamespacedCustomObject(
      action.group,
      action.version,
      action.namespace,
      action.plural,
      action.name
    );
    response.json(body);
  });

  router.post('/cr/list', async (request, response) => {
    const action = request.body;
    const { body } = await customObjectApiClient.listNamespacedCustomObject(
      action.group,
      action.version,
      action.namespace,
      action.plural
    );
    return response.json(body);
  });

  router.post('/cr/get', async (request, response) => {
    const action = request.body;
    const { body } = await customObjectApiClient.getNamespacedCustomObject(
      action.group,
      action.version,
      action.namespace,
      action.plural,
      action.name
    );
    response.json(body);
  });

  router.use(errorHandler());
  return router;
}
