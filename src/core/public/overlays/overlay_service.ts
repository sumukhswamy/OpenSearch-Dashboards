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

import { I18nStart } from '../i18n';
import { IUiSettingsClient } from '../ui_settings';
import { OverlayBannersStart, OverlayBannersService } from './banners';
import { FlyoutService, OverlayFlyoutStart } from './flyout';
import { ModalService, OverlayModalStart } from './modal';
import { SidecarService, OverlaySidecarStart } from './sidecar';

interface StartDeps {
  i18n: I18nStart;
  targetDomElement: HTMLElement;
  uiSettings: IUiSettingsClient;
}

/** @internal */
export class OverlayService {
  private bannersService = new OverlayBannersService();
  private modalService = new ModalService();
  private flyoutService = new FlyoutService();
  private sidecarService = new SidecarService();

  public start({ i18n, targetDomElement, uiSettings }: StartDeps): OverlayStart {
    const flyoutElement = document.createElement('div');
    targetDomElement.appendChild(flyoutElement);
    const flyouts = this.flyoutService.start({ i18n, targetDomElement: flyoutElement });

    const banners = this.bannersService.start({ i18n, uiSettings });

    const modalElement = document.createElement('div');
    targetDomElement.appendChild(modalElement);
    const modals = this.modalService.start({ i18n, targetDomElement: modalElement });
    const sidecarElement = document.createElement('div');
    targetDomElement.appendChild(sidecarElement);
    const sidecars = this.sidecarService.start({
      i18n,
      targetDomElement: sidecarElement,
    });

    return {
      banners,
      openFlyout: flyouts.open.bind(flyouts),
      closeFlyout: flyouts.close.bind(flyouts),
      openModal: modals.open.bind(modals),
      openConfirm: modals.openConfirm.bind(modals),
      sidecar: sidecars,
    };
  }
}

/** @public */
export interface OverlayStart {
  /** {@link OverlayBannersStart} */
  banners: OverlayBannersStart;
  /** {@link OverlayFlyoutStart#open} */
  openFlyout: OverlayFlyoutStart['open'];
  /** {@link OverlayFlyoutStart#close} */
  closeFlyout: OverlayFlyoutStart['close'];
  /** {@link OverlayModalStart#open} */
  openModal: OverlayModalStart['open'];
  /** {@link OverlayModalStart#openConfirm} */
  openConfirm: OverlayModalStart['openConfirm'];
  /** {@link OverlaySidecarStart#open} */
  sidecar: OverlaySidecarStart;
}
