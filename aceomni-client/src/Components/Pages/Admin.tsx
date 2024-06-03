import React, { } from 'react';
import ADSTabGroup from '../ADSTabGroup';
import ADSTabList from '../ADSTabList';
import ADSTab from '../ADSTab';
import ADSPanelList from '../ADSPanelList';
import ADSPanel from '../ADSPanel';
import Users from './Users';
import CSPCredentials from './CSPCredentials';
import './pages.css';

function Admin() {
  return (
    <main className="admin-container">
      <div className="admin-tab-container">
        <ADSTabGroup id="admin-tab-group" isManual>
          <ADSTabList>
            <ADSTab>User Management</ADSTab>
            <ADSTab>CSP Account Credentials</ADSTab>
            <ADSTab>Server Management</ADSTab>
          </ADSTabList>
          <ADSPanelList>
            <ADSPanel>
              <div className="admin-desc">
                <i>Allows creation, modification and deleteion of user accounts for ACE Omni.
                </i>
                <b> This is for System Administrators only.</b>
              </div>
              <Users />
            </ADSPanel>
            <ADSPanel>
              <div className="admin-desc">
                <i>
                  Allows entry and modification of cloud service
                  provider account credentials, including keys,
                  logins, passwords, tokens and certificates.
                </i>
                <b> This is for System Administrators only.</b>
              </div>
              <CSPCredentials />
            </ADSPanel>
            <ADSPanel>
              <div className="admin-desc">Server Mangement TBD</div>
            </ADSPanel>
          </ADSPanelList>
        </ADSTabGroup>
      </div>
    </main>
  );
}

export default Admin;
