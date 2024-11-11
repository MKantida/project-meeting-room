import React, { useState, useEffect } from 'react';
import Confirm from './Confirm'; // นำเข้า Confirm component
import './css/Booking.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Room_Add = () => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // กำหนดสถานะสำหรับ Confirm Dialog
    const [status, setStatus] = useState([]); // สถานะการใช้งาน (ค่าเริ่มต้น)
    const [selectedStatus, setSelectedStatus] = useState(''); // กำหนดสถานะที่เลือก
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState('');
    const [details, setDetails] = useState('');

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

    // ใช้ useEffect เพื่อดึงข้อมูลสถานะเมื่อ component ถูกสร้าง
    useEffect(() => {
        fetchstatusData();
    }, []);

    // ฟังก์ชันจัดการการคลิกบันทึก
    const handleSaveClick = () => {
        setIsConfirmOpen(true); // เปิด Confirm Dialog
    };

    // ฟังก์ชันยืนยันการบันทึก
    const handleConfirm = async () => {
        const roomData = {
            roomname: roomName,
            status_id: selectedStatus, // ใช้ selectedStatus ที่เลือกจาก select
            details: details
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
            });

            if (response.ok) {
                console.log("ข้อมูลถูกบันทึก");
                setIsConfirmOpen(false);
                navigate('/room');
            } else {
                console.error('Error saving room:', response.statusText);
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
            <h1>เพิ่มห้องประชุม</h1>
            <div className="background-content">
                <form>
                    <div className="columns-two">
                        <div className="column">
                            <label>ห้องประชุม:</label>
                            <input className='form-short' type="text" name="roomName"
                                value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                        </div>
                        <div className="column">
                            <label><strong>สถานะการใช้งาน:</strong></label>
                            <select className='form-short' value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="">เลือกสถานะ</option>
                                {status.map(roomStatus => (
                                    <option key={roomStatus.status_id} value={roomStatus.status_id}>
                                        {roomStatus.statusname}
                                    </option>
                                ))}
                            </select>
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
                <button className='cancel' onClick={handleCancel}><p>ยกเลิก</p></button>
            </div>

            {/* แสดง Confirm dialog ถ้า isConfirmOpen เป็นจริง */}
            <Confirm open={isConfirmOpen} onClose={handleCancel} onConfirm={handleConfirm} />
        </div>
    );
};

export default Room_Add;
