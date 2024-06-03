import React from 'react';
import { TabPanels } from '@chakra-ui/tabs';
import './ADSTabStyle.css';

/**
 * Creates a Tab Panel List
 *
 * @description Wrapper for the ADSTabPanel components
 * @param id - An id for css purposes
 * @requires ADSPanelList should only have ADSPanel as children
 * @returns Tab List
 *
 * https://chakra-ui-git-fix-typescript-autocomplete.chakra-ui.vercel.app/docs/components/tabs
 */

function ADSPanelList(props: {
  id?: string;
  children: any;
}) {
  const { id, children } = props;

  if (id) {
    return (
      <TabPanels
        className="ads-panel-list"
        id={id}
      >
        {children}
      </TabPanels>
    );
  }
  return (
    <TabPanels
      className="ads-panel-list"
    >
      {children}
    </TabPanels>
  );
}

ADSPanelList.defaultProps = {
  id: ''
};

export default ADSPanelList;
