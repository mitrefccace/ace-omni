import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataTable, { IDataTableProps } from 'react-data-table-component';
import ADSSingleLineTextField from './ADSSingleLineTextField';

import './ADSDataTable.css';
import '../global_colors.css';

interface ADSDataTableProps extends IDataTableProps<any> {
  searchEnabled?: boolean;
  selectableRowsRadio?: boolean;
  expandableRows?: boolean;
  expandableRowsComponent?: any;
  title?: string;
  id?: string;
}

// Table style
const customStyles = {
  table: {
    style: {
      zindex: -1,
      borderLeft: '1px solid var(--ADS_Grayscale_30)',
      borderBottom: '1px solid var(--ADS_Grayscale_30)',
      borderRight: '1px solid var(--ADS_Grayscale_30)',
      whiteSpace: 'inherit'
    }
  },
  headCells: {
    style: {
      backgroundColor: 'var(--ADS_Grayscale_20)',
      borderRight: '1px solid var(--ADS_Grayscale_30)',
      fontWeight: 'bold',
      whiteSpace: 'inherit'
    }
  },
  header: {
    style: {
      paddingLeft: '0px',
      overflow: 'visible'
    }
  },
  contextMenu: {
    style: {
      backgroundColor: 'orange', // 'var(--ADS_Blue_T10)',
      color: 'var(--ADS_White)',
      visibility: 'hidden'
    }
  },
  headRow: {
    style: {
      backgroundColor: 'var(--ADS_Grayscale_20)'
    }
  },
  cells: {
    style: {
      paddingRight: '8px',
      borderRight: '1px solid var(--ADS_Grayscale_30)',
      borderBottom: '1px solid var(--ADS_Grayscale_30)',
      whiteSpace: 'inherit'
    }
  },
  rows: {
    selectedHighlightStyle: {
      '&:nth-of-type(n)': {
        backgroundColor: 'var(--ADS_Blue_T90)'
      }
    }
  },
  expanderRow: {
    style: {
      borderRight: '1px solid var(--ADS_Grayscale_30)',
      borderBottom: '1px solid var(--ADS_Grayscale_30)'
    }
  }
};

/**
 * Creates data table shown in Study Overview, Step 7 in create/edit study, and users in settings
 * @param searchEnabled - Optional prop to enable search; true | false
 * @param selectableRowsRadio - Optional prop to enable radio checkboxes; true | false
 * @param expandableRows - Optional prop to allow expandable rows on table; true | false
 * @param expandableRowsComponent - Optional prop to expand specific rows
 * @param title - Optional prop of table title
 * @param id - Optional prop of table id
 * @returns Data table
 */

function ADSDataTable(props: ADSDataTableProps) {
  const {
    data, title, searchEnabled, selectableRowsRadio,
    subHeaderComponent, id, expandableRows, expandableRowsComponent
  } = props;

  const [filterText, setFilterText] = useState('');
  const filteredItems = data.filter((item) => {
    const values: any = Object.values(item);
    for (let i = 0; i < values.length; i += 1) {
      try {
        if (values[i] && values[i].toString().toLowerCase().includes(filterText.toLowerCase())) {
          return true;
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
    return false;
  });

  const updateFilterText = (value: any) => {
    setFilterText(value);
  };

  const selectableRowsComponentProps = useMemo(() => (
    {
      type: selectableRowsRadio ? 'radio' : 'checkbox'
    }), [selectableRowsRadio]);

  let titleRowContent = null;
  if (searchEnabled) {
    titleRowContent = (
      <>
        <Row>
          <Col>
            {title}
          </Col>
        </Row>
        <Row className="search-enabled-row">
          <Col sm={3} className={''}>
            <ADSSingleLineTextField
              formText={filterText}
              setFormText={updateFilterText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Search"
              hasDelete={false}
              fieldSize="small"
              elementID="id3"
            />
          </Col>
          <Col sm={9} className="d-flex justify-content-end">
            {subHeaderComponent}
          </Col>
        </Row>
      </>
    );
  }

  return (
    <Row>
      <Col lg={12} id={id}>
        <DataTable
          /* eslint-disable react/jsx-props-no-spreading */
          {...props}
          title={titleRowContent}
          data={filteredItems}
          customStyles={customStyles}
          // selectableRowsComponent={ADSCheckbox} // TODO: select all does not work
          // paginationComponent={ADSPagination} // TODO: implement once pagination is finished
          /* eslint-disable react/jsx-boolean-value */
          paginationResetDefaultPage={true}
          /* eslint-disable react/jsx-boolean-value */
          persistTableHead={true}
          selectableRowsComponentProps={selectableRowsComponentProps}
          selectableRowsHighlight
          expandableRows={expandableRows}
          expandableRowsComponent={expandableRowsComponent}
        />
      </Col>
    </Row>
  );
}

ADSDataTable.defaultProps = {
  searchEnabled: true,
  selectableRowsRadio: false,
  expandableRows: false,
  expandableRowsComponent: null,
  title: '',
  id: ''
};

export default ADSDataTable;
