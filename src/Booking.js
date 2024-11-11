import React from 'react';
import Calendar from './Calendar';
import DataMeet from './DataMeet '; // ปรับเส้นทางตามตำแหน่งไฟล์ของคุณ


export default function Booking() {
    return (
        <div>
            <h2>ระบบจองห้องประชุม</h2>
            <Calendar />
            <DataMeet />
        </div>
    );
}
