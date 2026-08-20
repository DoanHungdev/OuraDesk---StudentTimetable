/**
 * StatisticsView: Student Productivity Analytics
 * Supports both THPT (periods/week, subjects, homework) and University (credits, hours by Course Group)
 * Integrated with University Curriculum Engine
 * Uses Lucide Icons & Clean Typography
 */
import { TimetableEngine } from '../utils/timetableEngine.js';
import { DAY_NAMES } from '../data/mockData.js';
import { Storage } from '../utils/storage.js';
import { CurriculumEngine } from '../utils/curriculumEngine.js';

export const StatisticsView = {
  render(courses, assignments, user) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';

    const totalSubjects = courses.length;
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const targetCredits = user.targetCredits || 18;
    const creditPercent = Math.min(100, Math.round((totalCredits / targetCredits) * 100));

    // Calculate weekly study hours & sessions per day
    const allItems = TimetableEngine.getAllScheduleItems(courses);
    const totalWeeklyHours = allItems.reduce((sum, item) => {
      const dur = TimetableEngine.timeToMinutes(item.endTime) - TimetableEngine.timeToMinutes(item.startTime);
      return sum + (dur / 60);
    }, 0);

    const totalWeeklyPeriods = allItems.reduce((sum, item) => sum + (item.sessions || 2), 0);

    // Free time ratio in daytime
    const availableWeekHours = 77;
    const freeTimePercent = Math.max(0, Math.round(((availableWeekHours - totalWeeklyHours) / availableWeekHours) * 100));

    // Daily distribution (Mon to Sat for THPT, Mon to Sun for Univ)
    const daysToShow = isTHPT ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];
    const dayStats = daysToShow.map(dayNum => {
      const dayInfo = DAY_NAMES.find(d => d.day === dayNum);
      const items = allItems.filter(i => i.day === dayNum);
      const totalSessions = items.reduce((sum, i) => sum + (i.sessions || 2), 0);
      const totalHours = items.reduce((sum, i) => {
        const dur = TimetableEngine.timeToMinutes(i.endTime) - TimetableEngine.timeToMinutes(i.startTime);
        return sum + (dur / 60);
      }, 0);

      return {
        day: dayNum,
        name: dayInfo.shortName,
        fullName: dayInfo.name,
        count: items.length,
        sessions: totalSessions,
        hours: totalHours
      };
    });

    const maxDaySessions = Math.max(1, ...dayStats.map(d => d.sessions));

    // Bar chart rendering
    const barsHtml = dayStats.map(d => {
      const heightPercent = Math.round((d.sessions / maxDaySessions) * 100);
      return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1;">
          <span style="font-size: 0.72rem; font-weight: 600; color: var(--color-primary);">${d.sessions > 0 ? d.sessions + ' tiết' : '-'}</span>
          <div style="width: 100%; max-width: 40px; height: 140px; background: rgba(255,255,255,0.4); border-radius: var(--radius-md); display: flex; align-items: flex-end; padding: 4px;">
            <div style="width: 100%; height: ${Math.max(8, heightPercent)}%; background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-hover) 100%); border-radius: var(--radius-sm); transition: height 0.4s ease; box-shadow: 0 4px 10px var(--primary-glow);"></div>
          </div>
          <span style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary);">${d.name}</span>
        </div>
      `;
    }).join('');

    // Dynamic Group breakdown
    const activeGroups = isTHPT ? [
      { id: 'math_sci', name: 'Khoa học Tự nhiên', color: '#AFC8F5' },
      { id: 'soc_lang', name: 'Khoa học Xã hội', color: '#A9DED5' },
      { id: 'pe_art', name: 'Thể chất & Nghệ thuật', color: '#F4B5C2' }
    ] : CurriculumEngine.getActiveCourseGroups();

    const categoryStats = activeGroups.map(cat => {
      const matched = courses.filter(c => c.courseGroupId === cat.id || c.category === cat.id);
      const credits = matched.reduce((s, c) => s + (c.credits || 0), 0);
      const periods = matched.reduce((s, c) => s + (c.periodsPerWeek || 2), 0);
      return {
        ...cat,
        courseCount: matched.length,
        credits,
        periods
      };
    }).filter(c => c.courseCount > 0);

    const categoryHtml = categoryStats.length === 0 ? `
      <div style="padding: 12px; text-align: center; color: var(--color-text-secondary); font-size: 0.78rem;">
        Chưa có dữ liệu học phần
      </div>
    ` : categoryStats.map(c => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: ${c.color || 'var(--color-primary)'};"></div>
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--color-text);">${c.name} ${c.code ? `(${c.code})` : ''}</span>
        </div>
        <div style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary);">
          ${c.courseCount} ${isTHPT ? 'môn' : 'học phần'} ${isTHPT ? `(${c.periods} tiết/tuần)` : `(${c.credits} tín chỉ)`}
        </div>
      </div>
    `).join('');

    return `
      <div class="statistics-view-wrapper fade-in-lift">
        <!-- 4 Top Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px;">
          <div class="glass-card" style="padding: 16px;">
            <span style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase;">
              ${isTHPT ? 'TỔNG SỐ MÔN HỌC' : 'TỔNG SỐ HỌC PHẦN'}
            </span>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-text); margin-top: 4px;">
              ${totalSubjects} <span style="font-size: 0.85rem; font-weight: 500; color: var(--color-text-secondary);">${isTHPT ? 'môn' : 'học phần'}</span>
            </div>
            <div style="font-size: 0.74rem; color: #059669; font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="check-circle-2" style="width: 13px; height: 13px;"></i> Đầy đủ kế hoạch
            </div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <span style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase;">
              ${isTHPT ? 'TỔNG SỐ TIẾT / TUẦN' : 'TỔNG SỐ TÍN CHỈ'}
            </span>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary); margin-top: 4px;">
              ${isTHPT ? totalWeeklyPeriods : totalCredits} <span style="font-size: 0.85rem; font-weight: 500; color: var(--color-text-secondary);">${isTHPT ? 'tiết' : `/ ${targetCredits}`}</span>
            </div>
            <div style="font-size: 0.74rem; color: var(--color-text-secondary); font-weight: 500; margin-top: 4px;">
              ${isTHPT ? `Trung bình ${(totalWeeklyPeriods / 6).toFixed(1)} tiết/ngày` : `Đạt ${creditPercent}% chỉ tiêu`}
            </div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <span style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase;">SỐ GIỜ HỌC / TUẦN</span>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-text); margin-top: 4px;">
              ${totalWeeklyHours.toFixed(1)} <span style="font-size: 0.85rem; font-weight: 500; color: var(--color-text-secondary);">giờ</span>
            </div>
            <div style="font-size: 0.74rem; color: var(--color-text-secondary); font-weight: 500; margin-top: 4px;">
              Khoảng ${(totalWeeklyHours / (isTHPT ? 6 : 5)).toFixed(1)} giờ mỗi ngày
            </div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <span style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase;">TỶ LỆ THỜI GIAN RẢNH</span>
            <div style="font-size: 1.6rem; font-weight: 700; color: #059669; margin-top: 4px;">
              ${freeTimePercent}%
            </div>
            <div style="font-size: 0.74rem; color: var(--color-text-secondary); font-weight: 500; margin-top: 4px;">
              Thoải mái tự học & nghỉ ngơi
            </div>
          </div>
        </div>

        <!-- 2 Side-by-side Visual Charts -->
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px;">
          <!-- Bar chart: Classes per day -->
          <div class="glass-card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-text);">Phân bổ tiết học trong tuần</h3>
                <p style="font-size: 0.78rem; color: var(--color-text-secondary);">Tổng số tiết học phân bố theo từng ngày</p>
              </div>
              <span class="glass-pill" style="font-size: 0.72rem; font-weight: 600;">${allItems.length} buổi học</span>
            </div>

            <div style="display: flex; gap: 12px; align-items: flex-end; padding: 10px 0;">
              ${barsHtml}
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="glass-card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-text); margin-bottom: 3px;">
                ${isTHPT ? 'Khối lượng theo nhóm môn' : 'Phân bổ theo nhóm học phần'}
              </h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-bottom: 12px;">
                ${isTHPT ? 'Phân loại môn học theo tổ hợp môn' : 'Khối lượng tín chỉ theo khung chương trình đào tạo'}
              </p>
              
              <div class="category-breakdown-list custom-scroll" style="max-height: 220px; overflow-y: auto;">
                ${categoryHtml}
              </div>
            </div>

            <div style="background: var(--primary-light); border-radius: var(--radius-md); padding: 12px; margin-top: 12px; display: flex; align-items: center; gap: 12px;">
              <div style="color: var(--color-primary);">
                <i data-lucide="graduation-cap" style="width: 24px; height: 24px;"></i>
              </div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 600; color: var(--color-text);">
                  ${isTHPT ? 'Kế hoạch học tập cân đối' : 'Tiến độ tích lũy tín chỉ'}
                </div>
                <div style="font-size: 0.74rem; color: var(--color-text-secondary); line-height: 1.35;">
                  ${isTHPT ? 'Lịch học phân bổ hài hòa giữa các môn tự nhiên và xã hội.' : `Đã đăng ký ${totalCredits} tín chỉ theo Khung CTĐT.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {}
};
