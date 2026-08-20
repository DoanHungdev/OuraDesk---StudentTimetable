import { TimetableView } from './js/components/TimetableView.js';
import { Storage } from './js/utils/storage.js';
import { ProfileEngine } from './js/utils/profileEngine.js';
import { TimetableEngine } from './js/utils/timetableEngine.js';

// Mock localStorage
const store = {
  'class_schedule_mode_v2': 'university',
  'class_schedule_active_profile_v2': JSON.stringify({
    univId: 'haui',
    campusId: 'haui_hn',
    profileId: 'haui_hn_theory'
  })
};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

try {
  const courses = Storage.getCourses();
  console.log('Mode:', Storage.getMode());
  console.log('Got university courses count:', courses.length);
  console.log('First course:', JSON.stringify(courses[0], null, 2));

  console.log('Rendering TimetableView for University...');
  const html = TimetableView.render(
    courses,
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {},
    () => {}
  );
  console.log('Successfully rendered! HTML length:', html.length);
} catch (err) {
  console.error('CRASH IN TimetableView.render:', err);
}
