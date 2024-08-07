/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { coreMock } from '../../../../core/public/mocks';
import { IInterpreterRenderHandlers } from 'src/plugins/expressions';
import { TableVisApp } from './table_vis_app';
import { TableVisConfig } from '../types';
import { TableVisData, FormattedTableContext } from '../table_vis_response_handler';

jest.mock('./table_vis_component_group', () => ({
  TableVisComponentGroup: () => (
    <div data-test-subj="TableVisComponentGroup">TableVisComponentGroup</div>
  ),
}));

jest.mock('./table_vis_component', () => ({
  TableVisComponent: () => <div data-test-subj="TableVisComponent">TableVisComponent</div>,
}));

describe('TableVisApp', () => {
  const serviceMock = coreMock.createStart();
  const handlersMock = ({
    done: jest.fn(),
    uiState: {
      get: jest.fn((key) => {
        switch (key) {
          case 'vis.sortColumn':
            return {};
          case 'vis.columnsWidth':
            return [];
          default:
            return undefined;
        }
      }),
      set: jest.fn(),
    },
    event: 'event',
  } as unknown) as IInterpreterRenderHandlers;
  const visConfigMock = ({} as unknown) as TableVisConfig;

  const createMockFormattedTableContext = (rowCount: number): FormattedTableContext => ({
    columns: [{ id: 'col1', name: 'Column 1' }],
    rows: Array(rowCount).fill({ col1: 'value' }),
    formattedColumns: [
      {
        id: 'col1',
        title: 'Column 1',
        formatter: {} as any,
        filterable: true,
      },
    ],
  });

  it('should render TableVisComponent if no split table and has rows', () => {
    const visDataMock: TableVisData = {
      table: createMockFormattedTableContext(1),
      tableGroups: [],
    };
    const { getByTestId } = render(
      <TableVisApp
        services={serviceMock}
        visData={visDataMock}
        visConfig={visConfigMock}
        handlers={handlersMock}
      />
    );
    expect(getByTestId('TableVisComponent')).toBeInTheDocument();
  });

  it('should render TableVisComponentGroup component if split direction is column', () => {
    const visDataMock: TableVisData = {
      tableGroups: [
        {
          table: createMockFormattedTableContext(1),
          title: 'Group 1',
        },
      ],
      direction: 'column',
    };
    const { container, getByTestId } = render(
      <TableVisApp
        services={serviceMock}
        visData={visDataMock}
        visConfig={visConfigMock}
        handlers={handlersMock}
      />
    );
    expect(container.querySelector('.visTable')).not.toBeNull();
    expect(getByTestId('TableVisComponentGroup')).toBeInTheDocument();
  });

  it('should render TableVisComponentGroup component if split direction is row', () => {
    const visDataMock: TableVisData = {
      tableGroups: [
        {
          table: createMockFormattedTableContext(1),
          title: 'Group 1',
        },
      ],
      direction: 'row',
    };
    const { container, getByTestId } = render(
      <TableVisApp
        services={serviceMock}
        visData={visDataMock}
        visConfig={visConfigMock}
        handlers={handlersMock}
      />
    );
    expect(container.querySelector('.visTable')).not.toBeNull();
    expect(getByTestId('TableVisComponentGroup')).toBeInTheDocument();
  });

  it('should render "No results found" when there are no rows', () => {
    const visDataMock: TableVisData = {
      table: createMockFormattedTableContext(0),
      tableGroups: [],
    };
    const { getByText } = render(
      <TableVisApp
        services={serviceMock}
        visData={visDataMock}
        visConfig={visConfigMock}
        handlers={handlersMock}
      />
    );
    expect(getByText('No results found')).toBeInTheDocument();
  });
});
