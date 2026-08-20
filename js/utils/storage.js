import { INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_USER } from '../data/mockData.js';
import { 
  INITIAL_HIGH_SCHOOL_COURSES, 
  INITIAL_HIGH_SCHOOL_HOMEWORK, 
  INITIAL_HIGH_SCHOOL_EXAMS, 
  INITIAL_GRADE_12_TARGETS, 
  INITIAL_HIGH_SCHOOL_USER 
} from '../data/highSchoolData.js';
import { AssignmentRepository } from '../repositories/assignmentRepository.js';
import { HomeworkRepository } from '../repositories/homeworkRepository.js';

const STORAGE_KEYS = {
  EDUCATION_MODE: 'class_schedule_mode_v2', // 'high_school' | 'university'
  ACTIVE_WEEK: 'class_schedule_active_week_v2',
  HAS_ONBOARDED: 'class_schedule_onboarded_v2',
  
  // Seed Version Keys
  UNIV_COURSES_SEEDED: 'class_schedule_univ_courses_seeded_v1',
  THPT_COURSES_SEEDED: 'class_schedule_thpt_courses_seeded_v1',
  UNIV_USER_SEEDED: 'class_schedule_univ_user_seeded_v1',
  THPT_USER_SEEDED: 'class_schedule_thpt_user_seeded_v1',

  // High School Keys
  THPT_COURSES: 'class_schedule_thpt_courses_v2',
  THPT_HOMEWORK: 'class_schedule_thpt_hw_v2',
  THPT_EXAMS: 'class_schedule_thpt_exams_v2',
  THPT_TARGETS: 'class_schedule_thpt_targets_v2',
  THPT_USER: 'class_schedule_thpt_user_v2',

  // University Keys
  UNIV_COURSES: 'class_schedule_univ_courses_v2',
  UNIV_ASSIGNMENTS: 'class_schedule_univ_asg_v2',
  UNIV_USER: 'class_schedule_univ_user_v2',
  ACTIVE_PROFILE: 'class_schedule_active_profile_v2',
  CUSTOM_UNIVERSITIES: 'class_schedule_custom_univs_v2',

  // History & Community
  VERSION_HISTORY: 'class_schedule_history_v2'
};

export const Storage = {
  getMode() {
    try {
      return localStorage.getItem(STORAGE_KEYS.EDUCATION_MODE) || 'high_school';
    } catch (e) {
      return 'high_school';
    }
  },

  setMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEYS.EDUCATION_MODE, mode);
    } catch (e) {
      console.error('Failed to set mode:', e);
    }
  },

  hasOnboarded() {
    return localStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED) === 'true';
  },

  setOnboarded(val = true) {
    localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, String(val));
  },

  getActiveWeek() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_WEEK) || 'Tuần 03';
  },

  setActiveWeek(week) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WEEK, week);
  },

  // --- Dynamic Courses Accessor based on current mode ---
  getCourses() {
    const mode = this.getMode();
    if (mode === 'high_school') {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.THPT_COURSES);
        if (data !== null) {
          return JSON.parse(data);
        }
        // Seed once if not present
        const seeded = localStorage.getItem(STORAGE_KEYS.THPT_COURSES_SEEDED);
        if (!seeded) {
          localStorage.setItem(STORAGE_KEYS.THPT_COURSES, JSON.stringify(INITIAL_HIGH_SCHOOL_COURSES));
          localStorage.setItem(STORAGE_KEYS.THPT_COURSES_SEEDED, 'true');
          return INITIAL_HIGH_SCHOOL_COURSES;
        }
        return [];
      } catch (e) {
        return INITIAL_HIGH_SCHOOL_COURSES;
      }
    } else {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.UNIV_COURSES);
        if (data !== null) {
          return JSON.parse(data);
        }
        // Seed once if not present
        const seeded = localStorage.getItem(STORAGE_KEYS.UNIV_COURSES_SEEDED);
        if (!seeded) {
          localStorage.setItem(STORAGE_KEYS.UNIV_COURSES, JSON.stringify(INITIAL_COURSES));
          localStorage.setItem(STORAGE_KEYS.UNIV_COURSES_SEEDED, 'true');
          return INITIAL_COURSES;
        }
        return [];
      } catch (e) {
        return INITIAL_COURSES;
      }
    }
  },

  saveCourses(courses, createHistoryRecord = false, changeReason = 'Chỉnh sửa thời khóa biểu') {
    const mode = this.getMode();
    const key = mode === 'high_school' ? STORAGE_KEYS.THPT_COURSES : STORAGE_KEYS.UNIV_COURSES;
    try {
      localStorage.setItem(key, JSON.stringify(courses || []));
      if (createHistoryRecord) {
        this.addHistoryRecord(courses, changeReason);
      }
    } catch (e) {
      console.error('Failed to save courses:', e);
    }
  },

  // --- User Profile ---
  getUser() {
    const mode = this.getMode();
    if (mode === 'high_school') {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.THPT_USER);
        if (data !== null) {
          return JSON.parse(data);
        }
        const seeded = localStorage.getItem(STORAGE_KEYS.THPT_USER_SEEDED);
        if (!seeded) {
          localStorage.setItem(STORAGE_KEYS.THPT_USER, JSON.stringify(INITIAL_HIGH_SCHOOL_USER));
          localStorage.setItem(STORAGE_KEYS.THPT_USER_SEEDED, 'true');
          return INITIAL_HIGH_SCHOOL_USER;
        }
        return INITIAL_HIGH_SCHOOL_USER;
      } catch (e) {
        return INITIAL_HIGH_SCHOOL_USER;
      }
    } else {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.UNIV_USER);
        if (data !== null) {
          return JSON.parse(data);
        }
        const seeded = localStorage.getItem(STORAGE_KEYS.UNIV_USER_SEEDED);
        if (!seeded) {
          localStorage.setItem(STORAGE_KEYS.UNIV_USER, JSON.stringify(INITIAL_USER));
          localStorage.setItem(STORAGE_KEYS.UNIV_USER_SEEDED, 'true');
          return INITIAL_USER;
        }
        return INITIAL_USER;
      } catch (e) {
        return INITIAL_USER;
      }
    }
  },

  saveUser(user) {
    const mode = this.getMode();
    const key = mode === 'high_school' ? STORAGE_KEYS.THPT_USER : STORAGE_KEYS.UNIV_USER;
    try {
      localStorage.setItem(key, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user:', e);
    }
  },

  // --- THPT Homework (Delegated to HomeworkRepository) ---
  getHomework() {
    return HomeworkRepository.getAll();
  },

  saveHomework(hwList) {
    HomeworkRepository._saveAll(hwList);
  },

  // --- THPT Exams ---
  getExams() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.THPT_EXAMS);
      return data ? JSON.parse(data) : INITIAL_HIGH_SCHOOL_EXAMS;
    } catch (e) {
      return INITIAL_HIGH_SCHOOL_EXAMS;
    }
  },

  saveExams(exams) {
    try {
      localStorage.setItem(STORAGE_KEYS.THPT_EXAMS, JSON.stringify(exams || []));
    } catch (e) {
      console.error('Failed to save exams:', e);
    }
  },

  // --- Grade 12 Targets ---
  getGrade12Targets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.THPT_TARGETS);
      return data ? JSON.parse(data) : INITIAL_GRADE_12_TARGETS;
    } catch (e) {
      return INITIAL_GRADE_12_TARGETS;
    }
  },

  saveGrade12Targets(targets) {
    try {
      localStorage.setItem(STORAGE_KEYS.THPT_TARGETS, JSON.stringify(targets));
    } catch (e) {
      console.error('Failed to save Grade 12 targets:', e);
    }
  },

  // --- University Assignments (Delegated to AssignmentRepository) ---
  getAssignments() {
    return AssignmentRepository.getAll();
  },

  saveAssignments(asgList) {
    AssignmentRepository._saveAll(asgList);
  },

  // --- University Time Profile Config ---
  getActiveProfileConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
      return data ? JSON.parse(data) : {
        univId: 'haui',
        campusId: 'haui_hn',
        profileId: 'haui_hn_theory'
      };
    } catch (e) {
      return {
        univId: 'haui',
        campusId: 'haui_hn',
        profileId: 'haui_hn_theory'
      };
    }
  },

  saveActiveProfileConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save active profile:', e);
    }
  },

  getCustomUniversities() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_UNIVERSITIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveCustomUniversities(customUnivs) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_UNIVERSITIES, JSON.stringify(customUnivs));
    } catch (e) {
      console.error('Failed to save custom universities:', e);
    }
  },

  // --- Version History ---
  getVersionHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addHistoryRecord(courses, reason = 'Cập nhật thời khóa biểu') {
    const history = this.getVersionHistory();
    const record = {
      id: 'ver-' + Date.now(),
      timestamp: new Date().toISOString(),
      reason,
      week: this.getActiveWeek(),
      coursesCount: courses.length,
      coursesSnapshot: JSON.parse(JSON.stringify(courses))
    };
    history.unshift(record);
    // Keep last 15 versions
    if (history.length > 15) history.pop();
    try {
      localStorage.setItem(STORAGE_KEYS.VERSION_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  },

  resetToDefault() {
    try {
      localStorage.clear();
      AssignmentRepository.resetToDemo(INITIAL_ASSIGNMENTS);
      HomeworkRepository.resetToDemo(INITIAL_HIGH_SCHOOL_HOMEWORK);
    } catch (e) {
      console.error('Reset error:', e);
    }
  }
};
