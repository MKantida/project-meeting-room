/* server.js */
const express = require('express'); // นำเข้า Express.js เพื่อสร้างเซิร์ฟเวอร์
const cors = require('cors'); // นำเข้า CORS สำหรับจัดการการร้องขอข้ามโดเมน
const mysql = require('mysql2'); // นำเข้า MySQL สำหรับเชื่อมต่อกับฐานข้อมูล MySQL

const app = express(); // สร้างแอปพลิเคชัน Express
const PORT = 5000; // กำหนดพอร์ตที่เซิร์ฟเวอร์จะทำงาน

// MySQL Database Connection
const db = mysql.createConnection({
    host: '127.0.0.1', // ระบุที่อยู่ IP ของเซิร์ฟเวอร์ MySQL
    user: 'root', // ชื่อผู้ใช้ MySQL
    password: '', // รหัสผ่าน MySQL
    database: 'general_system' // ชื่อฐานข้อมูลที่จะเชื่อมต่อ
});

// เชื่อมต่อกับฐานข้อมูล MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err); // หากเกิดข้อผิดพลาด ให้แสดงข้อผิดพลาด
    } else {
        console.log('Connected to the MySQL database'); // หากเชื่อมต่อสำเร็จ ให้แสดงข้อความยืนยัน
    }
});

// Middleware
app.use(cors()); // ใช้ CORS middleware
app.use(express.json()); // ใช้ middleware สำหรับการ parsing JSON ที่ส่งมาจาก client



//////////////////////////////////////////////////////////////
//////////////////// Routes สำหรับ Rooms /////////////////////
/////////////////////////////////////////////////////////////

// ดึงข้อมูลห้องประชุมทั้งหมดจากตาราง
app.get('/api/rooms', (req, res) => {
    console.log('Fetching all rooms'); // แสดงข้อความใน Terminal เมื่อมีการดึงข้อมูลห้อง
    db.query('SELECT * FROM tb_room', (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err); // แสดงข้อผิดพลาดหากมี
            return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
        }
        res.json(results); // ส่งข้อมูลห้องประชุมกลับไปยัง client
    });
});

// เพิ่มห้องประชุมใหม่ในตาราง
app.post('/api/rooms', (req, res) => {
    const { roomname, status_id, details } = req.body; // ดึงข้อมูลจาก request body
    console.log('Adding new room:', { roomname, status_id, details }); // แสดงข้อมูลห้องที่จะเพิ่ม
    db.query(
        'INSERT INTO tb_room (roomname, status_id, details) VALUES (?, ?, ?)',
        [roomname, status_id, details],
        (err, results) => {
            if (err) {
                console.error('Error adding room:', err); // แสดงข้อผิดพลาดหากมี
                return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
            }
            res.status(201).json({ message: 'Room created successfully', roomId: results.insertId }); // ส่งข้อความยืนยันพร้อม ID ของห้องใหม่
        }
    );
});

// ดึงข้อมูลห้องประชุมเฉพาะห้องตาม ID
app.get('/api/rooms/:id', (req, res) => {
    const { id } = req.params; // ดึง ID จากพารามิเตอร์ของ URL
    console.log(`Fetching room with ID: ${id}`); // แสดง ID ที่ดึงมา
    db.query('SELECT * FROM tb_room WHERE room_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching room:', err); // แสดงข้อผิดพลาดหากมี
            return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Room not found' }); // ส่งข้อความหากไม่พบห้อง
        }
        res.json(results[0]); // ส่งข้อมูลห้องประชุมกลับไปยัง client
    });
});

// อัปเดตข้อมูลห้องประชุมเฉพาะห้อง
app.put('/api/rooms/:id', (req, res) => {
    const { id } = req.params; // ดึง ID จากพารามิเตอร์ของ URL
    const { roomname, status_id, details } = req.body; // ดึงข้อมูลจาก request body
    console.log('Updating room:', { id, roomname, status_id, details }); // แสดงข้อมูลที่จะแก้ไข
    db.query(
        'UPDATE tb_room SET roomname = ?, status_id = ?, details = ? WHERE room_id = ?',
        [roomname, status_id, details, id],
        (err, results) => {
            if (err) {
                console.error('Error updating room:', err); // แสดงข้อผิดพลาดหากมี
                return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
            }
            res.json({ message: 'Room updated successfully' }); // ส่งข้อความยืนยันเมื่ออัปเดตสำเร็จ
        }
    );
});

// ลบข้อมูลห้องประชุมเฉพาะห้องตาม ID
app.delete('/api/rooms/:id', (req, res) => {
    const { id } = req.params; // ดึง ID จากพารามิเตอร์ของ URL
    console.log(`Deleting room with ID: ${id}`); // แสดง ID ที่จะลบ
    db.query('DELETE FROM tb_room WHERE room_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting room:', err); // แสดงข้อผิดพลาดหากมี
            return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
        }
        res.json({ message: 'Room deleted successfully' }); // ส่งข้อความยืนยันเมื่อทำการลบสำเร็จ
    });
});

// สร้าง route สำหรับดึงข้อมูลห้องประชุมที่มี status_id
app.get('/api/rooms/status_id/:statusId', (req, res) => {
    const statusId = req.params.statusId; // ดึง status_id จาก path parameters
    console.log('Fetching rooms with status_id:', statusId); // ตรวจสอบค่า status_id

    const query = 'SELECT * FROM tb_room WHERE status_id = ?'; // คำสั่ง SQL สำหรับค้นหาห้องประชุมตาม status_id
    db.query(query, [statusId], (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err); // แสดงข้อผิดพลาดหากมี
            res.status(500).json({ error: 'Error fetching rooms' }); // ส่งข้อผิดพลาดกลับไปยัง client
            return;
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No rooms found with the given status_id' }); // ส่งข้อความหากไม่พบห้อง
        }

        res.json(results); // ส่งข้อมูลห้องประชุมกลับไปยัง client
    });
});

/////////////////////////////////////////////////////////////
//////////////////// Routes สำหรับ Bookings /////////////////
/////////////////////////////////////////////////////////////

app.get('/api/bookings', (req, res) => {
    console.log('Fetching all bookings'); // แสดงข้อความเมื่อดึงข้อมูลการจองทั้งหมด
    const sql = `
        SELECT b.booking_id, b.meetingname, b.startday, b.start_time, b.end_time,
               b.room_id, b.status_id, r.roomname 
        FROM tb_booking AS b
        JOIN tb_room AS r ON b.room_id = r.room_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err); // แสดงข้อผิดพลาดหากมี
            return res.status(500).send('Error fetching data'); // ส่งข้อผิดพลาดกลับไปยัง client
        }
        res.json(results); // ส่งข้อมูลการจองกลับไปยัง client
    });
});

// เพิ่มการจองใหม่ในตาราง
app.post('/api/bookings', (req, res) => {
    const { meetingname, startday, endday, start_time, end_time, room_id, numberOfPeople, details } = req.body; // ดึงข้อมูลจาก request body
    console.log('Creating booking:', { meetingname, startday, endday, start_time, end_time, room_id, numberOfPeople, details }); // แสดงข้อมูลการจองที่สร้าง
    db.query(
        'INSERT INTO tb_booking (meetingname, startday, endday, start_time, end_time, room_id, numberOfPeople, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [meetingname, startday, endday, start_time, end_time, room_id, numberOfPeople, details],
        (err, results) => {
            if (err) {
                console.error('Error creating booking:', err); // แสดงข้อผิดพลาดหากมี
                return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
            }
            res.status(201).json({ message: 'Booking created successfully', bookingId: results.insertId }); // ส่งข้อความยืนยันพร้อม ID ของการจองใหม่
        }
    );
});

// ดึงข้อมูลการจองตาม ID
app.get('/api/bookings/:id', (req, res) => {
    const { id } = req.params; // ดึง ID จากพารามิเตอร์ของ URL
    console.log(`Fetching booking with ID: ${id}`); // แสดง ID ที่ดึงมา
    db.query('SELECT * FROM tb_booking WHERE booking_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching booking:', err); // แสดงข้อผิดพลาดหากมี
            return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Booking not found' }); // ส่งข้อความหากไม่พบการจอง
        }
        res.json(results[0]); // ส่งข้อมูลการจองกลับไปยัง client
    });
});

// อัปเดตข้อมูลการจองตาม ID
app.put('/api/bookings/:id', (req, res) => {
    const { id } = req.params; // ดึง ID จากพารามิเตอร์ของ URL
    const { meetingname, startday, endday, start_time, end_time, room_id, numberOfPeople, details } = req.body; // ดึงข้อมูลจาก request body
    console.log('Updating booking:', { id, meetingname, startday, endday, start_time, end_time, room_id, numberOfPeople, details }); // แสดงข้อมูลที่จะแก้ไข
    db.query(
        'UPDATE tb_booking SET meetingname = ?, startday = ?, endday = ?, start_time = ?, end_time = ?, room_id = ?, numberOfPeople = ?, details = ? WHERE booking_id = ?',
        [meetingname, startday, endday, start_time, end_time, room_id, numberOfPeople, details, id],
        (err, results) => {
            if (err) {
                console.error('Error updating booking:', err); // แสดงข้อผิดพลาดหากมี
                return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Booking not found or no changes made' }); // ส่งข้อความหากไม่พบการจองหรือไม่มีการเปลี่ยนแปลง
            }
            res.json({ message: 'Booking updated successfully' }); // ส่งข้อความยืนยันเมื่ออัปเดตสำเร็จ
        }
    );
});

// ลบข้อมูลการจองตาม ID
app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params; // ดึง ID จากพารามิเตอร์ของ URL
    console.log(`Deleting booking with ID: ${id}`); // แสดง ID ที่จะลบ
    db.query('DELETE FROM tb_booking WHERE booking_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting booking:', err); // แสดงข้อผิดพลาดหากมี
            return res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดกลับไปยัง client
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' }); // ส่งข้อความหากไม่พบการจอง
        }
        res.json({ message: 'Booking deleted successfully' }); // ส่งข้อความยืนยันเมื่อทำการลบสำเร็จ
    });
});

/////////////////////////////////////////////////////////////
//////////////////// Routes สำหรับ status ////////////////////
/////////////////////////////////////////////////////////////

// Route สำหรับดึงข้อมูลสถานะ
app.get('/api/status', (req, res) => {
    // ทำการสอบถามฐานข้อมูลเพื่อดึงข้อมูลสถานะทั้งหมด
    db.query('SELECT * FROM tb_status', (error, results) => {
        if (error) {
            // ถ้ามีข้อผิดพลาดในการสอบถาม ส่งสถานะ 500 และข้อผิดพลาดกลับไป
            console.error('Database error:', error); // บันทึกข้อผิดพลาดใน Terminal
            return res.status(500).json({ error: error.message });
        }

        console.log('Fetched status results:', results); // บันทึกผลลัพธ์ที่ได้รับจากฐานข้อมูลใน Terminal
        res.json(results); // ส่งผลลัพธ์กลับไปยัง client ในรูปแบบ JSON
    });
});



// เส้นทางสำหรับดึงข้อมูลสถานะห้องประชุม
app.get('/api/status_id/:ids', (req, res) => {
    const ids = req.params.ids.split(','); // แยก ID
    const query = `SELECT * FROM tb_status WHERE status_id IN (?)`;

    db.query(query, [ids], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results); // ส่งกลับผลลัพธ์เป็น JSON
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // แสดงข้อความยืนยันเมื่อเซิร์ฟเวอร์เริ่มทำงาน
});
