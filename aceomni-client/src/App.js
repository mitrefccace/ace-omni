import 'devextreme/dist/css/dx.light.css';
/* eslint-disable react/jsx-no-bind */
import React, { } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  // BrowserRouter,
  Route,
  RouterProvider,
  // Routes,
  Outlet
} from 'react-router-dom';
import {
  faHouse,
  faProjectDiagram,
  faBook,
  faGear
} from '@fortawesome/free-solid-svg-icons';
// import logo from './logo.svg';
import { Container, Col, Row } from 'react-bootstrap';
import PrivateRoute from './PrivateRoute';
import PrivateParticipantRoute from './PrivateParticipantRoute';
import './App.css';
import NavigationBar from './Components/Components/NavigationBar';
import ADSNavigationRailPanel from './Components/Components/ADSNavigationRailPanel';
import Login from './Components/Pages/Login';
import CSPCredentials from './Components/Pages/CSPCredentials';
import Landing from './Components/Pages/Landing';
import Library from './Components/Pages/Library';
import ParticipantLogin from './Components/Pages/Experiments/ParticipantLogin';
import ParticipantMainStudyPage from './Components/Pages/Experiments/ParticipantMainStudyPage';
import Users from './Components/Pages/Users';
import CreateProfile from './Components/Pages/CreateProfile';
import Experiment from './Components/Pages/Experiments/Experiment';
import CreateExperiment from './Components/Pages/Experiments/CreateExperiment';
import Sandbox from './Components/Sandbox.tsx';
import TablePage from './Components/TablePage.tsx';
import Research from './Components/Research/Research';
import Study from './Components/Study';
import StudyOverview from './Components/Pages/StudyOverview';
import ErrorPage from './Components/Pages/ErrorPage404';
import Admin from './Components/Pages/Admin';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'devextreme/dist/css/dx.common.css';
import './type_scale.css';

/*
  <div data-testid="container">
      <div className="app-body-content">
        <NavigationPanelRail />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
*/

function Layout() {
  let navigationMenuItems = null;
  if (sessionStorage.getItem('omniRole') === 'systemAdministrator') {
    navigationMenuItems = [
      {
        icon: faHouse, id: 'home', label: 'Home', action: '/landing'
      },
      {
        icon: faProjectDiagram, id: 'projects', label: 'Studies', action: '/Study'
      },
      {
        icon: faBook, id: 'library', label: 'Library', action: '/library'
      },
      { value: 'divider', id: 'divider' },
      {
        icon: faGear, id: 'sysadmin', label: 'System Administration', action: '/admin'
      }
    ];
  } else {
    navigationMenuItems = [
      {
        icon: faHouse, id: 'home', label: 'Home', action: '/landing'
      },
      {
        icon: faProjectDiagram, id: 'projects', label: 'Studies', action: '/Study'
      },
      {
        icon: faBook, id: 'library', label: 'Library', action: '/library'
      }
    ];
  }

  return (
    <Container no-gutters="true" fluid style={{ padding: '0', height: '100vh', position: 'fixed' }}>
      <ADSNavigationRailPanel
        menuItems={navigationMenuItems}
      />
      <Container no-gutters="true" fluid style={{ padding: '0' }}>
        <Row>
          <Col style={{ paddingLeft: '0', paddingRight: '0' }}>
            <NavigationBar />
          </Col>
        </Row>
        <Row style={{ overflow: 'auto', paddingBottom: '60px', maxHeight: '100vh' }}>
          <Outlet />
        </Row>
      </Container>
    </Container>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route
          path="landing"
          element={(
            <PrivateRoute>
              <Landing />
            </PrivateRoute>
          )}
        />
        <Route
          path="library"
          element={(
            <PrivateRoute>
              <Library />
            </PrivateRoute>
          )}
        />
        <Route
          path="admin"
          element={(
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          )}
        />
        <Route
          path="Users"
          element={(
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          )}
        />
        <Route
          path="/cspcredentials"
          element={(
            <PrivateRoute>
              <CSPCredentials />
            </PrivateRoute>
          )}
        />
        <Route
          path="CreateUser"
          element={(
            <PrivateRoute>
              <CreateProfile />
            </PrivateRoute>
          )}
        />
        <Route
          path="Study"
          element={(
            <PrivateRoute>
              <Experiment />
            </PrivateRoute>
          )}
        />
        <Route
          path="StudyOverview/:studyID"
          element={(
            <PrivateRoute>
              <StudyOverview />
            </PrivateRoute>
          )}
        />
        <Route
          path="EditStudy/:studyID"
          element={(
            <PrivateRoute>
              <CreateExperiment />
            </PrivateRoute>
          )}
        />
        <Route
          path="CreateStudy"
          element={(
            <PrivateRoute>
              <CreateExperiment />
            </PrivateRoute>
          )}
        />
      </Route>
      <Route
        path="Experiment/:moduleType/:experimentAlias"
        element={(
          <ParticipantLogin />
        )}
      />
      <Route
        path="/Experiment/:moduleType/:experimentAlias/:configurationName/:participantName/:participantExt"
        element={(
          <PrivateParticipantRoute>
            <ParticipantMainStudyPage />
          </PrivateParticipantRoute>
        )}
      />
      <Route
        path="login"
        element={
          <Login />
        }
      />
      <Route
        path="sandbox"
        element={(
          <Sandbox />
        )}
      />
      <Route
        path="tablepage"
        element={(
          <TablePage />
        )}
      />
      <Route
        path="exp"
        element={
          <Study />
        }
      />
      <Route
        path="exp/:id"
        element={
          <Research />
        }
      />
      <Route
        path="error"
        element={
          <ErrorPage />
        }
      />
      <Route
        path="*"
        element={
          <ErrorPage />
        }
      />
    </>
  ),
  {
    basename: process.env.REACT_APP_LOCATION
  }
);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
