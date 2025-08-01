/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { NewExperienceBanner } from './new_experience_banner';
import {
  HIDE_NEW_DISCOVER_LOCAL_STORAGE_KEY,
  NEW_DISCOVER_INFO_URL,
  SHOW_CLASSIC_DISCOVER_LOCAL_STORAGE_KEY,
} from '../constants';

describe('NewExperienceBanner', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the banner correctly', () => {
    render(<NewExperienceBanner />);
    expect(screen.getByTestId('exploreNewExperienceBanner')).toBeInTheDocument();
  });

  it('hides the banner if clicking on dismiss button', () => {
    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.setItem = jest.fn();
    render(<NewExperienceBanner />);
    fireEvent.click(screen.getByTestId('closeCallOutButton'));
    expect(screen.queryByTestId('exploreNewExperienceBanner')).not.toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith(HIDE_NEW_DISCOVER_LOCAL_STORAGE_KEY, 'true');
  });

  it('does not render the banner if local storage has previously been set', () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem = jest.fn((key) =>
      key === HIDE_NEW_DISCOVER_LOCAL_STORAGE_KEY ? 'true' : null
    );
    render(<NewExperienceBanner />);
    expect(screen.queryByTestId('exploreNewExperienceBanner')).not.toBeInTheDocument();
  });

  it('renders the Learn More link correctly', () => {
    render(<NewExperienceBanner />);
    const learnMoreLink = screen.getByTestId('exploreNewExperienceBanner__learnMore');
    expect(learnMoreLink.getAttribute('href')).toBe(NEW_DISCOVER_INFO_URL);
    expect(learnMoreLink.getAttribute('target')).toBe('_blank');
  });

  it('renders the switch link correctly', () => {
    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.setItem = jest.fn();
    render(<NewExperienceBanner />);
    fireEvent.click(screen.getByTestId('exploreNewExperienceBanner__switch'));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      SHOW_CLASSIC_DISCOVER_LOCAL_STORAGE_KEY,
      'true'
    );
  });
});
