import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Confirm from './Confirm';
import './css/Booking.css';

const RoomEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = location.state || {}; // รับ roomId จาก state
    const [status, setStatus] = useState([]); // ข้อมูลห้องประชุม
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const fetchRoomData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/rooms/${roomId}`);
            setRoom(response.data);
        } catch (error) {
            setError(error);
            console.error('Error fetching room data:', error);
        } finally {
            setLoading(false);
        }
    };
    // ฟังก์ชันดึงข้อมูลสถานะห้องประชุมที่มี status_id=4 หรือ 5
    // ฟังก์ชันดึงข้อมูลสถานะห้องประชุมที่มี status_id=4 หรือ 5
    const fetchstatusData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/status_id/4,5`);
            console.log('Status:', response.data); // ตรวจสอบข้อมูลที่ได้รับ
            setStatus(response.data); // ตั้งค่าห้องประชุมที่ได้จาก API
        } catch (error) {
            console.error('Error fetching room status:', error); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
        }
    };
;

    useEffect(() => {
        if (roomId) {
            fetchRoomData();
            fetchstatusData(); // ดึงข้อมูลห้องประชุม
        } else {
            setError(new Error('No room ID provided'));
        }
    }, [roomId]);

    // ฟังก์ชันจัดการการคลิกบันทึก
    const handleSaveClick = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true); // เปิด Confirm Dialog
    };

    // ฟังก์ชันยืนยันการบันทึก
    const handleConfirmSave = async () => {
        try {
            await axios.put(`http://127.0.0.1:5000/api/rooms/${roomId}`, room);
            navigate('/room'); // เปลี่ยนเส้นทางหลังจากบันทึกสำเร็จ
        } catch (error) {
            setError(error);
            console.error('Error updating room data:', error);
        } finally {
            setIsConfirmOpen(false); // ปิด Confirm Dialog
        }
    };

    // ฟังก์ชันยกเลิกการบันทึก
    const handleCancel = () => {
        setIsConfirmOpen(false); // ปิด Confirm Dialog
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoom((prevRoom) => ({ ...prevRoom, [name]: value })); // อัปเดตข้อมูลห้องประชุม
    };

    if (loading) {
        return <div>Loading room data...</div>; // แสดงข้อความเมื่อกำลังดึงข้อมูล
    }

    if (error) {
        return <div>Error loading room data: {error.message}</div>; // แสดงข้อความเมื่อเกิดข้อผิดพลาด
    }

    if (!room) {
        return <div>ไม่พบข้อมูลห้องประชุม</div>; // แสดงข้อความเมื่อไม่พบข้อมูลห้องประชุม
    }

    return (
        <div>
            <h1>แก้ไขข้อมูลห้องประชุม</h1>
            <div className="background-content">
                <form>
                    <div className="columns-two">
                        <div className="column">
                            <label><strong>ห้องประชุม:</strong></label>
                            <input
                                className='form-short'
                                type="text"
                                name="roomname"
                                value={room.roomname}
                                onChange={handleChange} // แก้ไขฟิลด์ห้องประชุม
                            />
                        </div>
                        <div className="column">
                            <label><strong>สถานะการใช้งาน:</strong></label>
                            <select
                                className='form-short'
                                name="status_id"
                                value={room.status_id || ""} // กำหนดค่า default เป็น empty string ถ้า room.status_id เป็น null
                                onChange={handleChange}
                            >
                                <option value="">เลือกสถานะ</option>
                                {status.length > 0 ? status.map(status => ( // ตรวจสอบว่ามีสถานะใน status หรือไม่
                                    <option key={status.status_id} value={status.status_id}>
                                        {status.statusname}
                                    </option>
                                )) : <option value="">ไม่พบข้อมูลสถานะ</option>}
                            </select>


                        </div>
                    </div>

                    <div className='columns-one'>
                        <label><strong>รายละเอียด:</strong></label>
                        <textarea
                            name="details"
                            value={room.details}
                            onChange={handleChange} // แก้ไขรายละเอียด
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

export default RoomEdit;
