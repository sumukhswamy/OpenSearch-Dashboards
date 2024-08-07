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

import {
  EuiForm,
  EuiCompressedFormRow,
  EuiCompressedFieldText,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiSmallButton,
  EuiModalFooter,
  EuiSmallButtonEmpty,
} from '@elastic/eui';
import React, { Component } from 'react';

export interface ContactCardInitializerProps {
  onCreate: (name: { lastName?: string; firstName: string }) => void;
  onCancel: () => void;
}

interface State {
  firstName?: string;
  lastName?: string;
}

export class ContactCardInitializer extends Component<ContactCardInitializerProps, State> {
  constructor(props: ContactCardInitializerProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Create a new greeting card</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm>
            <EuiCompressedFormRow label="First name">
              <EuiCompressedFieldText
                name="popfirst"
                value={this.state.firstName}
                onChange={(e) => this.setState({ firstName: e.target.value })}
              />
            </EuiCompressedFormRow>

            <EuiCompressedFormRow label="Last name">
              <EuiCompressedFieldText
                name="popfirst"
                value={this.state.lastName}
                placeholder="optional"
                onChange={(e) => this.setState({ lastName: e.target.value })}
              />
            </EuiCompressedFormRow>
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiSmallButtonEmpty onClick={this.props.onCancel}>Cancel</EuiSmallButtonEmpty>

          <EuiSmallButton
            isDisabled={!this.state.firstName}
            onClick={() => {
              if (this.state.firstName) {
                this.props.onCreate({
                  firstName: this.state.firstName,
                  ...(this.state.lastName ? { lastName: this.state.lastName } : {}),
                });
              }
            }}
            fill
          >
            Create
          </EuiSmallButton>
        </EuiModalFooter>
      </div>
    );
  }
}
