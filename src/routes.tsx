import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { CiHospital1 } from 'react-icons/ci';
import { FiUsers } from 'react-icons/fi';
import Donor from './pages/Donor';
import PatientWaitlist from './pages/PatientWaitlist';
import Inventory from './pages/Inventory';
import Hospital from './pages/Hospital';
import Admin from './pages/Admin';
import HospitalProfile from './pages/HospitalProfile';
import { useSelector } from 'react-redux';
import { InitialState } from './models/datamodels';
import WardRepresentatives from './pages/WardRepresentatives';
import { MdGroups } from 'react-icons/md';
import { MdSpaceDashboard } from 'react-icons/md';
import Homepage from './pages/Homepage';

const routes = () => {
  const userHospital = useSelector(
    (state: InitialState) => state.auth.hospitalId
  );

  return [
    {
      name: 'Dashboard',
      key: 'dashboard',
      icon: <MdSpaceDashboard className="text-2xl" />,
      route: '/',
      component: <Homepage />,
    },
    {
      name: 'Donation Requests',
      key: 'patientwaitlist',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
          />
        </svg>
      ),
      route: '/patientwaitlist',
      component: <PatientWaitlist />,
    },
    {
      name: 'Inventory',
      key: 'inventory',
      icon: <BloodtypeIcon className="text-2xl" />,
      route: '/inventory',
      component: <Inventory />,
      renderCondition: (user: string | undefined) => {
        return (
          user === 'Hospital Admin' ||
          user === 'Super Admin' ||
          user === 'Red Cross Admin'
        );
      },
    },
    {
      name: 'Hospital',
      key: 'hospital',
      icon: <CiHospital1 className="text-2xl" />,
      route: '/hospitals',
      component: <Hospital />,
      renderCondition: (user: string | undefined) => {
        return user === 'Super Admin';
      },
    },
    {
      name: 'Donor',
      key: 'donor',
      icon: <FiUsers className="text-xl mr-1" />,
      route: '/donor',
      component: <Donor />,
    },
    {
      name: 'Representatives',
      key: 'wardRep',
      icon: <MdGroups />,
      route: '/wardrep',
      component: <WardRepresentatives />,
      renderCondition: (user: string | undefined) => {
        return user === 'Hospital Admin' || user === 'Super Admin';
      },
    },
    {
      name: 'Admin',
      key: 'admin',
      icon: <AdminPanelSettingsIcon />,
      route: '/admin',
      component: <Admin />,
      renderCondition: (user: string | undefined) => {
        return user === 'Super Admin';
      },
    },
    {
      name: 'Hospital Profile',
      key: 'hospitalProfile',
      icon: <CiHospital1 className="text-2xl" />,
      route: `/hospitalProfile/${userHospital}`,
      component: <HospitalProfile />,
      renderCondition: (user: string | undefined) => {
        return user === 'Hospital Admin';
      },
    },
  ];
};

export default routes;
