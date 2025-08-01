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
import { i18n } from '@osd/i18n';
import { UiActionsStart } from 'src/plugins/ui_actions/public';

import { CoreStart } from 'src/core/public';
import { toMountPoint } from '../../../../../../opensearch_dashboards_react/public';
import { EmbeddableFactoryDefinition } from '../../../embeddables';
import { Container } from '../../../containers';
import { ContactCardEmbeddable, ContactCardEmbeddableInput } from './contact_card_embeddable';
import { ContactCardInitializer } from './contact_card_initializer';

export const CONTACT_CARD_EMBEDDABLE = 'CONTACT_CARD_EMBEDDABLE';

export class ContactCardEmbeddableFactory
  implements EmbeddableFactoryDefinition<ContactCardEmbeddableInput> {
  public readonly type = CONTACT_CARD_EMBEDDABLE;

  constructor(
    private readonly execTrigger: UiActionsStart['executeTriggerActions'],
    private readonly overlays: CoreStart['overlays']
  ) {}

  public async isEditable() {
    return true;
  }

  public getDisplayName() {
    return i18n.translate('embeddableApi.samples.contactCard.displayName', {
      defaultMessage: 'contact card',
    });
  }

  public getExplicitInput = (): Promise<Partial<ContactCardEmbeddableInput>> => {
    return new Promise((resolve) => {
      const modalSession = this.overlays.openModal(
        toMountPoint(
          <ContactCardInitializer
            onCancel={() => {
              modalSession.close();
              // @ts-expect-error TS2345 TODO(ts-error): fixme
              resolve(undefined);
            }}
            onCreate={(input: { firstName: string; lastName?: string }) => {
              modalSession.close();
              resolve(input);
            }}
          />
        ),
        {
          'data-test-subj': 'createContactCardEmbeddable',
        }
      );
    });
  };

  public create = async (initialInput: ContactCardEmbeddableInput, parent?: Container) => {
    return new ContactCardEmbeddable(
      initialInput,
      {
        execAction: this.execTrigger,
      },
      parent
    );
  };
}
