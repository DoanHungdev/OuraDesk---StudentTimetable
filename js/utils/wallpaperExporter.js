/**
 * Phone Wallpaper Generator (9:16 Ratio)
 * Creates a high-resolution pastel glassmorphism timetable lockscreen wallpaper
 */
import { DAY_NAMES } from '../data/mockData.js';
import { TimetableEngine } from './timetableEngine.js';

export const WallpaperExporter = {
  /**
   * Render timetable to an off-screen HTML5 Canvas (1080 x 1920)
   */
  generateWallpaperBlob(courses, user, mode = 'high_school') {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // 1. Soft Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#F8C5B0');
    bgGrad.addColorStop(0.5, '#F7B89E');
    bgGrad.addColorStop(1, '#FAD8C8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Ambient Pastel Blobs
    const drawBlob = (x, y, r, color) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.filter = 'blur(60px)';
      ctx.fill();
      ctx.restore();
    };

    drawBlob(200, 300, 180, 'rgba(255, 255, 255, 0.45)');
    drawBlob(880, 800, 220, 'rgba(244, 124, 99, 0.25)');
    drawBlob(250, 1500, 200, 'rgba(175, 200, 245, 0.35)');

    // 3. Header Card (Glass Panel)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 3;
    this.roundRect(ctx, 60, 80, 960, 240, 36);
    ctx.fill();
    ctx.stroke();

    // App Brand & Slogan
    ctx.fillStyle = '#F47C63';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CLASS SCHEDULE', 100, 150);

    ctx.fillStyle = '#64748B';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('“Chụp TKB. Phần còn lại để app lo.”', 100, 190);

    // Student Info
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    const subTitle = mode === 'high_school' 
      ? `${user.name} • Lớp ${user.className || '12A3'}` 
      : `${user.name} • ${user.major || 'Sinh viên'}`;
    ctx.fillText(subTitle, 100, 265);
    ctx.restore();

    // 4. Days Grid Layout (Monday to Saturday)
    const daysToShow = [1, 2, 3, 4, 5, 6];
    const colWidth = 148;
    const startX = 60;
    const startY = 360;
    const totalHeight = 1380;

    // Background glass container for timetable
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    this.roundRect(ctx, startX, startY, 960, totalHeight, 36);
    ctx.fill();
    ctx.stroke();

    // Draw Column Headers
    daysToShow.forEach((dNum, idx) => {
      const dInfo = DAY_NAMES.find(d => d.day === dNum);
      const colX = startX + 16 + (idx * 155);

      // Header pill
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(244, 124, 99, 0.15)' : 'rgba(255, 255, 255, 0.8)';
      this.roundRect(ctx, colX, startY + 20, 142, 60, 18);
      ctx.fill();

      ctx.fillStyle = idx % 2 === 0 ? '#EA580C' : '#374151';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(dInfo.shortName, colX + 71, startY + 60);
    });
    ctx.textAlign = 'left';

    // Draw Schedule Items
    const allItems = TimetableEngine.getAllScheduleItems(courses);

    daysToShow.forEach((dNum, idx) => {
      const colX = startX + 16 + (idx * 155);
      const dayItems = allItems.filter(i => i.day === dNum);
      dayItems.sort((a, b) => TimetableEngine.timeToMinutes(a.startTime) - TimetableEngine.timeToMinutes(b.startTime));

      let currentItemY = startY + 100;

      dayItems.forEach(item => {
        const itemHeight = Math.min(180, Math.max(95, (item.sessions || 2) * 45));

        // Card background
        ctx.fillStyle = item.courseColor || '#AFC8F5';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        this.roundRect(ctx, colX, currentItemY, 142, itemHeight, 18);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Course Name
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        const truncatedName = item.courseName.length > 10 ? item.courseName.substring(0, 9) + '..' : item.courseName;
        ctx.fillText(truncatedName, colX + 12, currentItemY + 34);

        // Period Badge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
        const pLabel = item.startPeriod ? `T${item.startPeriod}–${item.endPeriod}` : item.startTime;
        ctx.fillText(pLabel, colX + 12, currentItemY + 62);

        // Room
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
        const roomShort = (item.room || '12A3').replace('Phòng ', '');
        ctx.fillText(roomShort, colX + 12, currentItemY + 84);

        currentItemY += itemHeight + 14;
      });
    });

    // 5. Footer Slogan
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLASS SCHEDULE • Soft Glassmorphism Lockscreen', 540, 1860);

    ctx.restore();

    return canvas.toDataURL('image/png');
  },

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
};
