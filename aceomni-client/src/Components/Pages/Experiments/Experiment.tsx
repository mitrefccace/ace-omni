import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  // faEllipsisV,
  faCirclePlus
} from '@fortawesome/free-solid-svg-icons';

// import ADSButton from '../../ADSButton';
// import ADSDialog from '../../ADSDialog';
import ADSDataTable from '../../ADSDataTable';
import ADSSplitButton from '../../ADSSplitButton';
// import ADSIconButton from '../../ADSIconButton';
import ADSLink from '../../Components/ADSLink';

function Experiment() {
  const navigate = useNavigate();
  const [experimentTableData, setExperimentTableData] = useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [open, setOpen] = useState(false);

  // Used for create study experiment
  const createOptions = [
    {
      id: 0,
      value: 'Project',
      label: 'New Project'
    },
    {
      id: 1,
      value: 'Study',
      label: 'New Study'
    }
  ];

  const handleCreateStudy = (options: any) => {
    // TODO Determine difference between these options
    if (options.value === 'Study') {
      navigate('/CreateStudy');
    } else {
      navigate('/CreateStudy');
    }
  };
  // End Used for create study experiment

  // Functions for updating menu button selection
  // const shareDownloadStudy = (options: any) => {
  //   if (options.value === 'Share') {
  //     navigate(options.path);
  //   }
  // };

  // Used for the experiment table
  const tableCols = [
    {
      name: 'Name',
      selector: (row: any) => row.name,
      sortable: true,
      /* eslint-disable react/no-unstable-nested-components */
      cell: (row: any) => (
        <ADSLink
          url={`/StudyOverview/${row.alias}`}
          linkText={row.name.length > 27 ? `${row.name.slice(0, 27)}...` : row.name}
          fontType="body1"
          isExternal={false}
          isNavigational
        />
      )
    },
    {
      name: 'Phase',
      selector: (row: any) => row.phase,
      sortable: true
    },
    {
      name: 'Last Modified',
      selector: (row: any) => row.lastModified,
      sortable: true
    },
    {
      name: 'Modified By',
      selector: (row: any) => row.modifiedBy,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row: any) => row.type,
      sortable: true
    }
    // {

    //   /* eslint-disable react/no-unstable-nested-components */
    //   cell: (row: any) => (
    //     <span>
    //       <ADSIconButton
    //         ariaLabel="Share or download study"
    //         height="medium"
    //         icon={faEllipsisV}
    //         onClick={() => null}
    //         hasMenu
    //         variant="standard"
    //         size="med"
    //         menuOptions={
    //           [
    //             {
    //               id: '0',
    //               value: 'Share',
    //               path: `/Experiment/${row.alias}/${row.moduleName}`,
    //               label: 'Share'
    //             },
    //             {
    //               id: '1',
    //               value: 'Download',
    //               label: 'Download'
    //             }
    //           ]
    //         }
    //         alignOption="right-start"
    //         setMenuOption={shareDownloadStudy}
    //         menuButtonID="createStudyMenuButton"
    //         menuID="createStudyMenu"
    //       />
    //     </span>
    //   ),

    //   allowOverflow: false,
    //   button: true,
    //   width: '56px',
    //   style: { 'white-space': 'nowrap;', 'z-index': '989' }
    // }
  ];

  const subheader = (
    <span>
      <ADSSplitButton
        icon={faCirclePlus}
        buttonText="New"
        variant="primary"
        height="medium"
        onButtonClick={() => navigate('/CreateStudy')}
        menuOptions={createOptions}
        menuWidth="200px"
        onItemClick={handleCreateStudy}
        menuButtonID="test_splitButtonID1_medium"
        menuID="test_splitID1_medium"
        menuButtonAriaLabel="Create Study"
      />
    </span>
  );

  // End used for experiment table

  // const handleDialogClose = () => {
  //   setOpen(false);
  // };

  async function loadExperiments() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/experiment/getExperiments/${sessionStorage.getItem('omniUsername')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(async (response: {
      ok: boolean; json: () => any; status: {
        toString: () => string;
      };
    }) => {
      if (response.ok) {
        if (response.status === 200) {
          const data = await response.json();
          // console.log('user', sessionStorage.getItem('omniUsername'));
          // console.log('loadExperiments:', data);
          const currentData = [];
          const result = data.queryResult;
          for (let i = 0; i < data.queryResult.length; i += 1) {
            currentData.push({
              /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
              id: result[i]._id,
              name: result[i].name,
              phase: result[i].phase,
              lastModified: result[i].lastModifiedDate,
              modifiedBy: result[i].modifiedBy,
              type: 'Study', // --CW: add to db?
              moduleName: result[i].modules[0]?.type, // --CW: What is this doing?
              alias: result[i].alias
            });
          }

          setExperimentTableData(currentData);
        } else {
          const data = await response.json();
          console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
        }
      } else {
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
  }

  // async function deleteExperiment(id: string) {
  //   await fetch(`${process.env.REACT_APP_LOCATION}/api/experiment/deleteExperiment`, {
  //     method: 'POST',
  //     body: JSON.stringify(
  //       {
  //         id
  //       }
  //     ),
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json'
  //     }
  //   }).then(async (response: {
  //     ok: boolean; json: () => any; status: {
  //       toString: () => string;
  //     };
  //   }) => {
  //     if (response.ok) {
  //       // Check different response
  //       if (response.status === 200) {
  //         // Good response.
  // Alert the user of success and clear fields for making another profile
  //       } else {
  //         const data = await response.json();
  //         console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
  //       }
  //     } else {
  //       const data = await response.json();
  //       console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
  //     }
  //   });

  //   handleDialogClose();
  //   loadExperiments();
  // }

  useEffect(() => {
    loadExperiments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
        <ADSDataTable
          title=""
          columns={tableCols}
          data={experimentTableData}
          selectableRows
          onSelectedRowsChange={() => true}
          clearSelectedRows={false}
          // selectableRowsRadio
          // selectableRowsSingle
          pagination
          searchEnabled
          subHeaderComponent={subheader}
        />
      </div>
      {/* <ADSDialog
        title="Delete Experiment"
        buttons={(
          <><ADSButton onClick={() => deleteExperiment('')} buttonText="Delete" />
            <ADSButton onClick={handleDialogClose} buttonText="Cancel" />
          </>
        )}
        onClose={handleDialogClose}
        open={open}
        width="xs"
      /> */}
    </Container>
  );
}

export default Experiment;
