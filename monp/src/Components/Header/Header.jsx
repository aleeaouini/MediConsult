import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Badge } from '@mui/material';
import { useUser } from '../../context';
import logo from '../../assets/uuu.png';

const Header = () => {
  const navigate = useNavigate();
  const { user, HandleLoginUser } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const isNotifOpen = Boolean(notifAnchor);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  

  const isDoctor = user?.role === 'doctor'; 
  const isPatient = user?.role === 'patient';

  const menuItems = [
    { label: 'ACCUEIL', path: '/Home' },
    { label: 'NEWS', path: '/news' },
    ...(user
      ? [
          !isDoctor && { label: 'CONSULTER UN MÉDECIN', path: '/Consult' },
          !isPatient && { label: 'LISTE', path: '/doctor' },
          !isDoctor && { label: 'HISTORIQUE', path: `/historique/${user.id}` },
        ].filter(Boolean)
      : [
          { label: 'SE CONNECTER', path: '/Login' },
          { label: 'INSCRIPTION', path: '/Signup' },
        ])
  ];

  useEffect(()=>{
    const getNotif = async()=>{
      try {
        const response = await fetch(`http://localhost:3000/docteur/notification/${user.id}`);
        const data = await response.json();
        setNotifications(data);
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    }
    if(user?.role==="doctor"){
      getNotif();
    }
  },[user?.role])

  if (!user?.id) {
    return null; // Retourne null si l'utilisateur n'est pas connecté
  }

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
  
    if (diffInSeconds < 60) {
      return "À l'instant";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/Home')}>
            <img 
              src={logo} 
              alt="Logo MediConsult" 
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }} 
            />
          </Box>

          <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {menuItems.map(({ label, path }) => (
              <Button key={path} onClick={() => navigate(path)} sx={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                {label}
              </Button>
            ))}

            {user && (
              <>
                {/* Bouton Notifications */}
                {isDoctor && (
  <IconButton color="inherit" onClick={(event) => setNotifAnchor(event.currentTarget)}>
    <Badge 
      badgeContent={notifications.length} 
      color="error"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: '#ff0000',
          minWidth: '20px',
          height: '20px',
          borderRadius: '50%',
        }
      }}
    >
      <NotificationsIcon />
    </Badge>
  </IconButton>
)}
                <Menu
  anchorEl={notifAnchor}
  open={isNotifOpen}
  onClose={() => setNotifAnchor(null)}
  PaperProps={{
    sx: {
      width: 350,
      maxHeight: '70vh',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      mt: 1
    }
  }}
>
  {/* En-tête du menu */}
  <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Notifications
    </Typography>
  </Box>

  {/* Liste des notifications */}
  {notifications.length > 0 ? (
    notifications.map((notif, index) => (
      <MenuItem 
        key={index}
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.03)'
          }
        }}
      >
        <Box>
          <Typography 
            sx={{ 
              fontWeight: 500,
              mb: 0.5,
              color: 'text.primary',
              lineHeight: 1.4
            }}
          >
            {notif.message}
          </Typography>
          <Typography 
  variant="body2" 
  sx={{ 
    color: 'text.secondary',
    fontSize: '0.85rem'
  }}
>
  {formatTimeAgo(notif.createdAt)}
</Typography>
        </Box>
      </MenuItem>
    ))
  ) : (
    <Box sx={{ 
      p: 3, 
      textAlign: 'center',
      color: 'text.secondary'
    }}>
      <Typography>Aucune notification</Typography>
    </Box>
  )}
</Menu>
                {/* Bouton Profil */}
                <IconButton onClick={handleMenuOpen} sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { backgroundColor: '#fff', mt: 1 } }}>
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>Profil</MenuItem>
                  <MenuItem onClick={() => { HandleLoginUser(null); navigate('/login'); handleMenuClose(); }}>Déconnexion</MenuItem>
                  
                </Menu>
              </>
            )}
          </Stack>

          {/* Menu mobile */}
          <IconButton sx={{ display: { xs: 'block', md: 'none' }, color: '#fff' }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)} PaperProps={{ sx: { width: 250, backgroundColor: '#fff' } }}>
            <List>
              {menuItems.map(({ label, path }) => (
                <ListItem disablePadding key={path}>
                  <ListItemButton onClick={() => handleNavigation(path)}>
                    <ListItemText primary={label} />
                  </ListItemButton>
                </ListItem>
              ))}
              {user && (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigation('/profile')}>
                      <ListItemText primary="Profil" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { HandleLoginUser(null); handleNavigation('/login'); }}>
                      <ListItemText primary="Déconnexion" />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;