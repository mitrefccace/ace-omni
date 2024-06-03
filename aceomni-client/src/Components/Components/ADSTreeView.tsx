import React from 'react';
import 'devextreme/dist/css/dx.common.css';
import { Form } from 'react-bootstrap';
import TreeView from 'devextreme-react/tree-view';

function ADSTreeView(props: {
  treeRef?: any
  treeData: any,
  renderItem?: any,
  branchClicked: (itemData: any, eventData: any) => void
}) {
  const {
    treeRef, treeData, renderItem, branchClicked
  } = props;

  const localBranchClicked = (e: any) => {
    branchClicked(e.itemData, e);
  };

  // Datasource is the json that is read in to load the tree
  // DisplayExpr reads a string that determines the JSON value to display
  // KeyExpr is how it knows what level the data is on
  return (
    <Form style={{ paddingLeft: '26px' }}>
      <TreeView
        ref={treeRef}
        dataSource={treeData}
        dataStructure="plain"
        keyExpr="ID"
        parentIdExpr="parentId"
        displayExpr="name"
        selectionMode="single"
        itemRender={renderItem}
        onItemClick={localBranchClicked}
        // onItemSelectionChanged={localBranchClicked}
        selectByClick
        expandNodesRecursive={false}
        id="treeView"
      />
    </Form>
  );
}

ADSTreeView.defaultProps = {
  treeRef: null,
  renderItem: null
};

export default ADSTreeView;
