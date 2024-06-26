/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { first } from 'rxjs/operators';
import {
  PluginInitializerContext,
  Logger,
  CoreSetup,
  CoreStart,
  ISavedObjectsRepository,
  Plugin,
} from 'opensearch-dashboards/server';
import { ConfigType } from './config';
import { CollectorSet } from './collector';
import { setupRoutes } from './routes';

export type UsageCollectionSetup = CollectorSet;
export class UsageCollectionPlugin implements Plugin<CollectorSet> {
  private readonly logger: Logger;
  private savedObjects?: ISavedObjectsRepository;
  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.logger = this.initializerContext.logger.get();
  }

  public async setup(core: CoreSetup) {
    const config = await this.initializerContext.config
      .create<ConfigType>()
      .pipe(first())
      .toPromise();

    const collectorSet = new CollectorSet({
      logger: this.logger.get('collector-set'),
      maximumWaitTimeForAllCollectorsInS: config.maximumWaitTimeForAllCollectorsInS,
    });

    const globalConfig = await this.initializerContext.config.legacy.globalConfig$
      .pipe(first())
      .toPromise();

    const router = core.http.createRouter();
    setupRoutes({
      router,
      getSavedObjects: () => this.savedObjects,
      collectorSet,
      config: {
        allowAnonymous: core.status.isStatusPageAnonymous(),
        opensearchDashboardsIndex: globalConfig.opensearchDashboards.index,
        opensearchDashboardsVersion: this.initializerContext.env.packageInfo.version,
        server: core.http.getServerInfo(),
        uuid: this.initializerContext.env.instanceUuid,
        batchingInterval: config.uiMetric.batchingIntervalInS,
      },
      metrics: core.metrics,
      overallStatus$: core.status.overall$,
    });

    return collectorSet;
  }

  public start({ savedObjects }: CoreStart) {
    this.logger.debug('Starting plugin');
    this.savedObjects = savedObjects.createInternalRepository();
  }

  public stop() {
    this.logger.debug('Stopping plugin');
  }
}
