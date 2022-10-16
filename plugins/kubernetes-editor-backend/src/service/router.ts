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

import {
  KubeConfig,
  CustomObjectsApi,
} from '@kubernetes/client-node';

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

type KubernetesEditorDeleteAction = {
  group: string;
  version: string;
  namespace: string;
  kind: string;
  plural: string;
  name: string;
}

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  // TODO(dio): Load using the cluster details.
  const kc = new KubeConfig();
  kc.loadFromDefault();

  const client = kc.makeApiClient(CustomObjectsApi);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.post('/apply', async (request, response) => {
    const body = request.body;
    console.log(body);
    // TODO(dio): Using patch instead.
    try {
      await client.deleteNamespacedCustomObject('gateway.networking.k8s.io', 'v1beta1', body.metadata.namespace || 'default', 'httproutes', body.metadata.name);
    } catch (e: any) {
      //
    }
    await client.createNamespacedCustomObject('gateway.networking.k8s.io', 'v1beta1', body.metadata.namespace || 'default', 'httproutes', body);
    response.send({ status: 'ok' });
  });

  router.post('/delete', async (request, response) => {
    const deleteAction: KubernetesEditorDeleteAction = request.body
    await client.deleteNamespacedCustomObject(
      deleteAction.group,
      deleteAction.version,
      deleteAction.namespace,
      deleteAction.plural,
      deleteAction.name
    );
    response.send({ status: 'ok' });
  });
  router.use(errorHandler());
  return router;
}
