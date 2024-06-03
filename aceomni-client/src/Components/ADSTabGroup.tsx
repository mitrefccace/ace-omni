import React, { useEffect } from 'react';
import { Tabs } from '@chakra-ui/tabs';
import './ADSTabStyle.css';

/**
 * Creates a Tab Group
 *
 * @description Provides context and state for all tab components
 *
 * @param id - Unique ID (required)
 * @param isManual - A boolean to determine whether the tab group has Manual Activation
 * @param isFitted - A boolean to add a fullscreen option for the tab group
 * @param children - Children to be inherited (<TabList />, <TabPanel />)
 *
 * @returns Tab Group
 *
 * https://chakra-ui-git-fix-typescript-autocomplete.chakra-ui.vercel.app/docs/components/tabs
 */

function ADSTabGroup(props: {
  id: string;
  children: React.ReactNode;
  isManual?: boolean;
  isFitted?: boolean;
}) {
  const {
    id, children, isManual, isFitted
  } = props;

  const buttons = document.getElementById(id)?.getElementsByTagName('button').length || 0;

  const setAriaDisabled = () => {
    for (let i = 0; i < buttons; i += 1) {
      document.getElementById(id)?.getElementsByTagName('button')[i].setAttribute('aria-disabled', 'false');
    }
  };

  useEffect(() => {
    setAriaDisabled();
  });

  return (
    <Tabs
      className={isFitted ? 'ads-tab-group' : 'ads-tab-group clustered'}
      id={id}
      isManual={isManual}
      isFitted={isFitted}
      defaultIndex={0}
    >
      {children}
    </Tabs>
  );
}

ADSTabGroup.defaultProps = {
  isManual: '',
  isFitted: ''
};

export default ADSTabGroup;
