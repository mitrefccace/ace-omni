import React from 'react';
import { Tab } from '@chakra-ui/tabs';
import './ADSTabStyle.css';

/**
 * Creates a Tab
 *
 * @description element that serves as a label for
 * one of the tab panels and can be activated
 * to display that panel.
 *
 * @param isDisabled - A boolean to disable or enable a tab
 *
 * @returns Tab
 *
 * https://chakra-ui-git-fix-typescript-autocomplete.chakra-ui.vercel.app/docs/components/tabs
 */

function ADSTab(props: {
  children: any;
  isDisabled?: boolean;
}) {
  const {
    children, isDisabled
  } = props;

  return (
    <Tab
      isDisabled={isDisabled}
      className="ads-tab"
    >
      {children}
    </Tab>
  );
}

ADSTab.defaultProps = {
  isDisabled: ''
};

export default ADSTab;
