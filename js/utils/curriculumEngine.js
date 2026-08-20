/**
 * CurriculumEngine: Universal Hierarchical Curriculum & Course Group Management
 * Architecture:
 * University -> Campus -> Major / Program -> Curriculum (Cohort / Academic Year / Version) -> CourseGroup -> Course
 * 
 * Guarantees:
 * - NO hardcoded global course group lists.
 * - Dynamic resolution based on Active University + Campus + Major + Curriculum.
 * - Supports custom curriculums and manual course groups.
 */

import { PRESET_UNIVERSITIES } from '../data/universities/universityProfiles.js';
import { PRESET_CURRICULUMS, PRESET_MAJORS_BY_UNIVERSITY } from '../data/universities/universityCurriculums.js';
import { Storage } from './storage.js';

const STORAGE_KEYS = {
  CURRICULUM_STATE: 'class_schedule_curriculum_state_v2',
  CUSTOM_CURRICULUMS: 'class_schedule_custom_curriculums_v2'
};

export const CurriculumEngine = {
  // --- 1. Get Universities ---
  getUniversities() {
    return PRESET_UNIVERSITIES;
  },

  getUniversity(univId) {
    return PRESET_UNIVERSITIES.find(u => u.id === univId) || PRESET_UNIVERSITIES[0];
  },

  // --- 2. Get Majors by University ---
  getMajors(univId = 'haui') {
    const presetMajors = PRESET_MAJORS_BY_UNIVERSITY[univId] || [
      { id: `${univId}_gen`, name: 'Chương trình chuẩn', isDefault: true }
    ];
    return presetMajors;
  },

  getMajor(univId = 'haui', majorId = 'haui_ce') {
    const majors = this.getMajors(univId);
    return majors.find(m => m.id === majorId) || majors[0];
  },

  // --- 3. Get Curriculums ---
  getAllCurriculums() {
    let custom = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_CURRICULUMS);
      if (stored) custom = JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load custom curriculums:', e);
    }
    return [...PRESET_CURRICULUMS, ...custom];
  },

  getCurriculums(univId = 'haui', majorId = 'haui_ce') {
    const all = this.getAllCurriculums();
    const filtered = all.filter(c => c.universityId === univId && (c.majorId === majorId || !majorId));
    if (filtered.length > 0) return filtered;

    // Fallback: search by majorId or return first available for univ
    const univOnly = all.filter(c => c.universityId === univId);
    return univOnly.length > 0 ? univOnly : [all[0]];
  },

  getCurriculumById(curriculumId) {
    const all = this.getAllCurriculums();
    return all.find(c => c.id === curriculumId) || null;
  },

  // --- 3.5 Auto Resolve Curriculum (Auto-matched by Univ + Major + Cohort, no manual version picking) ---
  resolveCurriculum({ universityId = 'haui', campusId = null, majorId = 'haui_ce', cohort = '20', academicYear = null }) {
    const all = this.getAllCurriculums();
    
    // 1. Match on universityId + majorId + cohort (+ campusId if matching)
    let matches = all.filter(c => 
      c.universityId === universityId && 
      c.majorId === majorId && 
      (!cohort || String(c.cohort) === String(cohort))
    );

    if (campusId && matches.some(c => c.campusId === campusId)) {
      matches = matches.filter(c => !c.campusId || c.campusId === campusId);
    }

    if (matches.length > 0) {
      // If multiple versions match: pick active or default or highest version
      const active = matches.find(c => c.isActive || c.isDefault) || matches[0];
      return active;
    }

    // 2. If no curriculum found for this specific school + major + cohort:
    return null;
  },

  // --- 4. Get Active Curriculum State ---
  getActiveCurriculumState() {
    let state = null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRICULUM_STATE);
      if (data) state = JSON.parse(data);
    } catch (e) {}

    const user = Storage.getUser();
    const univId = state?.univId || user?.universityId || 'haui';
    const campusId = state?.campusId || user?.campusId || 'haui_hn';
    const majorId = state?.majorId || user?.majorId || 'haui_ce';
    const cohort = state?.cohort || user?.cohort || '20';

    const university = this.getUniversity(univId);
    const campus = (university.campuses || []).find(c => c.id === campusId) || university.campuses?.[0];
    const major = this.getMajor(univId, majorId);

    // Auto resolve curriculum matching univ + major + cohort
    const curriculum = this.resolveCurriculum({ universityId: univId, campusId, majorId, cohort });
    const curriculumId = curriculum?.id || null;

    return {
      univId,
      university,
      campusId: campus?.id || campusId,
      campus,
      majorId,
      major,
      cohort,
      curriculumId,
      curriculum,
      curriculumVersion: curriculum?.curriculumVersion || curriculum?.version || '1.0',
      groups: curriculum?.groups || []
    };
  },

  // --- 5. Set Active Curriculum State ---
  setActiveCurriculumState(univId, campusId, majorId, cohort, curriculumId = null) {
    const university = this.getUniversity(univId);
    const campus = (university.campuses || []).find(c => c.id === campusId) || university.campuses?.[0];
    const major = this.getMajor(univId, majorId);

    let curr = null;
    if (curriculumId) {
      curr = this.getCurriculumById(curriculumId);
    }
    if (!curr || curr.universityId !== univId || curr.majorId !== majorId) {
      curr = this.resolveCurriculum({ 
        universityId: univId, 
        campusId: campus?.id || campusId, 
        majorId: major?.id || majorId, 
        cohort: cohort || '20' 
      });
    }

    const stateToSave = {
      univId,
      campusId: campus?.id || campusId,
      majorId: major?.id || majorId,
      cohort: cohort || '20',
      curriculumId: curr?.id || null
    };

    try {
      localStorage.setItem(STORAGE_KEYS.CURRICULUM_STATE, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save curriculum state:', e);
    }

    // Sync with User Profile
    const user = Storage.getUser();
    if (user && user.mode === 'university') {
      user.university = university.name;
      user.universityId = univId;
      user.schoolShort = university.shortName;
      user.campus = campus?.name || user.campus;
      user.campusId = campus?.id || campusId;
      user.major = major?.name || user.major;
      user.majorId = major?.id || majorId;
      user.cohort = cohort || user.cohort;
      user.curriculumId = curr?.id || null;
      user.curriculumName = curr?.name || '';
      user.curriculumVersion = curr?.curriculumVersion || curr?.version || '1.0';
      Storage.saveUser(user);
    }

    return this.getActiveCurriculumState();
  },

  // --- 6. Dynamic Course Groups (Taken directly from resolved Curriculum) ---
  getActiveCourseGroups() {
    const active = this.getActiveCurriculumState();
    if (active.groups && active.groups.length > 0) {
      return active.groups;
    }
    return [];
  },

  getCourseGroupById(groupId) {
    const groups = this.getActiveCourseGroups();
    return groups.find(g => g.id === groupId) || groups[0] || null;
  },

  // --- 7. Smart Course-to-Group Auto Mapper (For OCR / AI Import) ---
  findMatchingCourseGroup(courseName = '', courseCode = '', curriculumId = null) {
    const curriculum = curriculumId ? this.getCurriculumById(curriculumId) : this.getActiveCurriculumState().curriculum;
    if (!curriculum || !curriculum.groups) return null;

    const normName = courseName.trim().toLowerCase();
    const normCode = courseCode.trim().toUpperCase();

    for (const group of curriculum.groups) {
      for (const course of (group.courses || [])) {
        const cName = (course.name || '').trim().toLowerCase();
        const cCode = (course.code || '').trim().toUpperCase();

        // Exact or strong code match
        if (normCode && cCode && (normCode === cCode || normCode.includes(cCode) || cCode.includes(normCode))) {
          return { group, matchedCourse: course };
        }

        // Exact or fuzzy title match
        if (normName && cName && (normName === cName || normName.includes(cName) || cName.includes(normName))) {
          return { group, matchedCourse: course };
        }
      }
    }

    // Heuristic fallbacks for Vietnamese standard courses
    if (normName.includes('toán') || normName.includes('vật lý') || normName.includes('tiếng anh') || normName.includes('triết') || normName.includes('pháp luật')) {
      const gdc = curriculum.groups.find(g => g.code === 'GDC' || g.name.toLowerCase().includes('đại cương'));
      if (gdc) return { group: gdc, matchedCourse: null };
    }

    if (normName.includes('thể chất') || normName.includes('bóng') || normName.includes('bơi') || normName.includes('cầu lông')) {
      const gdtc = curriculum.groups.find(g => g.code === 'GDTC' || g.name.toLowerCase().includes('thể chất'));
      if (gdtc) return { group: gdtc, matchedCourse: null };
    }

    if (normName.includes('quốc phòng') || normName.includes('quân sự') || normName.includes('an ninh')) {
      const gdqp = curriculum.groups.find(g => g.code === 'GDQP' || g.name.toLowerCase().includes('quốc phòng'));
      if (gdqp) return { group: gdqp, matchedCourse: null };
    }

    return null;
  },

  // --- 8. Custom Curriculum Creation & Management ---
  createCustomCurriculum(curriculumData) {
    const id = curriculumData.id || `curriculum_custom_${Date.now()}`;
    const newCurriculum = {
      ...curriculumData,
      id,
      version: curriculumData.version || '1.0',
      groups: curriculumData.groups || []
    };

    let customs = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_CURRICULUMS);
      if (stored) customs = JSON.parse(stored);
    } catch (e) {}

    customs.push(newCurriculum);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CURRICULUMS, JSON.stringify(customs));
    } catch (e) {
      console.error('Failed to save custom curriculum:', e);
    }

    return newCurriculum;
  },

  addCustomCourseGroup(curriculumId, groupData) {
    const all = this.getAllCurriculums();
    const curr = all.find(c => c.id === curriculumId);
    if (!curr) return null;

    const newGroup = {
      id: groupData.id || `grp_${Date.now()}`,
      curriculumId,
      name: groupData.name || 'Nhóm học phần mới',
      code: groupData.code || 'NHP',
      description: groupData.description || '',
      order: (curr.groups?.length || 0) + 1,
      color: groupData.color || '#AFC8F5',
      requiredCredits: Number(groupData.requiredCredits || 0),
      courses: groupData.courses || []
    };

    curr.groups = curr.groups || [];
    curr.groups.push(newGroup);

    // Save back to custom list
    let customs = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_CURRICULUMS);
      if (stored) customs = JSON.parse(stored);
    } catch (e) {}

    const idx = customs.findIndex(c => c.id === curriculumId);
    if (idx >= 0) {
      customs[idx] = curr;
    } else {
      customs.push(curr);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CURRICULUMS, JSON.stringify(customs));

    return newGroup;
  }
};
