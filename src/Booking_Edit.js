import React, { useState, useEffect } from 'react';
import Confirm from './Confirm'; // นำเข้า Confirm component
import './css/Booking.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Booking_Edit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = location.state || {}; // รับ bookingId จาก state

    const [bookingData, setBookingData] = useState(null);
    const [rooms, setRooms] = useState([]); // ข้อมูลห้องประชุม
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // สถานะสำหรับเปิด/ปิด Confirm

    // ฟังก์ชันแปลงปี ค.ศ. เป็นปี พ.ศ.
    const convertToBuddhistYear = (dateString) => {
        if (!dateString) return ''; // ตรวจสอบว่า dateString มีค่าก่อนทำการแปลง

        const date = new Date(dateString);
        const gregorianYear = date.getFullYear();

        // ตรวจสอบว่าปีที่แปลงแล้วมีค่าน้อยกว่า 2500 เพื่อป้องกันการแปลงซ้ำ
        const buddhistYear = gregorianYear < 2500 ? gregorianYear + 543 : gregorianYear;

        return `${buddhistYear}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };


    // ฟังก์ชันดึงข้อมูลการจอง
    const fetchBookingData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/bookings/${bookingId}`);
            setBookingData(response.data);
        } catch (error) {
            setError(error);
            console.error('Error fetching booking data:', error);
        } finally {
            setLoading(false);
        }
    };

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
        if (bookingId) {
            fetchBookingData();
            fetchRoomData(); // ดึงข้อมูลห้องประชุม
        } else {
            setError(new Error('No booking ID provided'));
        }
    }, [bookingId]);

    // ฟังก์ชันจัดการการเปลี่ยนแปลงชื่อเรื่อง วันที่เริ่มต้น วันที่สิ้นสุด เวลาเริ่มต้น เวลาสิ้นสุด ห้องประชุม จำนวนคน รายละเอียด
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Map ของค่าที่ต้องการจัดการตาม name ของ input
        const valueConverters = {
            startday: convertToBuddhistYear,
            endday: convertToBuddhistYear,
            numberOfPeople: Number
        };

        // ตรวจสอบว่าชื่อฟิลด์นี้มีตัวแปลงข้อมูลที่ระบุหรือไม่
        const convertedValue = valueConverters[name] ? valueConverters[name](value) : value;

        setBookingData(prevData => ({
            ...prevData,
            [name]: convertedValue
        }));
    };


    // ฟังก์ชันจัดการการเปลี่ยนแปลงห้องประชุม
    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        setBookingData({ ...bookingData, room_id: roomId });
    };

    // ฟังก์ชันจัดการการคลิกบันทึก
    const handleSaveClick = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true); // เปิด Confirm Dialog
    };

    // ฟังก์ชันยืนยันการบันทึก
    const handleConfirmSave = async () => {
        try {
            // ตรวจสอบข้อมูลก่อนส่ง
            console.log('Data to send:', {
                ...bookingData,
                startday: bookingData.startday, // เก็บ startday
                endday: bookingData.endday // เก็บ endday
            });
            const response = await axios.put(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
                ...bookingData,
                startday: bookingData.startday, // เพิ่ม startday
                endday: bookingData.endday // เพิ่ม endday
            });
            navigate('/booking');
        } catch (error) {
            setError(error);
            console.error('Error updating booking data:', error);
        } finally {
            setIsConfirmOpen(false);
        }
    };


    // ฟังก์ชันยกเลิกการบันทึก
    const handleCancel = () => {
        setIsConfirmOpen(false); // ปิด Confirm Dialog
    };

    if (loading) {
        return <div>Loading booking data...</div>; // แสดงข้อความเมื่อกำลังดึงข้อมูล
    }

    if (error) {
        return <div>Error loading booking data: {error.message}</div>; // แสดงข้อความเมื่อเกิดข้อผิดพลาด
    }

    if (!bookingData) {
        return <div>ไม่พบข้อมูลการจอง</div>; // แสดงข้อความเมื่อไม่พบข้อมูลการจอง
    }

    return (
        <div>
            <h1>แก้ไขข้อมูลการจองห้องประชุม</h1>
            <div className="background-content">
                <form>
                    <div className='columns-one'>
                        <label>ชื่อเรื่อง:</label>
                        <input
                            className='form-long'
                            type="text"
                            name="meetingname"
                            value={bookingData.meetingname || ''} // ตรวจสอบให้แน่ใจว่ามีค่าว่าง
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label>วันที่เริ่มต้น:</label>
                            <input
                                className='form-short'
                                type="date"
                                name="startday"
                                value={bookingData.startday ? convertToBuddhistYear(bookingData.startday) : ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="column">
                            <label>วันที่สิ้นสุด:</label>
                            <input
                                className='form-short'
                                type="date"
                                name="endday"
                                value={bookingData.endday ? convertToBuddhistYear(bookingData.endday) : ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label>เวลาเริ่มต้น:</label>
                            <input
                                className='form-short'
                                type="time"
                                name="start_time"
                                value={bookingData.start_time || ''} // ป้องกันค่าที่ว่าง
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="column">
                            <label>เวลาสิ้นสุด:</label>
                            <input
                                className='form-short'
                                type="time"
                                name="end_time"
                                value={bookingData.end_time || ''} // ป้องกันค่าที่ว่าง
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label><strong>ห้องประชุม:</strong></label>
                            <select
                                className='form-short'
                                name="room_id"
                                value={bookingData.room_id || ''}  // ถ้าไม่มีค่า ให้แสดงเป็นค่าว่าง
                                onChange={handleRoomChange}        // ฟังก์ชันเปลี่ยนค่าของห้องประชุม
                            >
                                <option value="">เลือกห้องประชุม</option>  
                                {rooms.map(room => (                     // แสดงรายการห้องประชุมที่ได้จาก `rooms`
                                    <option key={room.room_id} value={room.room_id}>
                                        {room.roomname}                   
                                    </option>
                                ))}
                            </select>


                        </div>
                        <div className="column">
                            <label>จำนวนคน:</label>
                            <input
                                className='form-short'
                                type="number"
                                name="numberOfPeople"
                                value={Math.max(0, bookingData.numberOfPeople) || ''} // ป้องกันค่าติดลบ
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className='columns-one'>
                        <label>รายละเอียด:</label>
                        <textarea
                            name="details"
                            value={bookingData.details} // ตรวจสอบให้แน่ใจว่ามีค่าว่าง
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                </form>
            </div>

            <div className='form-button'>
                <button className='save' onClick={handleSaveClick}><p>บันทึก</p></button>
                <button className='cancel' onClick={() => window.history.back()}><p>ยกเลิก</p></button>
            </div>

            <Confirm open={isConfirmOpen} onClose={handleCancel} onConfirm={handleConfirmSave} />
        </div>
    );
};

export default Booking_Edit;
