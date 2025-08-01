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

import { i18n } from '@osd/i18n';
import { AggGroupNames } from '../../data/public';
import { Schemas } from '../../vis_default_editor/public';
import { BaseVisTypeOptions } from '../../visualizations/public';
import { tableVisResponseHandler } from './table_vis_response_handler';
import { toExpressionAst } from './to_ast';
import { VIS_EVENT_TO_TRIGGER } from '../../../plugins/visualizations/public';
import { TableOptions } from './components/table_vis_options_lazy';

export const getTableVisTypeDefinition = (): BaseVisTypeOptions => ({
  name: 'table',
  title: i18n.translate('visTypeTable.tableVisTitle', {
    defaultMessage: 'Data Table',
  }),
  icon: 'visTable',
  isClassic: true,
  description: i18n.translate('visTypeTable.tableVisDescription', {
    defaultMessage: 'Display values in a table',
  }),
  toExpressionAst,
  visConfig: {
    defaults: {
      perPage: 10,
      showPartialRows: false,
      showMetricsAtAllLevels: false,
      showTotal: false,
      totalFunc: 'sum',
      percentageCol: '',
    },
  },
  editorConfig: {
    optionsTemplate: TableOptions,
    schemas: new Schemas([
      {
        group: AggGroupNames.Metrics,
        name: 'metric',
        title: i18n.translate('visTypeTable.tableVisEditorConfig.schemas.metricTitle', {
          defaultMessage: 'Metric',
        }),
        aggFilter: ['!geo_centroid', '!geo_bounds'],
        aggSettings: {
          top_hits: {
            allowStrings: true,
          },
        },
        min: 1,
        defaults: [{ type: 'count', schema: 'metric' }],
      },
      {
        group: AggGroupNames.Buckets,
        name: 'bucket',
        title: i18n.translate('visTypeTable.tableVisEditorConfig.schemas.bucketTitle', {
          defaultMessage: 'Split rows',
        }),
        aggFilter: ['!filter'],
      },
      {
        group: AggGroupNames.Buckets,
        name: 'split',
        title: i18n.translate('visTypeTable.tableVisEditorConfig.schemas.splitTitle', {
          defaultMessage: 'Split table',
        }),
        min: 0,
        max: 1,
        aggFilter: ['!filter'],
      },
    ]),
  },
  responseHandler: tableVisResponseHandler,
  getSupportedTriggers: () => {
    return [VIS_EVENT_TO_TRIGGER.filter];
  },
  hierarchicalData: (vis) => {
    return Boolean(vis.params.showPartialRows || vis.params.showMetricsAtAllLevels);
  },
});
