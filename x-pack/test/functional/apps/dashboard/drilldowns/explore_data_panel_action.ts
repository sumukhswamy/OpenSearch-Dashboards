/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../ftr_provider_context';

const ACTION_ID = 'ACTION_EXPLORE_DATA';
const EXPLORE_RAW_DATA_ACTION_TEST_SUBJ = `embeddablePanelAction-${ACTION_ID}`;

export default function ({ getService, getPageObjects }: FtrProviderContext) {
  const drilldowns = getService('dashboardDrilldownsManage');
  const { dashboard, discover, common, timePicker } = getPageObjects([
    'dashboard',
    'discover',
    'common',
    'timePicker',
  ]);
  const panelActions = getService('dashboardPanelActions');
  const panelActionsTimeRange = getService('dashboardPanelTimeRange');
  const testSubjects = getService('testSubjects');
  const kibanaServer = getService('kibanaServer');

  describe('Explore underlying data - panel action', function () {
    before(async () => {
      await kibanaServer.uiSettings.replace({ defaultIndex: 'logstash*' });
      await common.navigateToApp('dashboard');
      await dashboard.preserveCrossAppState();
    });

    after(async () => {
      await kibanaServer.uiSettings.replace({ defaultIndex: 'logstash-*' });
    });

    it('action exists in panel context menu', async () => {
      await dashboard.loadSavedDashboard(drilldowns.DASHBOARD_WITH_PIE_CHART_NAME);
      await panelActions.openContextMenu();
      await testSubjects.existOrFail(EXPLORE_RAW_DATA_ACTION_TEST_SUBJ);
    });

    it('is a link <a> element', async () => {
      const actionElement = await testSubjects.find(EXPLORE_RAW_DATA_ACTION_TEST_SUBJ);
      const tag = await actionElement.getTagName();

      expect(tag.toLowerCase()).to.be('a');
    });

    it('navigates to Discover app to index pattern of the panel on action click', async () => {
      await testSubjects.clickWhenNotDisabled(EXPLORE_RAW_DATA_ACTION_TEST_SUBJ);
      await discover.waitForDiscoverAppOnScreen();

      const el = await testSubjects.find('indexPattern-switch-link');
      const text = await el.getVisibleText();

      expect(text).to.be('logstash-*');
    });

    it('carries over panel time range', async () => {
      await common.navigateToApp('dashboard');

      await dashboard.gotoDashboardEditMode(drilldowns.DASHBOARD_WITH_PIE_CHART_NAME);

      await panelActions.openContextMenu();
      await panelActionsTimeRange.clickTimeRangeActionInContextMenu();
      await panelActionsTimeRange.clickToggleQuickMenuButton();
      await panelActionsTimeRange.clickCommonlyUsedTimeRange('Last_90 days');
      await panelActionsTimeRange.clickModalPrimaryButton();

      await dashboard.saveDashboard('Dashboard with Pie Chart');

      await panelActions.openContextMenu();
      await testSubjects.clickWhenNotDisabled(EXPLORE_RAW_DATA_ACTION_TEST_SUBJ);
      await discover.waitForDiscoverAppOnScreen();

      const text = await timePicker.getShowDatesButtonText();
      const lowercaseText = text.toLowerCase();

      expect(lowercaseText.includes('last 90 days')).to.be(true);
    });
  });
}