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

import { parseQuery } from './parse_query';

describe('getQueryText', () => {
  it('should know how to get the text out of the AST', () => {
    const ast = {
      getTermClauses: () => [{ value: 'foo' }, { value: 'bar' }],
      // @ts-expect-error TS7006 TODO(ts-error): fixme
      getFieldClauses: (field) => {
        if (field === 'type') {
          return [{ value: 'lala' }, { value: 'lolo' }];
        } else if (field === 'namespaces') {
          return [{ value: 'default' }];
        } else if (field === 'workspaces') {
          return [{ value: 'workspaces' }];
        }
        return [];
      },
    };
    // @ts-expect-error TS2554 TODO(ts-error): fixme
    expect(parseQuery({ ast } as any, ['type'])).toEqual({
      queryText: 'foo bar',
      visibleTypes: 'lala',
      visibleNamespaces: 'default',
      visibleWorkspaces: 'workspaces',
    });
  });
});
