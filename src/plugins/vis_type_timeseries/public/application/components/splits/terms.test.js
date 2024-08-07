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

import React from 'react';
import { shallow } from 'enzyme';
import { SplitByTermsUI } from './terms';

jest.mock('@elastic/eui', () => ({
  htmlIdGenerator: jest.fn(() => () => '42'),
  EuiFlexGroup: jest.requireActual('@elastic/eui').EuiFlexGroup,
  EuiFlexItem: jest.requireActual('@elastic/eui').EuiFlexItem,
  EuiFormRow: jest.requireActual('@elastic/eui').EuiFormRow,
  EuiFieldNumber: jest.requireActual('@elastic/eui').EuiFieldNumber,
  EuiComboBox: jest.requireActual('@elastic/eui').EuiComboBox,
  EuiFieldText: jest.requireActual('@elastic/eui').EuiFieldText,
  EuiCompressedFormRow: jest.requireActual('@elastic/eui').EuiCompressedFormRow,
  EuiCompressedFieldNumber: jest.requireActual('@elastic/eui').EuiCompressedFieldNumber,
  EuiCompressedComboBox: jest.requireActual('@elastic/eui').EuiCompressedComboBox,
  EuiCompressedFieldText: jest.requireActual('@elastic/eui').EuiCompressedFieldText,
}));

describe('src/legacy/core_plugins/metrics/public/components/splits/terms.test.js', () => {
  let props;

  beforeEach(() => {
    props = {
      intl: {
        formatMessage: jest.fn(),
      },
      model: {
        id: 123,
        terms_field: 'OriginCityName',
      },
      seriesQuantity: {
        id123: 123,
      },
      onChange: jest.fn(),
      indexPattern: 'opensearch_dashboards_sample_data_flights',
      fields: {
        opensearch_dashboards_sample_data_flights: [
          {
            aggregatable: true,
            name: 'OriginCityName',
            readFromDocValues: true,
            searchable: true,
            type: 'string',
            esTypes: ['keyword'],
          },
        ],
      },
    };
  });

  describe('<SplitByTermsUI />', () => {
    test('should render and match a snapshot', () => {
      const wrapper = shallow(<SplitByTermsUI {...props} />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
