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

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiSpacer, EuiText } from '@elastic/eui';
import moment from 'moment-timezone';
import { unitOfTime } from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { euiThemeVars } from '@osd/ui-shared-deps/theme';

import {
  AnnotationDomainType,
  Axis,
  Chart,
  HistogramBarSeries,
  LineAnnotation,
  Position,
  ScaleType,
  Settings,
  RectAnnotation,
  TooltipValue,
  TooltipType,
  ElementClickListener,
  XYChartElementEvent,
  BrushEndListener,
  Theme,
} from '@elastic/charts';

import { i18n } from '@osd/i18n';
import { IUiSettingsClient } from 'opensearch-dashboards/public';
import { EuiChartThemeType } from '@elastic/eui/dist/eui_charts_theme';
import { Subscription, combineLatest } from 'rxjs';
import { Chart as IChart } from '../utils/point_series';
import { ExploreServices } from '../../../types';

export interface DiscoverHistogramProps {
  chartData: IChart;
  timefilterUpdateHandler: (ranges: { from: number; to: number }) => void;
  services: ExploreServices;
}

interface DiscoverHistogramState {
  chartsTheme: EuiChartThemeType['theme'];
  chartsBaseTheme: Theme;
}

function findIntervalFromDuration(
  dateValue: number,
  opensearchValue: number,
  opensearchUnit: unitOfTime.Base,
  timeZone: string
) {
  const date = moment.tz(dateValue, timeZone);
  const startOfDate = moment.tz(date, timeZone).startOf(opensearchUnit);
  const endOfDate = moment
    .tz(date, timeZone)
    .startOf(opensearchUnit)
    .add(opensearchValue, opensearchUnit);
  return endOfDate.valueOf() - startOfDate.valueOf();
}

function getIntervalInMs(
  value: number,
  opensearchValue: number,
  opensearchUnit: unitOfTime.Base,
  timeZone: string
): number {
  switch (opensearchUnit) {
    case 's':
      return 1000 * opensearchValue;
    case 'ms':
      return 1 * opensearchValue;
    default:
      return findIntervalFromDuration(value, opensearchValue, opensearchUnit, timeZone);
  }
}

function getTimezone(uiSettings: IUiSettingsClient) {
  if (uiSettings.isDefault('dateFormat:tz')) {
    const detectedTimezone = moment.tz.guess();
    if (detectedTimezone) return detectedTimezone;
    else return moment().format('Z');
  } else {
    return uiSettings.get('dateFormat:tz', 'Browser');
  }
}

export function findMinInterval(
  xValues: number[],
  opensearchValue: number,
  opensearchUnit: string,
  timeZone: string
): number {
  return xValues.reduce((minInterval, currentXvalue, index) => {
    let currentDiff = minInterval;
    if (index > 0) {
      currentDiff = Math.abs(xValues[index - 1] - currentXvalue);
    }
    const singleUnitInterval = getIntervalInMs(
      currentXvalue,
      opensearchValue,
      opensearchUnit as unitOfTime.Base,
      timeZone
    );
    return Math.min(minInterval, singleUnitInterval, currentDiff);
  }, Number.MAX_SAFE_INTEGER);
}

export class DiscoverHistogram extends Component<DiscoverHistogramProps, DiscoverHistogramState> {
  public static propTypes = {
    chartData: PropTypes.object,
    timefilterUpdateHandler: PropTypes.func,
  };

  private subscription?: Subscription;

  componentDidMount() {
    this.subscription = combineLatest(
      this.props.services.theme.chartsTheme$,
      this.props.services.theme.chartsBaseTheme$
    ).subscribe(([chartsTheme, chartsBaseTheme]) =>
      this.setState({ chartsTheme, chartsBaseTheme })
    );
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public onBrushEnd: BrushEndListener = ({ x }) => {
    if (!x) {
      return;
    }
    const [from, to] = x;
    this.props.timefilterUpdateHandler({ from, to });
  };

  public onElementClick = (xInterval: number): ElementClickListener => ([elementData]) => {
    const startRange = (elementData as XYChartElementEvent)[0].x;

    const range = {
      from: startRange,
      to: startRange + xInterval,
    };

    this.props.timefilterUpdateHandler(range);
  };

  public formatXValue = (val: string) => {
    const xAxisFormat = this.props.chartData.xAxisFormat.params!.pattern;

    return moment(val).format(xAxisFormat);
  };

  public renderBarTooltip = (xInterval: number, domainStart: number, domainEnd: number) => (
    headerData: TooltipValue
  ): JSX.Element | string => {
    const headerDataValue = headerData.value;
    const formattedValue = this.formatXValue(headerDataValue);

    const partialDataText = i18n.translate(
      'explore.discover.histogram.partialData.bucketTooltipText',
      {
        defaultMessage:
          'The selected time range does not include this entire bucket, it may contain partial data.',
      }
    );

    if (headerDataValue < domainStart || headerDataValue + xInterval > domainEnd) {
      return (
        <React.Fragment>
          <EuiFlexGroup
            alignItems="center"
            className="exploreHistogram__header--partial"
            data-test-subj="dscHistogramHeader"
            responsive={false}
            gutterSize="xs"
          >
            <EuiFlexItem grow={false}>
              <EuiIcon type="iInCircle" />
            </EuiFlexItem>
            <EuiFlexItem>{partialDataText}</EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="xs" />
          <EuiText size="s">
            <p>{formattedValue}</p>
          </EuiText>
        </React.Fragment>
      );
    }

    return formattedValue;
  };

  public render() {
    const { chartData, services } = this.props;
    const { uiSettings } = services;
    const timeZone = getTimezone(uiSettings);
    const chartsTheme = services.theme.chartsDefaultTheme;
    const chartsBaseTheme = services.theme.chartsDefaultBaseTheme;

    if (!chartData) {
      return null;
    }

    const data = chartData.values;

    /**
     * Deprecation: [interval] on [date_histogram] is deprecated, use [fixed_interval] or [calendar_interval].
     * see https://github.com/elastic/kibana/issues/27410
     * TODO: Once the Discover query has been update, we should change the below to use the new field
     */
    const { intervalOpenSearchValue, intervalOpenSearchUnit, interval } = chartData.ordered;
    const xInterval = interval.asMilliseconds();

    const xValues = chartData.xAxisOrderedValues;
    const lastXValue = xValues[xValues.length - 1];

    const domain = chartData.ordered;
    const domainStart = domain.min.valueOf();
    const domainEnd = domain.max.valueOf();

    const domainMin = data[0]?.x > domainStart ? domainStart : data[0]?.x;
    const domainMax = domainEnd - xInterval > lastXValue ? domainEnd - xInterval : lastXValue;

    const xDomain = {
      min: domainMin,
      max: domainMax,
      minInterval: findMinInterval(
        xValues,
        intervalOpenSearchValue,
        intervalOpenSearchUnit,
        timeZone
      ),
    };

    // Domain end of 'now' will be milliseconds behind current time, so we extend time by 1 minute and check if
    // the annotation is within this range; if so, the line annotation uses the domainEnd as its value
    const now = moment();
    const isAnnotationAtEdge = moment(domainEnd).add(60000).isAfter(now) && now.isAfter(domainEnd);
    const lineAnnotationValue = isAnnotationAtEdge ? domainEnd : now;

    const lineAnnotationData = [
      {
        dataValue: lineAnnotationValue,
      },
    ];
    const isDarkMode = uiSettings.get('theme:darkMode');

    const lineAnnotationStyle = {
      line: {
        strokeWidth: 2,
        stroke: euiThemeVars.euiColorDanger,
        opacity: 0.7,
      },
    };

    const rectAnnotations = [];
    if (domainStart !== domainMin) {
      rectAnnotations.push({
        coordinates: {
          x1: domainStart,
        },
      });
    }
    if (domainEnd !== domainMax) {
      rectAnnotations.push({
        coordinates: {
          x0: domainEnd,
        },
      });
    }

    const rectAnnotationStyle = {
      stroke: isDarkMode ? euiThemeVars.euiColorLightShade : euiThemeVars.euiColorDarkShade,
      strokeWidth: 0,
      opacity: isDarkMode ? 0.6 : 0.2,
      fill: isDarkMode ? euiThemeVars.euiColorLightShade : euiThemeVars.euiColorDarkShade,
    };

    const tooltipProps = {
      headerFormatter: this.renderBarTooltip(xInterval, domainStart, domainEnd),
      type: TooltipType.VerticalCursor,
    };

    // These styles override the chartsTheme so that the correct base chart colors are used
    delete chartsTheme.axes?.gridLine?.horizontal?.stroke;
    delete chartsTheme.axes?.gridLine?.vertical?.stroke;
    delete chartsTheme.axes?.axisLine;
    chartsTheme.axes!.axisTitle = {
      fill: euiThemeVars.euiTextColor,
    };
    chartsTheme.colors = chartsTheme.colors ?? {};
    chartsTheme.colors.vizColors = [euiThemeVars.euiColorVis1_behindText];

    return (
      <Chart size="100%">
        <Settings
          xDomain={xDomain}
          onBrushEnd={this.onBrushEnd}
          onElementClick={this.onElementClick(xInterval)}
          tooltip={tooltipProps}
          theme={chartsTheme}
          baseTheme={chartsBaseTheme}
        />
        <Axis id="discover-histogram-left-axis" position={Position.Left} ticks={5} />
        <Axis
          id="discover-histogram-bottom-axis"
          position={Position.Bottom}
          tickFormat={this.formatXValue}
          ticks={10}
        />
        <LineAnnotation
          id="line-annotation"
          domainType={AnnotationDomainType.XDomain}
          dataValues={lineAnnotationData}
          hideTooltips={true}
          style={lineAnnotationStyle}
        />
        <RectAnnotation
          dataValues={rectAnnotations}
          id="rect-annotation"
          zIndex={2}
          style={rectAnnotationStyle}
          hideTooltips={true}
        />
        <HistogramBarSeries
          id="discover-histogram"
          minBarHeight={2}
          xScaleType={ScaleType.Time}
          yScaleType={ScaleType.Linear}
          xAccessor="x"
          yAccessors={['y']}
          data={data}
          timeZone={timeZone}
          name={chartData.yAxisLabel}
        />
      </Chart>
    );
  }
}
