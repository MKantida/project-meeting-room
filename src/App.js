// App.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './css/App.css';
import Sidebar from './Sidebar';
import AppRouter from './AppRouter';


function App() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <div className="container">
            <AppBar position="static" className="header">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                        <MenuIcon /> {/* เรียกใช้ MenuIcon ที่เป็นแถบเมนู*/}
                    </IconButton>
                    <Typography variant="h6">ระบบการจัดการต่างๆ</Typography>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Sidebar toggleDrawer={toggleDrawer} />
            </Drawer>

            <main className="main">
                <AppRouter /> {/* เรียกใช้ AppRouter ที่เป็นเนื้อหา*/}
            </main>

            <Box className="footer">
                <Typography variant="body2" textAlign="center">
                    &copy; 2024 ระบบการจัดการต่างๆ
                </Typography>
            </Box>
        </div>
    );
}

export default App;