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

import './application/index.scss';

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
} from 'opensearch-dashboards/public';
import { DataSourceManagementPluginSetup } from 'src/plugins/data_source_management/public';
import { DataSourcePluginSetup } from 'src/plugins/data_source/public';
import { Plugin as ExpressionsPublicPlugin } from '../../expressions/public';
import { VisualizationsSetup } from '../../visualizations/public';

import { createMetricsFn } from './metrics_fn';
import { metricsVisDefinition } from './metrics_type';
import {
  setSavedObjectsClient,
  setUISettings,
  setI18n,
  setFieldFormats,
  setCoreStart,
  setDataStart,
  setChartsSetup,
  setDataSourceManagementSetup,
  setNotifications,
  setDataSourceSetup,
} from './services';
import { DataPublicPluginStart } from '../../data/public';
import { ChartsPluginSetup } from '../../charts/public';

/** @internal */
export interface MetricsPluginSetupDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  charts: ChartsPluginSetup;
  dataSourceManagement?: DataSourceManagementPluginSetup;
  dataSource?: DataSourcePluginSetup;
}

/** @internal */
export interface MetricsPluginStartDependencies {
  data: DataPublicPluginStart;
}

/** @internal */
export class MetricsPlugin implements Plugin<Promise<void>, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(
    core: CoreSetup,
    {
      expressions,
      visualizations,
      charts,
      dataSourceManagement,
      dataSource,
    }: MetricsPluginSetupDependencies
  ) {
    expressions.registerFunction(createMetricsFn);
    setUISettings(core.uiSettings);
    setChartsSetup(charts);
    visualizations.createReactVisualization(metricsVisDefinition);
    setDataSourceManagementSetup({ dataSourceManagement });
    setDataSourceSetup({ dataSource });
  }

  public start(core: CoreStart, { data }: MetricsPluginStartDependencies) {
    setSavedObjectsClient(core.savedObjects);
    setI18n(core.i18n);
    setFieldFormats(data.fieldFormats);
    setDataStart(data);
    setCoreStart(core);
    setNotifications(core.notifications);
  }
}
