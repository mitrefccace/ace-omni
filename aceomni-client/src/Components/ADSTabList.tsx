import React from 'react';
import { TabList } from '@chakra-ui/tabs';
import './ADSTabStyle.css';

/**
 * Creates a Tab List
 *
 * @description Wrapper for the Tab components
 *
 * @requires ADSTabList should only have ADSTab as children
 *
 * @param id - An id for css purposes
 *
 * @returns Tab List
 *
 * https://chakra-ui-git-fix-typescript-autocomplete.chakra-ui.vercel.app/docs/components/tabs
 */

function ADSTabList(props: {
  id?: string;
  children: any;
}) {
  const { id, children } = props;

  if (id) {
    return (
      <TabList
        id={id}
        className="ads-tab-list"
      >
        {children}
      </TabList>
    );
  }
  return (
    <TabList
      className="ads-tab-list"
    >
      {children}
    </TabList>
  );
}

ADSTabList.defaultProps = {
  id: ''
};

export default ADSTabList;
