import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { ReactNode } from 'react';
import { InitialState } from './models/datamodels';
import Navbar from './components/navbar';
import jsCookie from 'js-cookie';

export const PreventedRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  const sessionData = jsCookie.get('name');
  if (user && sessionData) {
    return <Navbar>{children}</Navbar>;
  } else {
    return <Navigate to="/login" />;
  }
};

export const SuperAdminRoutes = ({ children }: { children: ReactNode }) => {
  const user = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );
  if (user === 'Super Admin') {
    return <Navbar>{children}</Navbar>;
  } else {
    return <Navigate to="/" />;
  }
};

export const AdminRoutes = ({ children }: { children: ReactNode }) => {
  const user = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );
  if (
    user === 'Super Admin' ||
    user === 'Hospital Admin' ||
    user === 'Red Cross Admin' ||
    user === 'Nagarpalika Admin'
  ) {
    return <Navbar>{children}</Navbar>;
  } else {
    return <Navigate to="/" />;
  }
};
