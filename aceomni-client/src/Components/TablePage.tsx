import React, {
  useEffect, useCallback, useState, useMemo
} from 'react';
import {
  faCalendarDays, faVideoCamera, faDownload, faGear
} from '@fortawesome/free-solid-svg-icons';
import differenceBy from 'lodash/differenceBy';
import ADSIconButton from './ADSIconButton';
import ADSDataTable from './ADSDataTable';
import ADSButton from './ADSButton';

import './Sandbox.css';

/**
 * Placeholder example of react data table
 * @returns data table example
 */
export default function Sandbox() {
  useEffect(() => {
  }, []);

  const sayHello = useCallback((a:any) => {
    console.log('Hello from Click!', a);
    // remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const tableCols = [
    {
      name: 'Title',
      selector: (row: any) => row.title,
      sortable: true
    },
    {
      name: 'Year',
      selector: (row: any) => row.year,
      sortable: true
    },
    {

      /* eslint-disable react/no-unstable-nested-components */
      cell: (row:any) => (<span><ADSIconButton onClick={() => sayHello(row.title)} variant="standard" height="small" icon={faVideoCamera} ariaLabel="standard icon" /><ADSIconButton onClick={() => sayHello(row.year)} variant="standard" height="small" icon={faCalendarDays} ariaLabel="standard icon" /></span>),
      allowOverflow: false,
      button: true,
      width: '56px',
      style: { 'white-space': 'nowrap;' }
    }
  ];

  const tableData = [
    {
      id: 1,
      title: 'Beetlejuice',
      year: '1988'
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984'
    },
    {
      id: 3,
      title: 'Tommy Boy',
      year: '1995'
    },
    {
      id: 4,
      title: 'Die Hard',
      year: '1988'
    },
    {
      id: 5,
      title: 'My Cousin Vinny',
      year: '1992'
    },
    {
      id: 6,
      title: 'Forrest Gump',
      year: '1994'
    },
    {
      id: 7,
      title: 'Jaws',
      year: '1975'
    },
    {
      id: 8,
      title: 'Back to the Future',
      year: '1985'
    },
    {
      id: 9,
      title: 'Old School',
      year: '2003'
    },
    {
      id: 10,
      title: 'Pitch Perfect',
      year: '2012'
    },
    {
      id: 11,
      title: 'The Perfect Storm',
      year: '2000'
    },
    {
      id: 12,
      title: 'Groundhog Day',
      year: '1993'
    }
  ];

  const pad = {
    padding: '5px 30px 20px'
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(tableData);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = useMemo(() => {
    const handleDelete = () => {
      // eslint-disable-next-line no-alert
      if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map((r:any) => r.title)}?`)) {
        setToggleCleared(!toggleCleared);
        setData(differenceBy(data, selectedRows, 'title'));
      }
    };
    return (
      <ADSButton onClick={handleDelete} variant="secondary" buttonText="Delete" />
    );
  }, [data, selectedRows, toggleCleared]);

  const subheader = (
    <>
      <ADSIconButton onClick={() => sayHello('Hello')} variant="standard" height="large" icon={faDownload} ariaLabel="standard icon" />
      <ADSIconButton onClick={() => sayHello('Hello')} variant="standard" height="large" icon={faGear} ariaLabel="standard icon" />
      <ADSButton onClick={() => sayHello('Hello')} variant="primary" buttonText="Primary Button" />
    </>
  );

  return (
    <main>
      <div className="h2" style={pad}>
        <br />
        Data Tables
        <br />
        <sub><a href="https://react-data-table-component.netlify.app/" target="_blank" rel="noreferrer"> react-data-table-component documentation</a></sub>
      </div>
      <div style={pad}>
        <ADSDataTable
          title="Movies"
          columns={tableCols}
          data={data}
          selectableRows
          contextActions={contextActions}
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          // selectableRowsRadio
          // selectableRowsSingle
          pagination
          searchEnabled
          subHeaderComponent={subheader}
        />
      </div>
    </main>
  );
}
