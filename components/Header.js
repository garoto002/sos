import * as React from 'react';
import Link from "next/link";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { signOut, useSession } from "next-auth/react";

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import Groups2Icon from '@mui/icons-material/Groups2';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Store, Warehouse } from '@mui/icons-material';

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);


  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <>
        
        <AppBar position='fixed'>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => handleToggleMenu()}
            >
                <MenuIcon />
            </IconButton>
            <Link href="/" passHref style={{flexGrow: 1}}>
              <Typography variant="h6" component="h1">
                  zotho
              </Typography>
            </Link>
            {auth && (
                <div>
                <IconButton
                    size="large"
                    aria-label="button to logout"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={signOut}
                    color="inherit"
                >
                    <LogoutIcon />
                </IconButton>
                
                </div>
            )}
            </Toolbar>
        </AppBar>
        <Drawer open={menuOpen} onClose={() => handleToggleMenu()}>
        <List>
          <Link href="/sales" passHref onClick={() => handleToggleMenu()}>
            <ListItem button>
              <ListItemIcon><EditCalendarIcon /></ListItemIcon>
              <ListItemText>Vendas</ListItemText>
            </ListItem>
          </Link>
          
          <Link href="/products" passHref>
            <ListItem button onClick={() => handleToggleMenu()}>
              <ListItemIcon><Store/></ListItemIcon>
              <ListItemText>Produtos</ListItemText>
            </ListItem>
          </Link>
          
          <Link href="/purchase" passHref>
            <ListItem button onClick={() => handleToggleMenu()}>
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              <ListItemText>Entradas</ListItemText>
            </ListItem>
          </Link>

          <Link href="/customers" passHref>
            <ListItem button onClick={() => handleToggleMenu()}>
              <ListItemIcon><Groups2Icon/></ListItemIcon>
              <ListItemText>Clientes</ListItemText>
            </ListItem>
          </Link>
          
          
          
          <Link href="/suppliers" passHref onClick={() => handleToggleMenu()}>
            <ListItem button>
              <ListItemIcon><LocalShippingIcon /></ListItemIcon>
              <ListItemText>Fornecedores</ListItemText>
            </ListItem>
          </Link>

          <Link href="/users" passHref>
            <ListItem button onClick={() => handleToggleMenu()}>
              <ListItemIcon><PersonIcon/></ListItemIcon>
              <ListItemText>Utilizadores</ListItemText>
            </ListItem>
          </Link>

          
        </List>
      </Drawer>
    
    </>
  );
}