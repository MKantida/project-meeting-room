import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Booking.css';

const RoomView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = location.state || {}; // รับ roomId จาก state

    const [roomData, setRoomData] = useState(null);
    const [statusData, setstatusData] = useState(null); // State สำหรับข้อมูลห้องประชุม
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRoomData = async () => {
        setLoading(true);
        try {
            const roomResponse = await axios.get(`http://127.0.0.1:5000/api/rooms/${roomId}`);
            setRoomData(roomResponse.data);

            const statusResponse = await axios.get('http://127.0.0.1:5000/api/status'); // URL สำหรับดึงข้อมูลสถานะ
            const statusList = statusResponse.data; // รายการสถานะทั้งหมด

            // ค้นหาสถานะที่ตรงกับ status_id ของห้องประชุม
            const roomStatus = statusList.find(status => status.status_id === roomResponse.data.status_id);
            setstatusData(roomStatus); // ตั้งค่าสถานะที่ตรงกับห้องประชุม

        } catch (error) {
            setError(error);
            console.error('Error fetching room data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (roomId) {
            fetchRoomData();
        } else {
            setError(new Error('No room ID provided'));
        }
    }, [roomId]);

    if (loading) {
        return <div>Loading room data...</div>; // แสดงข้อความเมื่อกำลังดึงข้อมูล
    }

    if (error) {
        return <div>Error loading room data: {error.message}</div>; // แสดงข้อความเมื่อเกิดข้อผิดพลาด
    }

    if (!roomData) {
        return <div>ไม่พบข้อมูลห้องประชุม</div>; // แสดงข้อความเมื่อไม่พบข้อมูลห้องประชุม
    }
    if (!roomData || !statusData) {
        return <div>No status data found.</div>;
    }


    const handleCancel = () => {
        navigate(-1); // กลับไปยังหน้าก่อนหน้า
    };

    return (
        <div>
            <h1>ดูรายละเอียดห้องประชุม</h1>
            <div className="background-content">
                <form>
                    <div className="columns-two">
                       

                        <div className="column">
                            <label><strong>ห้องประชุม:</strong></label>
                            <p className='form-short'>{roomData.roomname}</p>
                        </div>

                        <div className="column">
                            <label><strong>สถานะการใช้งาน:</strong></label>
                            <p className='form-short'>{statusData.statusname}</p>
                        </div>
                    </div>

                    <div className="columns-one">
                        <label><strong>รายละเอียด:</strong></label>
                        <p className='form-long'>{roomData.details}</p>
                    </div>
                </form>
            </div>

            <div className='form-button'>
                <button className='cancel' onClick={handleCancel}>
                    <p>ย้อนกลับ</p>
                </button>
            </div>
        </div>
    );
};

export default RoomView;
