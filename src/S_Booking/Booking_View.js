import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Booking.css';

const BookingView = () => {
    const [bookingData, setBookingData] = useState(null);
    const [roomData, setRoomData] = useState(null); // State สำหรับข้อมูลห้องประชุม
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = location.state || {}; // รับ bookingId จาก state

    const fetchBookingData = async () => {
        setLoading(true);  // กำหนดสถานะการโหลดข้อมูลให้เป็นจริง (กำลังโหลด)
        try {
            // ส่งคำขอเพื่อดึงข้อมูลการจองจาก API โดยอ้างอิงตาม bookingId
            const response = await axios.get(`http://127.0.0.1:5000/api/bookings/${bookingId}`);
            setBookingData(response.data);  // ตั้งค่าข้อมูลการจองใน state bookingData

            // ดึงข้อมูลห้องประชุมที่เกี่ยวข้องกับการจอง โดยอ้างอิงจาก room_id ที่ได้จาก response ของการจอง
            const roomResponse = await axios.get(`http://127.0.0.1:5000/api/rooms/${response.data.room_id}`);
            setRoomData(roomResponse.data); // ตั้งค่าข้อมูลห้องประชุมใน state roomData

        } catch (error) {
            setError(error);  // จัดเก็บข้อผิดพลาดใน state error
            console.error('Error fetching booking data:', error);  // แสดงข้อผิดพลาดใน console
        } finally {
            setLoading(false);  // เมื่อเสร็จสิ้นการโหลดข้อมูล ไม่ว่าจะสำเร็จหรือล้มเหลว ให้เปลี่ยนสถานะการโหลดเป็น false
        }
    };

    useEffect(() => {
        if (bookingId) {
            fetchBookingData();  // เรียกใช้ฟังก์ชัน fetchBookingData ถ้ามีค่า bookingId
        } else {
            setError(new Error('No booking ID provided'));  // ถ้าไม่มี bookingId ให้บันทึก error ไว้ใน state
        }
    }, [bookingId]);  // useEffect ทำงานทุกครั้งที่ bookingId เปลี่ยนแปลง


    if (loading) {
        return <div>Loading booking data...</div>;
    }

    if (error) {
        return <div>Error loading booking data: {error.message}</div>;
    }

    if (!bookingData || !roomData) {
        return <div>No booking data found.</div>;
    }

    const handleCancel = () => {
        navigate(-1); // กลับไปยังหน้าก่อนหน้า
    };

    return (
        <div>
            <h1>รายละเอียดการจองห้องประชุม</h1>
            <div className="background-content">
                <form>
                    <div className="columns-one">
                        <label><strong>ชื่อเรื่อง:</strong></label>
                        <p className='form-long'>{bookingData.meetingname}</p>
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label><strong>วันที่เริ่มต้น:</strong></label>
                            <p className='form-short'>
                                {new Date(bookingData.startday).toLocaleDateString('th-TH')}
                            </p>
                        </div>

                        <div className="column">
                            <label><strong>วันที่สิ้นสุด:</strong></label>
                            <p className='form-short'>
                                {new Date(bookingData.endday).toLocaleDateString('th-TH')}
                            </p>
                        </div>
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label><strong>เวลาเริ่มต้น:</strong></label>
                            <p className='form-short'>{bookingData.start_time}</p>
                        </div>
                        <div className="column">
                            <label><strong>เวลาสิ้นสุด:</strong></label>
                            <p className='form-short'>{bookingData.end_time}</p>
                        </div>
                    </div>

                    <div className="columns-two">
                        <div className="column">
                            <label><strong>ห้องประชุม:</strong></label>
                            <p className='form-short'>{roomData.roomname}</p> {/* แสดงชื่อห้องประชุม */}
                        </div>
                        <div className="column">
                            <label><strong>จำนวนคน:</strong></label>
                            <p className='form-short'>{bookingData.numberOfPeople}</p>
                        </div>
                    </div>

                    <div className="columns-one">
                        <label><strong>รายละเอียด:</strong></label>
                        <p className='form-long'>{bookingData.details}</p>
                    </div>
                </form>
            </div>

            <div className='form-button'>
                <button className='cancel' onClick={handleCancel}>
                    <p>กลับ</p>
                </button>
            </div>
        </div>
    );
};

export default BookingView;
