import React, { useState, useEffect } from 'react';
import Confirm from './Confirm'; // นำเข้า Confirm component
import './css/Booking.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Booking_Add = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [status, setStatus] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [meetingName, setMeetingName] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [details, setDetails] = useState('');

    const navigate = useNavigate();


    // ฟังก์ชันดึงข้อมูลสถานะห้องประชุมที่มี status_id=4
    const fetchRoomData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/rooms/status_id/4`);
            // ตรวจสอบข้อมูลที่ได้รับ
            console.log('Rooms:', response.data);
            setRooms(response.data); // ตั้งค่าห้องประชุมที่ได้จาก API
        } catch (error) {
            console.error('Error fetching room data:', error);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, []);

    const convertToBuddhistYear = (dateString) => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        return `${buddhistYear}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const handleStartDateChange = (e) => {
        const convertedDate = convertToBuddhistYear(e.target.value);
        setStartDate(convertedDate);
    };

    const handleEndDateChange = (e) => {
        const convertedDate = convertToBuddhistYear(e.target.value);
        setEndDate(convertedDate);
    };

    const handleSaveClick = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        const bookingData = {
            meetingname: meetingName,
            startday: startDate,
            endday: endDate,
            start_time: document.querySelector('input[name="start_time"]').value,
            end_time: document.querySelector('input[name="end_time"]').value,
            room_id: status, // ใช้ค่า room_id ที่ได้เลือกจาก dropdown
            numberOfPeople: numberOfPeople,
            details: details
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                console.log("ข้อมูลถูกบันทึก");
                setIsConfirmOpen(false);
                navigate('/booking');
            } else {
                console.error('Error saving booking:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    // ฟังก์ชันยกเลิกการบันทึก
    const handleCancel = () => {
        setIsConfirmOpen(false); // ปิด Confirm Dialog
    };

    return (
        <div>
            <h1>เพิ่มข้อมูลการจองห้องประชุม</h1>
            <div className="background-content">
                <form>
                    <div className='columns-one'>
                        <label>ชื่อเรื่อง:</label>
                        <input className='form-long' type="text" name="title" value={meetingName} onChange={(e) => setMeetingName(e.target.value)} />
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label>วันที่เริ่มต้น:</label>
                            <input
                                className='form-short'
                                type="date"
                                name="startDate"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </div>
                        <div className="column">
                            <label>วันที่สิ้นสุด:</label>
                            <input
                                className='form-short'
                                type="date"
                                name="endDate"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label>เวลาเริ่มต้น:</label>
                            <input className='form-short' type="time" name="start_time" />
                        </div>
                        <div className="column">
                            <label>เวลาสิ้นสุด:</label>
                            <input className='form-short' type="time" name="end_time" />
                        </div>
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label>ห้องประชุม:</label>
                            <select className='form-short' value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">เลือกห้องประชุม</option>
                                {rooms.map(room => (
                                    <option key={room.room_id} value={room.room_id}>
                                        {room.roomname}
                                    </option>
                                ))}
                            </select>

                            
                        </div>
                        <div className="column">
                            <label>จำนวนคน:</label>
                            <input className='form-short' type="number" name="numberOfPeople" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} />
                        </div>
                    </div>

                    <div className='columns-one'>
                        <label>รายละเอียด:</label>
                        <textarea name="details" value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
                    </div>
                </form>
            </div>

            <div className='form-button'>
                <button className='save' onClick={handleSaveClick}><p>บันทึก</p></button>
                <button className='cancel' onClick={() => window.history.back()}><p>ยกเลิก</p></button>
            </div>

            {/* แสดง Confirm dialog ถ้า isConfirmOpen เป็นจริง */}
            <Confirm open={isConfirmOpen} onClose={handleCancel} onConfirm={handleConfirm} />
        </div>
    );
};

export default Booking_Add;
