import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import MenuIcon from '@mui/icons-material/Menu';

import { Button, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
//import logo from '../../Images/logo.png';
import colors from '../../utils/colors';

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalWrapper';
import MyAlert from '../../components/MyAlertComponent/MyAlert';

import CartCount from '../../components/CartCountComponent/CartCount';
import MyLoader from '../../components/MyLoaderComponent/MyLoader';



export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const { globalData, globalDataDispatch } = React.useContext(GlobalContext)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const toggleDrawer = () => {
    setOpenDrawer((prevState) => {
      return !prevState;
    })
  }
  const navigate = useNavigate();
  const signOutHandler = () => {
    const signOutAction = {
      type: 'signOut',
      value: {
        id: -1,
        email: '',
        token: ''
      }
    }
    localStorage.removeItem('userData')
    globalDataDispatch(signOutAction)
    navigate('/sign-in')
  }

 

  const mobSignInUp = <>
    <Link to={'/sign-in'} > <ListItem sx={{ color: 'white' }} >
      Sign In
    </ListItem>
    </Link>
    <Link to={'/'} >
      <ListItem sx={{ color: 'white' }} >

        Sign up
      </ListItem>
    </Link>
  </>

  const mobSignOut = <>
    <ListItem onClick={signOutHandler} >
      Sign Out
    </ListItem>

  </>

  const lapSignInUp = <>
    <Link to={'/sign-in'} ><Button
      sx={{ my: 2.5, color: 'white', display: 'block' }}
    // className={navbarStyles.bigFontSize}
    >
      Sign In
    </Button>
    </Link>
    <Link to={'/'} ><Button
      sx={{ my: 2.5, color: 'white', display: 'block' }}
    //className={navbarStyles.bigFontSize}
    >
      Sign Up
    </Button>
    </Link>
  </>

  const lapSignOut = <>
    <Button
      sx={{ my: 2, color: 'white', display: 'block' }}
    // className={navbarStyles.bigFontSize}
    onClick={signOutHandler}
    >
      Sign Out
    </Button>
  </>

  // React.useEffect(()=>{

  // },[])

  return (
    <>
      <MyLoader />
      <MyAlert open={globalData.alertData.isVisible} alertType={globalData.alertData.type} message={globalData.alertData.message} />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ bgcolor: colors.darkMud }}>
          <Toolbar>
            
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                color: colors.grassGreen
              }}
            >
              LOGO
            </Typography>
          
            {/* <Box  /> */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              

        

          
              <Typography
                sx={{
                  my: 3, color: 'white',
                }

                }

              //className={navbarStyles.bigFontSize}


              >

                {globalData.userData.email.length > 0 ? globalData.userData.email : 'Guest'}
              </Typography>

             
              
              <CartCount />
              


              
              <Link to={'/add-product'} ><Button
                sx={{ my: 2.5, color: 'white', display: 'block' }}
              //className={navbarStyles.bigFontSize}
              >
                Add Product
              </Button>
              </Link>
              <Link to={'/products'} ><Button

                sx={{ my: 2.5, color: 'white', display: 'block' }}
              //className={navbarStyles.bigFontSize}
              >
                products
              </Button>
              </Link>

              {globalData.userData.id == -1 && lapSignInUp}

              {globalData.userData.id != -1 && lapSignOut}
            
            </Box>
            <Box sx={{ display: { md: 'none', xs: 'flex' } }} >
              <CartCount />
              <IconButton
                size="large"
                onClick={toggleDrawer}
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
                </IconButton>
                <Drawer
                  anchor={'right'}
                  open={openDrawer}
                  sx={{
                    zIndex: 1,

                  }}
                  onClose={() => {
                    toggleDrawer()
                  }}
                //onClose={toggleDrawer}
                >
                  <List onClick = {toggleDrawer} sx={{
                    backgroundColor: colors.darkMud,
                    color: 'white',
                    height: '100%'
                  }}>
                    <ListItem sx={{ height: '4em' }} disablePadding>

                    </ListItem>
                    <ListItem >
                      {/* <ListItemButton>
                        <ListItemText primary="Email" />
                      </ListItemButton> */}
                      {globalData.userData.email.length > 0 ? globalData.userData.email : 'Guest'}
                    </ListItem>
                   


                    <Link to={'/add-product'}><ListItem sx={{
                      color: 'white'
                    }} pt={0} >
                      Add Product
                    </ListItem>
                    </Link >
                    <Link to={'/products'}>
                      <ListItem sx={{
                        color: 'white'
                      }}>
                        Products
                      </ListItem>

                    </Link>

                    {globalData.userData.id == -1 && mobSignInUp}

                    {globalData.userData.id != -1 && mobSignOut}

                  </List>
                </Drawer>
             
            </Box>
          </Toolbar>
        </AppBar>
        {/* {renderMobileMenu}
      {renderMenu} */}
      </Box>
      <Outlet />
    </>
  )
}
