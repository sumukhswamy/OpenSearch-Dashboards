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

import React, { Component } from 'react';

import {
  EuiCompressedFormRow,
  EuiCompressedFieldText,
  EuiSmallButton,
  EuiCompressedSwitch,
  EuiSmallButtonEmpty,
  EuiModalHeader,
  EuiModalFooter,
  EuiModalBody,
  EuiModalHeaderTitle,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { i18n } from '@osd/i18n';
import { IEmbeddable } from '../../../../';

interface CustomizePanelProps {
  embeddable: IEmbeddable;
  updateTitle: (newTitle: string | undefined, hideTitle: boolean | undefined) => void;
  cancel: () => void;
}

interface State {
  title: string | undefined;
  hideTitle: boolean | undefined;
}

export class CustomizePanelModal extends Component<CustomizePanelProps, State> {
  constructor(props: CustomizePanelProps) {
    super(props);
    this.state = {
      hideTitle: props.embeddable.getInput().hidePanelTitles,
      title: props.embeddable.getInput().title ?? this.props.embeddable.getOutput().defaultTitle,
    };
  }

  private reset = () => {
    this.setState({
      title: this.props.embeddable.getOutput().defaultTitle,
    });
  };

  private onHideTitleToggle = () => {
    this.setState((prevState) => ({
      hideTitle: !prevState.hideTitle,
    }));
  };

  private save = () => {
    const newTitle =
      this.state.title === this.props.embeddable.getOutput().defaultTitle
        ? undefined
        : this.state.title;
    this.props.updateTitle(newTitle, this.state.hideTitle);
  };

  public render() {
    return (
      <React.Fragment>
        <EuiModalHeader>
          <EuiModalHeaderTitle data-test-subj="customizePanelTitle">
            Customize panel
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiCompressedFormRow>
            <EuiCompressedSwitch
              checked={!this.state.hideTitle}
              data-test-subj="customizePanelHideTitle"
              id="hideTitle"
              label={
                <FormattedMessage
                  defaultMessage="Show panel title"
                  id="embeddableApi.customizePanel.modal.showTitle"
                />
              }
              onChange={this.onHideTitleToggle}
            />
          </EuiCompressedFormRow>
          <EuiCompressedFormRow
            label={i18n.translate(
              'embeddableApi.customizePanel.modal.optionsMenuForm.panelTitleFormRowLabel',
              {
                defaultMessage: 'Panel title',
              }
            )}
          >
            <EuiCompressedFieldText
              id="panelTitleInput"
              data-test-subj="customEmbeddablePanelTitleInput"
              name="min"
              type="text"
              disabled={this.state.hideTitle}
              value={this.state.title || ''}
              onChange={(e) => this.setState({ title: e.target.value })}
              aria-label={i18n.translate(
                'embeddableApi.customizePanel.modal.optionsMenuForm.panelTitleInputAriaLabel',
                {
                  defaultMessage: 'Enter a custom title for your panel',
                }
              )}
              append={
                <EuiSmallButtonEmpty
                  data-test-subj="resetCustomEmbeddablePanelTitle"
                  onClick={this.reset}
                  disabled={this.state.hideTitle}
                >
                  <FormattedMessage
                    id="embeddableApi.customizePanel.modal.optionsMenuForm.resetCustomDashboardButtonLabel"
                    defaultMessage="Reset"
                  />
                </EuiSmallButtonEmpty>
              }
            />
          </EuiCompressedFormRow>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiSmallButtonEmpty onClick={() => this.props.cancel()}>
            <FormattedMessage
              id="embeddableApi.customizePanel.modal.cancel"
              defaultMessage="Cancel"
            />
          </EuiSmallButtonEmpty>

          <EuiSmallButton data-test-subj="saveNewTitleButton" onClick={this.save} fill>
            <FormattedMessage
              id="embeddableApi.customizePanel.modal.saveButtonTitle"
              defaultMessage="Save"
            />
          </EuiSmallButton>
        </EuiModalFooter>
      </React.Fragment>
    );
  }
}
