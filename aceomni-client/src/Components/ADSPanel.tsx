import React from 'react';
import { TabPanel } from '@chakra-ui/tabs';
import './ADSTabStyle.css';

/**
 * Creates a Tab Panel
 *
 * @description element that contains the content associated with a tab
 * @param id - An id for css purposes
 * @returns Tab Panel
 *
 * https://chakra-ui-git-fix-typescript-autocomplete.chakra-ui.vercel.app/docs/components/tabs
 */

function ADSPanel(props: {
  id?: string;
  children: any;
}) {
  const { id, children } = props;

  return (
    <TabPanel
      id={id}
    >
      {children}
    </TabPanel>
  );
}

ADSPanel.defaultProps = {
  id: ''
};

export default ADSPanel;
