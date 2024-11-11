// AppRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Booking from './Booking';
import Booking_Add from './Booking_Add'; // นำเข้า Booking component
import Booking_Edit from './Booking_Edit';
import Booking_View from './Booking_View';

import Room from './Room';
import Room_Add from './Room_Add';
import Room_Edit from './Room_Edit';
import Room_View from './Room_View';


function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/booking-add" element={<Booking_Add />} /> {/* เส้นทางจองห้อง */}
            <Route path="/booking/booking-edit" element={<Booking_Edit />} />
            <Route path="/booking/booking-view" element={<Booking_View />} />

            <Route path="/room" element={<Room />} />
            <Route path="/room/room_add" element={<Room_Add />} />
            <Route path="/room/room-edit" element={<Room_Edit />} />
            <Route path="/room/room-view" element={<Room_View />} />

            
        </Routes>
    );
}

export default AppRouter;
