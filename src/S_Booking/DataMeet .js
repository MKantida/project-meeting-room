import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../Delete'; // Import DeleteDialog
import { useNavigate } from 'react-router-dom';
import '../css/DataTable.css';
import '../css/Button.css';

const DataTableRoom = () => {
    const [data, setData] = useState([]);
    const [rooms, setRooms] = useState([]); // State สำหรับข้อมูลห้องประชุม
    const [error, setError] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    const [statusData, setStatusData] = useState([]); // เพิ่ม state สำหรับเก็บ 

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/bookings');
            setData(response.data);

            const statusResponse = await axios.get('http://127.0.0.1:5000/api/status');
            setStatusData(statusResponse.data); // ตั้งค่า statusData จาก API

        } catch (error) {
            setError(error);
            console.error('Error fetching data:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRooms(); // เรียกฟังก์ชันดึงข้อมูลห้องประชุม
    }, []);

    if (error) {
        return <div>Error loading data: {error.message}</div>;
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedRows(selectAll ? [] : data.map(row => row.booking_id));
    };

    const handleRowSelect = (id) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleData = data.slice(startIndex, startIndex + rowsPerPage);


    const handleViewClick = (bookingId) => {
        navigate('/booking/booking-view', { state: { bookingId } });
    };

    const handleEditClick = (bookingId) => {
        navigate('/booking/booking-edit', { state: { bookingId } });
    };

    // ฟังก์ชันสำหรับเปิดหน้าต่างยืนยันการลบ
    const handleOpenDelete = (id) => {
        setSelectedDeleteId(id);
        setOpenDelete(true);
    };

    // ฟังก์ชันสำหรับปิดหน้าต่างยืนยันการลบ
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedDeleteId(null); // รีเซ็ต ID ที่เลือก
    };
    // ฟังก์ชันสำหรับการลบการจอง
    const handleDelete = async () => {
        console.log("Deleting booking with ID:", selectedDeleteId);

        if (!selectedDeleteId) return;

        try {
            const response = await axios.delete(`http://127.0.0.1:5000/api/bookings/${selectedDeleteId}`);
            console.log(response.data); // แสดงข้อมูลการตอบกลับ
            // อัปเดต state โดยการกรองข้อมูลที่ไม่ตรงกับ selectedDeleteId
            setData(prevData => prevData.filter(row => row.booking_id !== selectedDeleteId));
            handleCloseDelete();
        } catch (error) {
            console.error('Error in delete request:', error);
            alert("ไม่สามารถลบการจองได้");
            // คุณอาจต้องการแสดงข้อความแสดงข้อผิดพลาดที่นี่
        }
    };



    return (
        <div className="data-meet">
            <table className='table'>
                <thead>
                    <tr>
                        <th className='th-center'>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className='th-center'>ลำดับ</th>
                        <th className='th-center'>เรื่อง</th>
                        <th className='th-center'>วันที่เริ่มต้น</th>
                        <th className='th-center'>เวลาเริ่มต้น</th>
                        <th className='th-center'>ห้องประชุม</th>
                        <th className='th-center'>สถานะ</th>
                        <th className='th-center'>เว้นว่าง</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleData.map((row, index) => {
                        // ค้นหาสถานะที่ตรงกับ status_id ของ row
                        const roomStatus = statusData.find(status => status.status_id === row.status_id);

                        return (
                            <tr key={row.booking_id} className='list-row'>
                                <td className='th-center'>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row.booking_id)}
                                        onChange={() => handleRowSelect(row.booking_id)}
                                    />
                                </td>
                                <td className='th-center'>{startIndex + index + 1}</td>
                                <td className='th-center'>{row.meetingname}</td>
                                <td className='th-center'>{new Date(row.startday).toLocaleDateString('th-TH')}</td>
                                <td className='th-center'>{row.start_time}</td>
                                <td className='th-center'>
                                    {/* แสดงชื่อห้องประชุมโดยใช้ room_id */}
                                    {rooms.find(room => room.room_id === row.room_id)?.roomname || 'ไม่พบห้อง'}
                                </td>

                                {/* แสดงสถานะของห้องประชุม */}
                                <td className='th-center'>{roomStatus ? roomStatus.statusname : 'ไม่ทราบสถานะ'}</td>

                                <td className='th-center'>
                                    {row.status_id === 3 ? (
                                        <button className='button-view' onClick={() => handleViewClick(row.booking_id)}>
                                            <VisibilityIcon style={{ color: "black" }} />
                                        </button>
                                    ) : (
                                        <>
                                            <button className='button-view' onClick={() => handleViewClick(row.booking_id)}>
                                                <VisibilityIcon style={{ color: "black" }} />
                                            </button>
                                            <button className='button-edit' onClick={() => handleEditClick(row.booking_id)}>
                                                <EditIcon style={{ color: "black" }} />
                                            </button>
                                            <button className='button-delete' onClick={() => handleOpenDelete(row.booking_id)}>
                                                <DeleteIcon style={{ color: "black" }} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>

            <Delete
                open={openDelete}
                onClose={handleCloseDelete}
                onConfirm={handleDelete} // ฟังก์ชันสำหรับการยืนยันการลบ
            />

            <div className='foot-table'>
                <span>Page {currentPage} of {totalPages}</span>
            </div>

            <div className='foot-table'>
                <label>Rows per page:</label>
                <select value={rowsPerPage} onChange={handleRowsPerPageChange} className='row-page'>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>

                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='button-back'>
                    <ArrowBackIosNewIcon style={{ fontSize: '16px' }} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`button-page ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='button-next'>
                    <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
                </button>
            </div>
        </div>
    );
};

export default DataTableRoom;
