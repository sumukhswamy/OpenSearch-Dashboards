/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DATASOURCE_NAME,
  INDEX_PATTERN_WITH_TIME,
  INDEX_WITH_TIME_1,
  INDEX_WITH_TIME_2,
} from '../../../../../../utils/constants';

import {
  verifyDiscoverPageState,
  verifyQueryDoesNotExistInSavedQueries,
  setQueryConfigurations,
  updateAndVerifySavedQuery,
  SAVE_AS_NEW_QUERY_SUFFIX,
  validateSaveAsNewQueryMatchingNameHasError,
} from '../../../../../../utils/apps/explore/saved_queries';

import {
  getRandomizedWorkspaceName,
  setDatePickerDatesAndSearchIfRelevant,
  generateAllTestConfigurations,
} from '../../../../../../utils/apps/explore/shared';

import { generateSavedTestConfiguration } from '../../../../../../utils/apps/explore/saved';
import { prepareTestSuite } from '../../../../../../utils/helpers';

const workspaceName = getRandomizedWorkspaceName();

const createSavedQuery = (config) => {
  cy.osd.navigateToWorkSpaceSpecificPage({
    workspaceName,
    page: 'explore/logs',
    isEnhancement: true,
  });

  cy.explore.setDataset(config.dataset, DATASOURCE_NAME, config.datasetType);

  setDatePickerDatesAndSearchIfRelevant(config.language);

  setQueryConfigurations(config);
  verifyDiscoverPageState(config);

  cy.explore.saveQuery(`${workspaceName}-${config.saveName}`, ' ', true, true);
};

const loadSavedQuery = (config) => {
  cy.osd.navigateToWorkSpaceSpecificPage({
    workspaceName,
    page: 'explore/logs',
    isEnhancement: true,
  });

  cy.getElementByTestId('discoverNewButton').click();
  // Todo - Date Picker sometimes does not load when expected. Have to set dataset and query language again.
  cy.explore.setDataset(config.dataset, DATASOURCE_NAME, config.datasetType);

  // TODO: Change line 68 back the following lines once saved query could load time filter correctly
  // setDatePickerDatesAndSearchIfRelevant(
  //   config.language,
  //   'Aug 29, 2020 @ 00:00:00.000',
  //   'Aug 30, 2020 @ 00:00:00.000'
  // );

  setDatePickerDatesAndSearchIfRelevant(config.language);

  cy.explore.loadSavedQuery(`${workspaceName}-${config.saveName}`);
  // wait for saved queries to load.
  cy.getElementByTestId('docTable').should('be.visible');
  verifyDiscoverPageState(config);
};

const modifyAndVerifySavedQuery = (config, saveAsNewQueryName) => {
  if (config.filters) {
    cy.deleteAllFilters();
  }
  setDatePickerDatesAndSearchIfRelevant(config.language);

  setQueryConfigurations(config);
  verifyDiscoverPageState(config);
  validateSaveAsNewQueryMatchingNameHasError(`${workspaceName}-${config.saveName}`);
  cy.explore.updateSavedQuery(`${workspaceName}-${saveAsNewQueryName}`, true, true, true);

  cy.reload();
  cy.explore.loadSavedQuery(`${workspaceName}-${saveAsNewQueryName}`);
  // wait for saved query to load
  cy.getElementByTestId('docTable').should('be.visible');
  verifyDiscoverPageState(config);
};

const deleteSavedQuery = (saveAsNewQueryName) => {
  cy.osd.navigateToWorkSpaceSpecificPage({
    workspaceName,
    page: 'explore/logs',
    isEnhancement: true,
  });

  cy.explore.deleteSavedQuery(`${workspaceName}-${saveAsNewQueryName}`);
  verifyQueryDoesNotExistInSavedQueries(`${workspaceName}-${saveAsNewQueryName}`);
};

const runSavedQueriesUITests = () => {
  describe('saved queries UI', () => {
    before(() => {
      cy.osd.setupWorkspaceAndDataSourceWithIndices(workspaceName, [
        INDEX_WITH_TIME_1,
        INDEX_WITH_TIME_2,
      ]);
      cy.createWorkspaceIndexPatterns({
        workspaceName: workspaceName,
        indexPattern: INDEX_PATTERN_WITH_TIME.replace('*', ''),
        timefieldName: 'timestamp',
        dataSource: DATASOURCE_NAME,
        isEnhancement: true,
      });
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.clear();
        win.sessionStorage.clear();
      });
    });

    after(() => {
      cy.osd.cleanupWorkspaceAndDataSourceAndIndices(workspaceName, [
        INDEX_WITH_TIME_1,
        INDEX_WITH_TIME_2,
      ]);
    });

    const testConfigurations = generateAllTestConfigurations(generateSavedTestConfiguration);

    testConfigurations.forEach((config) => {
      it(`should create, load, update, modify and delete the saved query: ${config.testName}`, () => {
        createSavedQuery(config);
        loadSavedQuery(config);
        updateAndVerifySavedQuery(config);

        const saveAsNewQueryName = config.testName + SAVE_AS_NEW_QUERY_SUFFIX;
        modifyAndVerifySavedQuery(config, saveAsNewQueryName);
        deleteSavedQuery(saveAsNewQueryName);
      });
    });
  });
};

prepareTestSuite('Saved Queries', runSavedQueriesUITests);
