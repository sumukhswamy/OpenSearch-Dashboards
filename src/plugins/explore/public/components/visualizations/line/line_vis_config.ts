/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LineVisStyleControls } from './line_vis_options';
import { VisualizationType } from '../utils/use_visualization_types';
import {
  CategoryAxis,
  ThresholdLines,
  ThresholdLineStyle,
  ValueAxis,
  Positions,
  AxisRole,
  VisFieldType,
  TitleOptions,
} from '../types';
import { LineStyle } from './line_exclusive_vis_options';
import { TooltipOptions } from '../types';

// Complete line chart style controls interface
export interface LineChartStyleControls {
  addLegend: boolean;
  legendPosition: Positions;
  addTimeMarker: boolean;

  lineStyle: LineStyle;
  lineMode: string;
  lineWidth: number;
  tooltipOptions: TooltipOptions;

  // Threshold and grid
  thresholdLines: ThresholdLines;

  // Axes configuration
  categoryAxes: CategoryAxis[];
  valueAxes: ValueAxis[];

  titleOptions: TitleOptions;
}

const defaultLineChartStyles: LineChartStyleControls = {
  addLegend: true,
  legendPosition: Positions.RIGHT,
  addTimeMarker: false,

  lineStyle: 'both',
  lineMode: 'smooth',
  lineWidth: 2,
  tooltipOptions: {
    mode: 'all',
  },

  thresholdLines: [
    {
      id: '1',
      color: '#E7664C',
      show: false,
      style: ThresholdLineStyle.Full,
      value: 10,
      width: 1,
      name: '',
    },
  ],

  // Category axes
  categoryAxes: [
    {
      id: 'CategoryAxis-1',
      type: 'category',
      position: Positions.BOTTOM,
      show: true,
      labels: {
        show: true,
        filter: true,
        rotate: 0,
        truncate: 100,
      },
      title: {
        text: '',
      },
      grid: {
        showLines: false,
      },
    },
  ],

  // Value axes
  valueAxes: [
    {
      id: 'ValueAxis-1',
      name: 'LeftAxis-1',
      type: 'value',
      position: Positions.LEFT,
      show: true,
      labels: {
        show: true,
        rotate: 0,
        filter: false,
        truncate: 100,
      },
      title: {
        text: '',
      },
      grid: {
        showLines: false,
      },
    },
  ],

  titleOptions: {
    show: false,
    titleName: '',
  },
};

export const createLineConfig = (): VisualizationType<'line'> => ({
  name: 'line',
  type: 'line',
  ui: {
    style: {
      defaults: defaultLineChartStyles,
      render: (props) => React.createElement(LineVisStyleControls, props),
    },
    // TODO: refactor availableMappings to a flatten array
    availableMappings: [
      {
        mapping: [
          {
            [AxisRole.X]: { type: VisFieldType.Date, index: 0 },
            [AxisRole.Y]: { type: VisFieldType.Numerical, index: 0 },
          },
        ],
      },
      {
        mapping: [
          {
            [AxisRole.X]: { type: VisFieldType.Date, index: 0 },
            [AxisRole.Y]: { type: VisFieldType.Numerical, index: 0 },
            [AxisRole.Y_SECOND]: { type: VisFieldType.Numerical, index: 1 },
          },
        ],
      },
      {
        mapping: [
          {
            [AxisRole.X]: { type: VisFieldType.Date, index: 0 },
            [AxisRole.Y]: { type: VisFieldType.Numerical, index: 0 },
            [AxisRole.COLOR]: { type: VisFieldType.Categorical, index: 0 },
          },
        ],
      },
      {
        mapping: [
          {
            [AxisRole.X]: { type: VisFieldType.Date, index: 0 },
            [AxisRole.Y]: { type: VisFieldType.Numerical, index: 0 },
            [AxisRole.COLOR]: { type: VisFieldType.Categorical, index: 0 },
            [AxisRole.FACET]: { type: VisFieldType.Categorical, index: 1 },
          },
        ],
      },
      {
        mapping: [
          {
            [AxisRole.X]: { type: VisFieldType.Categorical, index: 0 },
            [AxisRole.Y]: { type: VisFieldType.Numerical, index: 0 },
          },
        ],
      },
    ],
  },
});
