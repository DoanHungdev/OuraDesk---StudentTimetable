/**
 * Export and Print Engine for Lumina Schedule
 * - RFC 5545 iCalendar (.ics) export
 * - Print-friendly formatted timetable view
 * - JSON Backup & Restore
 */
import { DAY_NAMES } from '../data/mockData.js';

export const Exporter = {
  /**
   * Export all courses to standard iCal format (.ics)
   */
  exportToICS(courses, user) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OuraDesk//Student Timetable//VI',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Thời khóa biểu - ' + (user.name || 'Sinh viên'),
      'X-WR-TIMEZONE:Asia/Ho_Chi_Minh'
    ];

    // Reference base date (e.g. Current Monday in 2026: 2026-08-17)
    const baseDate = new Date();
    const dayOfWeek = baseDate.getDay(); // 0 = Sun, 1 = Mon ...
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diffToMonday);

    const pad = (n) => String(n).padStart(2, '0');

    courses.forEach(course => {
      (course.schedules || []).forEach(sch => {
        // Calculate the event date for this weekday
        const targetDate = new Date(monday);
        const dayOffset = sch.day === 0 ? 6 : sch.day - 1; // 0 (Sun) is offset 6 from Mon
        targetDate.setDate(monday.getDate() + dayOffset);

        const y = targetDate.getFullYear();
        const m = pad(targetDate.getMonth() + 1);
        const d = pad(targetDate.getDate());

        const [startH, startM] = sch.startTime.split(':');
        const [endH, endM] = sch.endTime.split(':');

        const dtStart = `${y}${m}${d}T${startH}${startM}00`;
        const dtEnd = `${y}${m}${d}T${endH}${endM}00`;

        const dayRules = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        const rruleDay = dayRules[sch.day];

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:ouradesk-${course.id}-${sch.id}@ouradesk.app`);
        lines.push(`DTSTAMP:${y}${m}${d}T000000Z`);
        lines.push(`DTSTART;TZID=Asia/Ho_Chi_Minh:${dtStart}`);
        lines.push(`DTEND;TZID=Asia/Ho_Chi_Minh:${dtEnd}`);
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${rruleDay};COUNT=16`);
        lines.push(`SUMMARY:${course.name} (${course.code})`);
        lines.push(`LOCATION:${sch.room || course.room || 'Phòng học'}`);
        lines.push(`DESCRIPTION:Giảng viên: ${course.teacher || 'Chưa cập nhật'}\\nSố tiết: ${sch.sessions || 3} tiết\\nSố tín chỉ: ${course.credits} tín chỉ`);
        lines.push('STATUS:CONFIRMED');
        lines.push('END:VEVENT');
      });
    });

    lines.push('END:VCALENDAR');

    const icsContent = lines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ThoiKhoaBieu_${(user.name || 'SinhVien').replace(/\s+/g, '_')}_2026.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  },

  /**
   * Open Print preview window with formatted A4 landscape table
   */
  printTimetable(courses, user) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Vui lòng cho phép popup để in thời khóa biểu.');
      return;
    }

    const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const days = [
      { day: 1, label: 'Thứ Hai' },
      { day: 2, label: 'Thứ Ba' },
      { day: 3, label: 'Thứ Tư' },
      { day: 4, label: 'Thứ Năm' },
      { day: 5, label: 'Thứ Sáu' },
      { day: 6, label: 'Thứ Bảy' },
      { day: 0, label: 'Chủ Nhật' }
    ];

    let tableHeaders = '<th>Giờ</th>' + days.map(d => `<th>${d.label}</th>`).join('');
    
    // Build schedule map: day -> list of schedules
    const dayMap = {};
    days.forEach(d => { dayMap[d.day] = []; });
    courses.forEach(c => {
      (c.schedules || []).forEach(s => {
        if (dayMap[s.day]) {
          dayMap[s.day].push({ ...s, courseName: c.name, courseCode: c.code, teacher: c.teacher, color: c.color });
        }
      });
    });

    let courseListRows = courses.map(c => `
      <tr>
        <td><strong>${c.code}</strong></td>
        <td>${c.name}</td>
        <td>${c.credits}</td>
        <td>${c.hoursPerWeek}</td>
        <td>${c.teacher || '---'}</td>
        <td>${c.room || '---'}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Thời khóa biểu - ${user.name}</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F47C63; padding-bottom: 12px; margin-bottom: 20px; }
          .title h1 { margin: 0; font-size: 22px; color: #F47C63; }
          .title p { margin: 4px 0 0 0; font-size: 13px; color: #666; }
          .student-info { text-align: right; font-size: 13px; }
          .student-info strong { color: #111; }
          table.timetable { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          table.timetable th, table.timetable td { border: 1px solid #DDD; padding: 8px 6px; text-align: center; font-size: 12px; vertical-align: top; }
          table.timetable th { background: #FFF3EE; color: #333; font-weight: 700; }
          .course-box { background: #F8F9FA; border-left: 4px solid #F47C63; padding: 6px; border-radius: 4px; text-align: left; margin-bottom: 4px; font-size: 11px; }
          .course-box strong { font-size: 12px; display: block; color: #1F2937; }
          .course-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px; }
          .course-table th, .course-table td { border: 1px solid #EEE; padding: 6px 10px; text-align: left; }
          .course-table th { background: #F8F9FA; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">
            <h1>THỜI KHÓA BIỂU HỌC TẬP</h1>
            <p>${user.semester} • ${user.university}</p>
          </div>
          <div class="student-info">
            <p>Sinh viên: <strong>${user.name}</strong> (MSSV: ${user.studentId})</p>
            <p>Ngành: ${user.major}</p>
          </div>
        </div>

        <table class="timetable">
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Lịch học trong tuần</strong></td>
              ${days.map(d => {
                const items = dayMap[d.day] || [];
                if (items.length === 0) return '<td style="color: #AAA;">(Trống)</td>';
                return `<td>${items.map(it => `
                  <div class="course-box" style="border-left-color: ${it.color || '#F47C63'}">
                    <strong>${it.courseName}</strong>
                    <span>${it.startTime} – ${it.endTime} (${it.sessions} tiết)</span><br>
                    <span>${it.room || ''} • ${it.teacher || ''}</span>
                  </div>
                `).join('')}</td>`;
              }).join('')}
            </tr>
          </tbody>
        </table>

        <h3>Danh sách học phần đăng ký (${courses.length} môn - ${courses.reduce((s, c) => s + (c.credits || 0), 0)} tín chỉ)</h3>
        <table class="course-table">
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên môn học</th>
              <th>Số tín chỉ</th>
              <th>Số tiết/tuần</th>
              <th>Giảng viên</th>
              <th>Phòng học</th>
            </tr>
          </thead>
          <tbody>
            ${courseListRows}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #F47C63; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
            In thời khóa biểu (Print)
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
