/* eslint-disable no-underscore-dangle */
import React, {
  useEffect, useState, useCallback
} from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ADSAlert from '../ADSAlert';
import ADSButton from '../ADSButton';
import ADSTooltip from '../ADSTooltip';
import ADSDataTable from '../ADSDataTable';
import ADSIconButton from '../ADSIconButton';
import './pages.css';

function Users() {
  const navigate = useNavigate();

  const [userList, setUserList] = useState<any>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSuccessAlertUsername, setShowSuccessAlertMsg] = useState('');
  const [showFailAlert, setShowFailAlert] = useState(false);
  const [showFailAlertUsername, setShowFailAlertMsg] = useState('');

  const triggerSuccessAlert = useCallback((username) => {
    setShowSuccessAlertMsg(`User ${username} successfully deleted.`);
    setShowSuccessAlert(!showSuccessAlert);
  }, [showSuccessAlert]);

  const triggerFailAlert = useCallback((username) => {
    setShowFailAlertMsg(`User ${username} was NOT deleted because of an error.`);
    setShowFailAlert(!showFailAlert);
  }, [showFailAlert]);

  async function deleteUser(id: string, username: string) {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Are you sure you want to delete user: \r ${username}?`)) {
      return;
    }
    await fetch(`${process.env.REACT_APP_LOCATION}/api/users/deleteUser`, {
      method: 'POST',
      body: JSON.stringify(
        {
          id
        }
      ),
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
          triggerSuccessAlert(username);
        } else {
          const data = await response.json();
          triggerFailAlert(username);
          console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
        }
      } else {
        const data = await response.json();
        triggerFailAlert(username);
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getUsers();
  }

  async function getUsers() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/users/getUsers`, {
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
          setUserList(data.queryResult);
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

  const tableCols = [
    {
      name: 'Username',
      selector: (row: any) => row.username,
      sortable: true
    },
    {
      name: 'First',
      selector: (row: any) => row.firstname,
      sortable: true
    },

    {
      name: 'Last',
      selector: (row: any) => row.lastname,
      sortable: true
    },
    {
      name: 'Role',
      selector: (row: any) => row.role,
      sortable: true
    },
    {
      /* eslint-disable react/no-unstable-nested-components */
      cell: (row: any) => (
        (row.username !== sessionStorage.getItem('omniUsername'))
          ? (
            <ADSTooltip content="Delete User" placement="left">
              <ADSIconButton
                onClick={() => deleteUser(row._id, row.username)}
                variant="standard"
                height="small"
                icon={faTrash}
                ariaLabel="Delete User"
              />
            </ADSTooltip>
          )
          : (
            <ADSTooltip content="Delete User disabled for logged in user" placement="left">
              <ADSIconButton
                onClick={() => deleteUser(row._id, row.username)}
                variant="standard"
                height="small"
                icon={faTrash}
                ariaLabel="Delete User disabled for logged in user"
                disabled
              />
            </ADSTooltip>
          )
      ),
      allowOverflow: false,
      button: true,
      width: '56px',
      style: { 'white-space': 'nowrap;' }
    }
  ];

  useEffect(() => {
    // TODO Load study list
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subheader = (
    <ADSButton onClick={() => navigate('/CreateUser')} buttonText="Create New User" />
  );

  return (
    <main>
      <ADSAlert
        alertText={showSuccessAlertUsername}
        alertType="success"
        isDismissible
        autoClose
        showAlert={showSuccessAlert}
        setShowAlert={setShowSuccessAlert}
        fontType="body1"
      />
      <ADSAlert
        alertText={showFailAlertUsername}
        alertType="danger"
        isDismissible
        autoClose
        showAlert={showFailAlert}
        setShowAlert={setShowFailAlert}
        fontType="body1"
      />
      <Container>
        <Row id="users-row">
          <ADSDataTable
            columns={tableCols}
            data={userList}
            pagination
            searchEnabled
            id="users-data-table"
            subHeaderComponent={subheader}
          />
        </Row>
      </Container>
    </main>
  );
}

export default Users;
