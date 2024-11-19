import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import './css/Button.css'; // นำเข้าไฟล์ CSS

const Confirm = ({ open, onClose, onConfirm }) => {
    if (!open) return null; // ไม่แสดงถ้าไม่เปิด

    return (
        <div className="overlay">
            <div className="background-main">
                <div className="C-C-header">
                    <h2>แจ้งเตือน</h2>
                </div>
                <div className="C-C-main">
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircleOutlineIcon color="primary" style={{ fontSize: '80px' }} />
                    </div>
                        <p>ยืนยันข้อมูล</p>
                    <div className="C-C-actions">
                        <button onClick={onConfirm} className="confirm-button">ยืนยัน</button>
                            <button onClick={onClose} className="cancel-button">ยกเลิก</button>
                           
                        </div>
                    
            </div>
            
            </div>
        </div>
    );
};

export default Confirm;
