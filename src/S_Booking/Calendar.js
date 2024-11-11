// Calendar.js
import React, { useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../css/Calendar.css';


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="empty-day" />);

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div key={day} className={`day ${isToday ? 'today' : ''}`}>
          {day}
        </div>
      );
    }
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (event) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(event.target.value), 1));
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value) - 543; // แปลงจาก พ.ศ. เป็น ค.ศ.
    setCurrentDate(new Date(selectedYear, currentDate.getMonth(), 1));
  };

  return (
    <div className="t1">

      <div className="header1">
        <div>
          <span> {currentDate.getDate()}</span>
          {currentDate.toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
          
        </div>
      </div>

      <div className="header1">

        <select value={currentDate.getMonth()} onChange={handleMonthChange} className='month'>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString('th-TH', { month: 'long' })}
            </option>
          ))}
        </select>

        <select value={currentDate.getFullYear() + 543} onChange={handleYearChange} className='year'>
          {Array.from({ length: 10 }, (_, i) => {
            const year = today.getFullYear() - 5 + i + 543; // แปลงปี ค.ศ. เป็น พ.ศ.
            return (
              <option key={i} value={year}>
                {year}
              </option>
            );
          })}
        </select>

      </div>

     

      <div className="header1">
        <button onClick={goToPreviousMonth} className='iconBack-Forwar'>
          <ArrowBackIosNewIcon />
        </button>
        <div>
          {currentDate.toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
          
        </div>

        <button onClick={goToNextMonth} className='iconBack-Forwar'>
          <ArrowForwardIosIcon color="primary" />
        </button>
      </div>


      <div className="weekdays">
        <div>อาทิตย์</div>
        <div>จันทร์</div>
        <div>อังคาร</div>
        <div>พุธ</div>
        <div>พฤหัสบดี</div>
        <div>ศุกร์</div>
        <div>เสาร์</div>
      </div>
      <div className="days">{generateCalendar()}</div>


    </div>
  );
};

export default Calendar;
