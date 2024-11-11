import React from 'react';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import './css/Delete-Confirm.css'; // นำเข้าไฟล์ CSS

const Delete = ({ open, onClose, onConfirm }) => {
    if (!open) return null; // ไม่แสดงถ้าไม่เปิด

    return (
        <div className="overlay">
            <div className="background-main">
                <div className="C-C-header">
                    <h2>แจ้งเตือน</h2>
                </div>
                <div className="C-C-main">
                    <div style={{ textAlign: 'center' }}>
                        <DeleteForeverIcon color="primary" style={{ fontSize: '80px' }} />
                    </div>
                    <p>ยืนยันการลบข้อมูล</p>
                    <div className="C-C-actions">
                        <button onClick={onConfirm} className="confirm-button">ยืนยัน</button>

                        <button onClick={onClose} className="cancel-button">ยกเลิก</button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Delete;
