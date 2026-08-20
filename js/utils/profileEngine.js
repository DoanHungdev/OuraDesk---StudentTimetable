/**
 * University Time Profile Engine
 * Handles period calculations, time conversions, break detection, and multi-university switching
 */
import { PRESET_UNIVERSITIES } from '../data/universities/universityProfiles.js';
import { Storage } from './storage.js';

export const ProfileEngine = {
  /**
   * Get all universities (presets + custom)
   */
  getUniversities() {
    const customList = Storage.getCustomUniversities() || [];
    return [...PRESET_UNIVERSITIES, ...customList];
  },

  getUniversity(univId) {
    return this.getUniversities().find(u => u.id === univId) || this.getUniversities()[0];
  },

  getCampus(univId, campusId) {
    const univ = this.getUniversity(univId);
    if (!univ || !univ.campuses) return null;
    return univ.campuses.find(c => c.id === campusId) || univ.campuses[0];
  },

  getProfile(univId, campusId, profileId) {
    const campus = this.getCampus(univId, campusId);
    if (!campus || !campus.profiles) return null;
    return campus.profiles.find(p => p.id === profileId) || campus.profiles[0];
  },

  getProfileById(profileId) {
    const all = this.getUniversities();
    for (const u of all) {
      for (const c of (u.campuses || [])) {
        for (const p of (c.profiles || [])) {
          if (p.id === profileId) return { profile: p, campus: c, university: u };
        }
      }
    }
    // Fallback to HaUI theory
    return {
      profile: PRESET_UNIVERSITIES[0].campuses[0].profiles[0],
      campus: PRESET_UNIVERSITIES[0].campuses[0],
      university: PRESET_UNIVERSITIES[0]
    };
  },

  /**
   * Get current active profile configuration
   */
  getActiveProfileState() {
    const saved = Storage.getActiveProfileConfig();
    const univId = saved?.univId || 'haui';
    const campusId = saved?.campusId || 'haui_hn';
    const profileId = saved?.profileId || 'haui_hn_theory';

    const university = this.getUniversity(univId);
    const campus = this.getCampus(univId, campusId);
    const profile = this.getProfile(univId, campusId, profileId);

    return {
      univId: university?.id || 'haui',
      campusId: campus?.id || 'haui_hn',
      profileId: profile?.id || 'haui_hn_theory',
      university,
      campus,
      profile
    };
  },

  /**
   * Set active university, campus and profile
   */
  setActiveProfile(univId, campusId, profileId) {
    Storage.saveActiveProfileConfig({ univId, campusId, profileId });
  },

  /**
   * Core Calculation: Calculate Exact Start Time, End Time & Breaks from Period Range
   * e.g. HaUI Theory: Tiết 1 -> Tiết 3 => 07:00 - 09:40 (includes 10m break at 08:40)
   */
  calculateTimeRangeFromPeriods(profileId, startPeriodNum, endPeriodNum) {
    const { profile } = this.getProfileById(profileId);
    if (!profile || !profile.periods || profile.periods.length === 0) {
      return {
        startTime: '07:00',
        endTime: '09:30',
        durationMinutes: 150,
        sessions: Math.max(1, endPeriodNum - startPeriodNum + 1),
        breaksSummary: '',
        valid: false
      };
    }

    const startP = profile.periods.find(p => p.number === Number(startPeriodNum));
    const endP = profile.periods.find(p => p.number === Number(endPeriodNum));

    if (!startP || !endP) {
      const fallbackStart = profile.periods[0];
      const fallbackEnd = profile.periods[Math.min(2, profile.periods.length - 1)];
      return {
        startTime: fallbackStart.startTime,
        endTime: fallbackEnd.endTime,
        durationMinutes: 150,
        sessions: 3,
        breaksSummary: '',
        valid: true
      };
    }

    // Detect breaks in-between startP and endP
    const includedPeriods = profile.periods.filter(p => p.number >= startP.number && p.number <= endP.number && p.isUsable);
    const breaks = [];
    includedPeriods.forEach((p, idx) => {
      if (p.breakAfter > 0 && idx < includedPeriods.length - 1) {
        breaks.push(`Nghỉ ${p.breakAfter}p sau ${p.name}`);
      }
    });

    // Time calculations
    const [sh, sm] = startP.startTime.split(':').map(Number);
    const [eh, em] = endP.endTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    const durationMinutes = Math.max(30, endMins - startMins);

    return {
      startTime: startP.startTime,
      endTime: endP.endTime,
      durationMinutes,
      sessions: includedPeriods.length,
      breaksSummary: breaks.join(', '),
      startPeriod: startP.number,
      endPeriod: endP.number,
      valid: true
    };
  },

  /**
   * Find period range that best covers a given startTime and endTime
   */
  findPeriodsFromTimeRange(profileId, startTime, endTime) {
    const { profile } = this.getProfileById(profileId);
    if (!profile || !profile.periods) return { startPeriod: 1, endPeriod: 3 };

    const toMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const sMin = toMin(startTime);
    const eMin = toMin(endTime);

    let startP = profile.periods.find(p => toMin(p.startTime) >= sMin) || profile.periods[0];
    let endP = [...profile.periods].reverse().find(p => toMin(p.endTime) <= eMin) || profile.periods[profile.periods.length - 1];

    if (startP.number > endP.number) {
      endP = startP;
    }

    return {
      startPeriod: startP.number,
      endPeriod: endP.number
    };
  }
};
