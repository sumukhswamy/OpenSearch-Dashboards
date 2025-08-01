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

import './index.scss';

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  ApplicationStart,
  SavedObjectsClientContract,
  NotificationsStart,
} from '../../../core/public';
import { TypesService, TypesSetup, TypesStart } from './vis_types';
import {
  setUISettings,
  setTypes,
  setI18n,
  setApplication,
  setCapabilities,
  setHttp,
  setIndexPatterns,
  setSearch,
  setSavedObjects,
  setUsageCollector,
  setFilterManager,
  setExpressions,
  setUiActions,
  setSavedVisualizationsLoader,
  setSavedAugmentVisLoader,
  setTimeFilter,
  setAggs,
  setChrome,
  setOverlays,
  setSavedSearchLoader,
  setEmbeddable,
  setNotifications,
  setDocLinks,
  setDataStart,
} from './services';
import {
  VISUALIZE_EMBEDDABLE_TYPE,
  VisualizeEmbeddableFactory,
  createVisEmbeddableFromObject,
} from './embeddable';
import { ExpressionsSetup, ExpressionsStart } from '../../expressions/public';
import { EmbeddableSetup, EmbeddableStart } from '../../embeddable/public';
import { visualization as visualizationFunction } from './expressions/visualization_function';
import { visualization as visualizationRenderer } from './expressions/visualization_renderer';
import { range as rangeExpressionFunction } from './expression_functions/range';
import { visDimension as visDimensionExpressionFunction } from './expression_functions/vis_dimension';
import { DataPublicPluginSetup, DataPublicPluginStart } from '../../data/public';
import {
  Setup as InspectorSetup,
  Start as InspectorStart,
} from '../../../plugins/inspector/public';
import { UsageCollectionSetup } from '../../usage_collection/public';
import {
  createStartServicesGetter,
  StartServicesGetter,
} from '../../opensearch_dashboards_utils/public';
import { createSavedVisLoader, SavedVisualizationsLoader } from './saved_visualizations';
import { SerializedVis, Vis } from './vis';
import { showNewVisModal } from './wizard';
import { UiActionsStart } from '../../ui_actions/public';
import {
  convertFromSerializedVis,
  convertToSerializedVis,
} from './saved_visualizations/_saved_vis';
import { createSavedSearchesLoader } from '../../discover/public';
import { DashboardStart } from '../../dashboard/public';
import { createSavedAugmentVisLoader } from '../../vis_augmenter/public';
import { DocLinksStart } from '../../../core/public';
import { createNewVisActions } from './wizard/new_vis_actions';

/**
 * Interface for this plugin's returned setup/start contracts.
 *
 * @public
 */

export type VisualizationsSetup = TypesSetup;

export interface VisualizationsStart extends TypesStart {
  savedVisualizationsLoader: SavedVisualizationsLoader;
  createVis: (visType: string, visState: SerializedVis) => Promise<Vis>;
  convertToSerializedVis: typeof convertToSerializedVis;
  convertFromSerializedVis: typeof convertFromSerializedVis;
  showNewVisModal: typeof showNewVisModal;
  __LEGACY: { createVisEmbeddableFromObject: ReturnType<typeof createVisEmbeddableFromObject> };
}

export interface VisualizationsSetupDeps {
  data: DataPublicPluginSetup;
  embeddable: EmbeddableSetup;
  expressions: ExpressionsSetup;
  inspector: InspectorSetup;
  usageCollection: UsageCollectionSetup;
}

export interface VisualizationsStartDeps {
  data: DataPublicPluginStart;
  expressions: ExpressionsStart;
  embeddable: EmbeddableStart;
  inspector: InspectorStart;
  uiActions: UiActionsStart;
  application: ApplicationStart;
  dashboard: DashboardStart;
  getAttributeService: DashboardStart['getAttributeService'];
  savedObjectsClient: SavedObjectsClientContract;
  notifications: NotificationsStart;
  docLinks: DocLinksStart;
}

/**
 * Visualizations Plugin - public
 *
 * This plugin's stateful contracts are returned from the `setup` and `start` methods
 * below. The interfaces for these contracts are provided above.
 *
 * @internal
 */
export class VisualizationsPlugin
  implements
    Plugin<
      VisualizationsSetup,
      VisualizationsStart,
      VisualizationsSetupDeps,
      VisualizationsStartDeps
    > {
  private readonly types: TypesService = new TypesService();
  private getStartServicesOrDie?: StartServicesGetter<VisualizationsStartDeps, VisualizationsStart>;

  constructor(initializerContext: PluginInitializerContext) {}

  public setup(
    core: CoreSetup<VisualizationsStartDeps, VisualizationsStart>,
    { expressions, embeddable, usageCollection, data }: VisualizationsSetupDeps
  ): VisualizationsSetup {
    const start = (this.getStartServicesOrDie = createStartServicesGetter(core.getStartServices));

    setUISettings(core.uiSettings);
    setUsageCollector(usageCollection);

    expressions.registerFunction(visualizationFunction);
    expressions.registerRenderer(visualizationRenderer);
    expressions.registerFunction(rangeExpressionFunction);
    expressions.registerFunction(visDimensionExpressionFunction);
    const embeddableFactory = new VisualizeEmbeddableFactory({ start });
    embeddable.registerEmbeddableFactory(VISUALIZE_EMBEDDABLE_TYPE, embeddableFactory);

    return {
      ...this.types.setup(),
    };
  }

  public start(
    core: CoreStart,
    { data, expressions, uiActions, embeddable, dashboard }: VisualizationsStartDeps
  ): VisualizationsStart {
    const types = this.types.start();
    const savedAugmentVisLoader = createSavedAugmentVisLoader({
      savedObjectsClient: core.savedObjects.client,
      indexPatterns: data.indexPatterns,
      search: data.search,
      chrome: core.chrome,
      overlays: core.overlays,
    });

    createNewVisActions({
      types,
      uiActions,
      data,
      uiSettings: core.uiSettings,
      overlays: core.overlays,
      application: core.application,
      savedObjects: core.savedObjects,
    });

    setDataStart(data);
    setSavedAugmentVisLoader(savedAugmentVisLoader);
    setI18n(core.i18n);
    setTypes(types);
    setEmbeddable(embeddable);
    setApplication(core.application);
    setCapabilities(core.application.capabilities);
    setHttp(core.http);
    setSavedObjects(core.savedObjects);
    setIndexPatterns(data.indexPatterns);
    setSearch(data.search);
    setFilterManager(data.query.filterManager);
    setExpressions(expressions);
    setUiActions(uiActions);
    setTimeFilter(data.query.timefilter.timefilter);
    setAggs(data.search.aggs);
    setOverlays(core.overlays);
    setChrome(core.chrome);
    const savedVisualizationsLoader = createSavedVisLoader({
      savedObjectsClient: core.savedObjects.client,
      indexPatterns: data.indexPatterns,
      search: data.search,
      chrome: core.chrome,
      overlays: core.overlays,
      visualizationTypes: types,
    });
    setSavedVisualizationsLoader(savedVisualizationsLoader);
    const savedSearchLoader = createSavedSearchesLoader({
      savedObjectsClient: core.savedObjects.client,
      indexPatterns: data.indexPatterns,
      search: data.search,
      chrome: core.chrome,
      overlays: core.overlays,
    });
    setSavedSearchLoader(savedSearchLoader);
    setNotifications(core.notifications);
    setDocLinks(core.docLinks);
    return {
      ...types,
      showNewVisModal,
      /**
       * creates new instance of Vis
       * @param {IIndexPattern} indexPattern - index pattern to use
       * @param {VisState} visState - visualization configuration
       */
      createVis: async (visType: string, visState: SerializedVis) => {
        const vis = new Vis(visType);
        await vis.setState(visState);
        return vis;
      },
      convertToSerializedVis,
      convertFromSerializedVis,
      savedVisualizationsLoader,
      __LEGACY: {
        createVisEmbeddableFromObject: createVisEmbeddableFromObject({
          start: this.getStartServicesOrDie!,
        }),
      },
    };
  }

  public stop() {
    this.types.stop();
  }
}
