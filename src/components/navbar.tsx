import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import routes from '../routes';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { InitialState } from '../models/datamodels';
import { MdLogout } from 'react-icons/md';
import LogoutAlert from './Alert/Logout';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
interface Props {
  children: React.ReactNode;
}

export default function Navbar({ children }: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [logOut, setLogOut] = React.useState<boolean>(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const user = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  const allRoutes = routes();

  const filteredRoutes = allRoutes.filter((route) => {
    if (route.renderCondition) {
      return route.renderCondition(user);
    }
    return true;
  });

  const handleLogOutDialog = () => {
    setLogOut(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ background: '#008080' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <div className="w-full flex justify-between items-center font-[Poppins]">
            <Link to="/">
              <Typography variant="h6" noWrap component="div">
                <span className="hidden md:flex">
                  BloodSync Inventory Management System
                </span>
                <span className="md:hidden">BloodSync IMS</span>
              </Typography>
            </Link>
            <div className=" rounded-full flex items-center justify-start p-2 gap-10">
              <Link to="/userprofile">
                <FaUser className="text-xl cursor-pointer" />
              </Link>
              <MdLogout
                className="text-2xl cursor-pointer"
                onClick={() => setLogOut(true)}
              />
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f1f5f9',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <div className="flex w-full justify-between items-center pl-3">
            <a href="/">
              <img
                src="/hdcs.jpg"
                alt="hdcs"
                className="w-16 h-12 rounded-full"
              ></img>
            </a>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
        </DrawerHeader>
        <Divider />
        <div className="flex flex-col items-start justify-between w-full h-screen">
          <List>
            <div className="flex flex-col gap-0 justify-between h-full font-[Poppins]">
              {filteredRoutes.map((route) => (
                <Link to={`${route.route}`} key={route.key}>
                  <ListItem className="w-[90%]" key={route.key}>
                    <div className="flex gap-2 items-center justify-start hover:bg-[#66b2b2] hover:text-white hover:font-medium transition-all duration-300 ease-in-out w-full py-1 rounded-3xl">
                      <div className="flex justify-center items-center rounded-full p-1 w-10 h-10">
                        {route.icon}{' '}
                      </div>
                      <span className="font-[Poppins]">{route.name}</span>
                    </div>
                  </ListItem>
                </Link>
              ))}
            </div>
          </List>
          <div className="w-full flex justify-start items-center px-2 gap-1">
            <img
              src="/inspire.jpg"
              alt="inspire"
              className="w-12 h-12 rounded-full"
            />
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-xs font-thin text-[#5E5873] hover:underline">
                Made By BloodSync Team
              </span>
            </a>
          </div>
        </div>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
      <LogoutAlert open={logOut} onClose={handleLogOutDialog} />
    </Box>
  );
}
