// Sidebar.js
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Sidebar.css';

const Sidebar = ({ toggleDrawer }) => {
    const navigate = useNavigate();
    const location = useLocation(); // เช็ค URL ปัจจุบัน

    const handleNavigation = (path) => {
        navigate(path);
        toggleDrawer(false)();
    };

    // กำหนดเมนูหลัก
    const mainMenu = [
        { label: 'หน้าแรก', path: '/' },
        { label: 'เกี่ยวกับ', path: '/about' },
        { label: 'ระบบจัดการห้องประชุม', path: '/room' }
    ];

    // กำหนดเมนูสำหรับระบบจองห้องประชุม
    const bookingMenu = [
        { label: 'หน้าแรก', path: '/' },
        { label: 'ระบบจองห้องประชุม', path: '/booking' },
        { label: 'เพิ่มการจองห้อง', path: '/booking/booking-add' },
    ];

    // กำหนดเมนูสำหรับการจัดการห้องประชุม
    const roomMenu = [
        { label: 'หน้าแรก', path: '/' },
        { label: 'ระบบจัดการห้องประชุม', path: '/room' },
        { label: 'เพิ่มห้องประชุม', path: '/room/room_add' },
    ];

    // เลือกรายการเมนูตามเส้นทาง
    let menuItems = [];
    if (location.pathname.startsWith('/home')) {
        menuItems = mainMenu; // เมนูหลักสำหรับหน้าแรก
    } else if (location.pathname.startsWith('/booking')) {
        menuItems = bookingMenu; // เมนูจองห้องประชุม
    } else if (location.pathname.startsWith('/room')) {
        menuItems = roomMenu; // เมนูจัดการห้องประชุม
    } else {
        menuItems = mainMenu; // กำหนด mainMenu เป็นค่าเริ่มต้น
    }

    return (
        <div className="sidebar" role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Sidebar;
