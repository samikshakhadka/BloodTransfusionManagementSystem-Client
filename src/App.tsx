import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Donor from './pages/Donor';
import PatientWaitlist from './pages/PatientWaitlist';
import Hospital from './pages/Hospital';
import Homepage from './pages/Homepage';
import Inventory from './pages/Inventory';
import CreateDonor from './components/Forms/CreateDonor';
import EditDonor from './components/Forms/EditDonor';
import CreateHospital from './components/Forms/CreateHospital';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HospitalProfile from './pages/HospitalProfile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AddAdmin from './components/Forms/AddAdmin';
import AddPatient from './components/Forms/AddPatient';
import EditPatientWaitlist from './components/Forms/EditPatientWaitlist';
import { AdminRoutes, PreventedRoute } from './Prevented';
import EditHospital from './components/Forms/EditHospital';
import ResetPassword from './components/Forms/ResetPassword';
import EmailVerify from './components/Forms/EmailVerify';
import UserProfile from './pages/UserProfile';
import WardRepresentatives from './pages/WardRepresentatives';
import { SuperAdminRoutes } from './Prevented';
import AddRepresentative from './components/Forms/Addrepresentative';
import EditRepresentative from './components/Forms/EditRepresentative';
import EditAdmin from './components/Forms/EditAdminFull';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PreventedRoute>
            <Homepage />
          </PreventedRoute>
        }
      />
      <Route
        path="/patientwaitlist"
        element={
          <PreventedRoute>
            <PatientWaitlist />
          </PreventedRoute>
        }
      />
      <Route
        path="/donor"
        element={
          <PreventedRoute>
            <Donor />
          </PreventedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <AdminRoutes>
            <Inventory />
          </AdminRoutes>
        }
      />
      <Route
        path="/hospitals"
        element={
          <SuperAdminRoutes>
            <Hospital />
          </SuperAdminRoutes>
        }
      />
      <Route
        path="/wardrep"
        element={
          <AdminRoutes>
            <WardRepresentatives />
          </AdminRoutes>
        }
      />
      <Route
        path="/wardrep/create"
        element={
          <AdminRoutes>
            <AddRepresentative />
          </AdminRoutes>
        }
      />
      <Route
        path="/wardrep/edit/:wardRepId"
        element={
          <AdminRoutes>
            <EditRepresentative />
          </AdminRoutes>
        }
      />
      <Route
        path="/hospitals/create"
        element={
          <SuperAdminRoutes>
            <CreateHospital />
          </SuperAdminRoutes>
        }
      />
      <Route
        path="/create-donor"
        element={
          <AdminRoutes>
            <CreateDonor />
          </AdminRoutes>
        }
      />
      <Route
        path="/add-patient"
        element={
          <AdminRoutes>
            <AddPatient
              handleOpenForm={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          </AdminRoutes>
        }
      />
      <Route
        path="/create-admin"
        element={
          <SuperAdminRoutes>
            <AddAdmin />
          </SuperAdminRoutes>
        }
      />
      <Route
        path="/admin/edit/:userId"
        element={
          <SuperAdminRoutes>
            <EditAdmin />
          </SuperAdminRoutes>
        }
      />
      <Route
        path="/reset-password/:userId"
        element={
          <AdminRoutes>
            <ResetPassword />
          </AdminRoutes>
        }
      />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route
        path="/donor/edit/:donorId"
        element={
          <AdminRoutes>
            <EditDonor />
          </AdminRoutes>
        }
      />
      <Route
        path="/patientwaitlist/edit/:patientId"
        element={
          <AdminRoutes>
            <EditPatientWaitlist />
          </AdminRoutes>
        }
      />

      <Route
        path="/hospitalProfile/:hospitalId"
        element={
          <AdminRoutes>
            <HospitalProfile />
          </AdminRoutes>
        }
      />
      <Route
        path="/hospitalProfile/edit/:hospitalId"
        element={
          <AdminRoutes>
            <EditHospital />
          </AdminRoutes>
        }
      />
      <Route
        path="/admin"
        element={
          <SuperAdminRoutes>
            <Admin />
          </SuperAdminRoutes>
        }
      />
      <Route
        path="/userProfile"
        element={
          <PreventedRoute>
            <UserProfile />
          </PreventedRoute>
        }
      />
    </Routes>
    <ToastContainer />
  </Router>
);

export default App;
