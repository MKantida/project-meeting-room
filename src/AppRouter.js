// AppRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

import Booking from './S_Booking/Booking';
import Booking_Add from './S_Booking/Booking_Add'; // นำเข้า Booking component
import Booking_Edit from './S_Booking/Booking_Edit';
import Booking_View from './S_Booking/Booking_View';

import Room from './S_ROOM/Room';
import Room_Add from './S_ROOM/Room_Add';
import Room_Edit from './S_ROOM/Room_Edit';
import Room_View from './S_ROOM/Room_View';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* รองรับทั้ง /S_Booking/booking และ /booking */}
            <Route path="/booking" element={<Booking />} />


            <Route path="/booking/booking-add" element={<Booking_Add />} />
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
