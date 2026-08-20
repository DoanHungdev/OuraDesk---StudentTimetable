/**
 * Class Schedule — Core Application Controller
 * "Chụp TKB. Phần còn lại để app lo."
 * Dual Mode: High School (THPT) & University
 */
import { Storage } from './utils/storage.js';
import { TimetableEngine } from './utils/timetableEngine.js';
import { ProfileEngine } from './utils/profileEngine.js';
import { OCREngine } from './utils/ocrEngine.js';
import { Toast } from './components/Toast.js';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { RightPanel } from './components/RightPanel.js';
import { BottomNav } from './components/BottomNav.js';
import { DashboardView } from './components/DashboardView.js';
import { TimetableView } from './components/TimetableView.js';
import { MobileTimetable } from './components/MobileTimetable.js';
import { MonthCalendarView } from './components/MonthCalendarView.js';
import { CoursesView } from './components/CoursesView.js';
import { AssignmentsView } from './components/AssignmentsView.js';
import { HomeworkView } from './components/HomeworkView.js';
import { ExamsView } from './components/ExamsView.js';
import { StatisticsView } from './components/StatisticsView.js';
import { SettingsView } from './components/SettingsView.js';
import { CourseModal } from './components/CourseModal.js';
import { AutoSchedulerModal } from './components/AutoSchedulerModal.js';
import { ConflictModal } from './components/ConflictModal.js';
import { SearchModal } from './components/SearchModal.js';
import { TaskModal } from './components/TaskModal.js';
import { UniversityProfileModal } from './components/UniversityProfileModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { ImportModal } from './components/ImportModal.js';
import { ConfidenceReviewModal } from './components/ConfidenceReviewModal.js';
import { ClassCodeShareModal } from './components/ClassCodeShareModal.js';
import { Grade12TargetModal } from './components/Grade12TargetModal.js';
import { WallpaperModal } from './components/WallpaperModal.js';
import { ExamModal } from './components/ExamModal.js';
import { AddScheduleMenuModal } from './components/AddScheduleMenuModal.js';
import { ManualScheduleModal } from './components/ManualScheduleModal.js';
import { AvatarModal } from './components/AvatarModal.js';
import { CurriculumImportModal } from './components/CurriculumImportModal.js';
import { CustomCourseGroupModal } from './components/CustomCourseGroupModal.js';
import { CourseDetailDrawer } from './components/CourseDetailDrawer.js';
import { ThemeEngine } from './theme/themeEngine.js';
import { CalendarEngine } from './utils/calendarEngine.js';
import { AssignmentRepository } from './repositories/assignmentRepository.js';
import { HomeworkRepository } from './repositories/homeworkRepository.js';

class App {
  constructor() {
    ThemeEngine.init();
    this.mode = Storage.getMode(); // 'high_school' | 'university'
    this.courses = Storage.getCourses();
    this.coursesHistory = [];
    this.user = Storage.getUser();
    this.homework = HomeworkRepository.getAll();
    this.exams = Storage.getExams();
    this.assignments = AssignmentRepository.getAll();
    this.activeView = 'dashboard';
    this.isMobile = window.innerWidth < 768;

    this.init();
  }

  init() {
    Toast.init();
    this.initModals();
    this.renderLayout();
    this.setupResizeListener();
    this.setupTimeTicker();

    // Check first-run onboarding
    if (!Storage.hasOnboarded()) {
      setTimeout(() => {
        OnboardingModal.openOnboarding();
      }, 300);
    }
  }

  initModals() {
    // 1. Onboarding Modal
    OnboardingModal.init({
      onComplete: ({ mode, openMethod }) => {
        this.mode = mode;
        this.courses = Storage.getCourses();
        this.user = Storage.getUser();
        this.homework = Storage.getHomework();
        this.exams = Storage.getExams();
        this.render();

        if (openMethod) {
          setTimeout(() => {
            ImportModal.openImport(openMethod);
          }, 300);
        } else {
          Toast.show(`Chào mừng bạn đến với Class Schedule (${mode === 'high_school' ? 'THPT' : 'Đại học'})! 🎉`, 'success');
        }
      }
    });

    // 2. Import Modal
    ImportModal.init({
      onParsed: (ocrResult) => {
        ConfidenceReviewModal.openReview(ocrResult);
      },
      onShareCodeImported: (res) => {
        this.courses = res.courses;
        Storage.saveCourses(this.courses, true, `Nhập từ mã lớp ${res.code}`);
        Toast.show(`Đã nhập thành công TKB lớp ${res.className} (${res.school})! 🎉`, 'success');
        this.saveAndReRender();
      }
    });

    // 3. Confidence Review Modal
    ConfidenceReviewModal.init({
      onConfirmed: (newCourses, className) => {
        this.courses = newCourses;
        this.user.className = className;
        Storage.saveUser(this.user);
        Storage.saveCourses(this.courses, true, `Nhập TKB qua AI OCR cho lớp ${className}`);
        Toast.show(`Đã xác nhận & tạo TKB thành công cho lớp ${className}! 🚀`, 'success');
        this.saveAndReRender();
        this.navigate('timetable');
      }
    });

    // 4. Class Code Share Modal
    ClassCodeShareModal.init({});

    // 5. Grade 12 Target Modal
    Grade12TargetModal.init({});

    // 6. Wallpaper Modal
    WallpaperModal.init({});

    // 7. University Profile Modal
    UniversityProfileModal.init({
      onProfileChanged: () => {
        const { university, profile } = ProfileEngine.getActiveProfileState();
        this.user.university = `${university.name} (${university.shortName})`;
        Storage.saveUser(this.user);
        Toast.show(`Đã chuyển sang khung giờ ${profile.name} (${university.shortName})! 🏛️`, 'success');
        this.render();
      }
    });

    // 8. Add Schedule Action Menu Modal
    AddScheduleMenuModal.init({
      onManualEntry: () => ManualScheduleModal.openModal(this.courses),
      onAIPhoto: () => ImportModal.openImport('photo'),
      onFileImport: () => ImportModal.openImport('pdf'),
      onAutoSchedule: () => AutoSchedulerModal.openModal(this.courses)
    });

    // 9. Manual Schedule Modal
    ManualScheduleModal.init({
      onSaveCourse: (savedCourse, isEdit) => {
        this.pushCoursesHistory();
        if (isEdit) {
          this.courses = this.courses.map(c => c.id === savedCourse.id ? savedCourse : c);
          Toast.showWithAction(`Đã cập nhật môn "${savedCourse.name}"`, 'success', 'Hoàn tác', () => this.undoLastAction());
        } else {
          this.courses.push(savedCourse);
          Toast.showWithAction(`Đã thêm môn "${savedCourse.name}" vào TKB! ✍️`, 'success', 'Hoàn tác', () => this.undoLastAction());
        }
        this.saveAndReRender();
      },
      onBatchSave: (newCourses) => {
        this.pushCoursesHistory();
        newCourses.forEach(nc => {
          const existing = this.courses.find(c => c.id === nc.id || c.name.toLowerCase() === nc.name.toLowerCase());
          if (existing) {
            if (!existing.schedules) existing.schedules = [];
            existing.schedules.push(...(nc.schedules || []));
          } else {
            this.courses.push(nc);
          }
        });
        Toast.showWithAction(`Đã thêm ${newCourses.length} môn học từ cú pháp nhanh! ⚡`, 'success', 'Hoàn tác', () => this.undoLastAction());
        this.saveAndReRender();
      }
    });

    // 10. Course Modal
    CourseModal.init({
      onSave: (savedCourse, isEdit) => {
        this.pushCoursesHistory();
        if (isEdit) {
          this.courses = this.courses.map(c => c.id === savedCourse.id ? savedCourse : c);
          Toast.showWithAction(`Đã cập nhật môn "${savedCourse.name}"`, 'success', 'Hoàn tác', () => this.undoLastAction());
        } else {
          this.courses.push(savedCourse);
          Toast.showWithAction(`Đã thêm môn "${savedCourse.name}"`, 'success', 'Hoàn tác', () => this.undoLastAction());
        }
        this.saveAndReRender();
      }
    });

    // 9. Auto-Scheduler Modal
    AutoSchedulerModal.init({
      onApply: (newCourses) => {
        this.courses = newCourses;
        Toast.show('Đã áp dụng thời khóa biểu mới thành công! 🎉', 'success');
        this.saveAndReRender();
      }
    });

    // 10. Conflict Modal
    ConflictModal.init({
      onResolve: (courseId, scheduleId, suggestedSlot) => {
        this.courses = this.courses.map(course => {
          if (course.id === courseId) {
            const updatedSchedules = (course.schedules || []).map(sch => {
              if (sch.id === scheduleId) {
                return {
                  ...sch,
                  day: suggestedSlot.day,
                  startPeriod: suggestedSlot.startPeriod || sch.startPeriod,
                  endPeriod: suggestedSlot.endPeriod || sch.endPeriod,
                  startTime: suggestedSlot.startTime,
                  endTime: suggestedSlot.endTime,
                  sessions: TimetableEngine.calculateSessions(suggestedSlot.startTime, suggestedSlot.endTime)
                };
              }
              return sch;
            });
            return { ...course, schedules: updatedSchedules };
          }
          return course;
        });
        Toast.show('Đã giải quyết xung đột lịch học!', 'success');
        this.saveAndReRender();
      }
    });

    // 11. Search Modal
    SearchModal.init({
      onSelectCourse: (course) => {
        this.openCourseDetails(course);
      }
    });

    // 12. Task Modal
    TaskModal.init({
      onSave: (savedTask, isEdit) => {
        if (isEdit) {
          AssignmentRepository.update(savedTask.id, savedTask);
          this.assignments = AssignmentRepository.getAll();
          Toast.show(`Đã lưu bài tập "${savedTask.title}"`, 'success');
        } else {
          AssignmentRepository.create(savedTask);
          this.assignments = AssignmentRepository.getAll();
          Toast.show(`Đã thêm deadline mới`, 'success');
        }
        this.saveAndReRender();
      }
    });

    // 13. Exam Modal
    ExamModal.init({
      onSave: (savedExam, isEdit) => {
        if (isEdit) {
          this.exams = this.exams.map(e => e.id === savedExam.id ? savedExam : e);
          Toast.show(`Đã cập nhật lịch thi môn "${savedExam.subject}"! 📝`, 'success');
        } else {
          this.exams.push(savedExam);
          Toast.show(`Đã thêm lịch kiểm tra môn "${savedExam.subject}"! 📅`, 'success');
        }
        Storage.saveExams(this.exams);
        this.saveAndReRender();
      },
      onDelete: (examId) => {
        this.exams = this.exams.filter(e => e.id !== examId);
        Storage.saveExams(this.exams);
        Toast.show('Đã xóa lịch thi thành công!', 'info');
        this.saveAndReRender();
      }
    });

    // 14. Avatar Modal
    AvatarModal.init({
      onAvatarSaved: (updatedUser) => {
        this.user = updatedUser;
        Toast.show('Đã cập nhật ảnh đại diện thành công! ✨', 'success');
        this.saveAndReRender();
      }
    });

    // 15. Curriculum Import Modal
    CurriculumImportModal.init({
      onCurriculumImported: () => {
        this.saveAndReRender();
      }
    });

    // 16. Custom Course Group Modal
    CustomCourseGroupModal.init({
      onGroupAdded: () => {
        this.saveAndReRender();
      }
    });

    // 17. Course Detail Drawer
    CourseDetailDrawer.init();
  }

  toggleMode() {
    const newMode = this.mode === 'high_school' ? 'university' : 'high_school';
    this.mode = newMode;
    Storage.setMode(newMode);
    this.courses = Storage.getCourses();
    this.user = Storage.getUser();
    this.homework = Storage.getHomework();
    this.exams = Storage.getExams();
    this.assignments = Storage.getAssignments();

    Toast.show(`Đã chuyển sang chế độ ${newMode === 'high_school' ? '🏫 Học sinh THPT' : '🎓 Sinh viên Đại học'}`, 'success');
    this.render();
  }

  saveAndReRender() {
    Storage.saveCourses(this.courses);
    Storage.saveUser(this.user);
    if (this.mode === 'high_school') {
      Storage.saveHomework(this.homework);
      Storage.saveExams(this.exams);
    } else {
      Storage.saveAssignments(this.assignments);
    }
    this.render();
  }

  deleteCourse(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    this.courses = this.courses.filter(c => c.id !== courseId);
    Toast.show(`Đã xóa môn "${course ? course.name : ''}"`, 'info');
    this.saveAndReRender();
  }

  renderLayout() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    appEl.innerHTML = `
      <div class="bg-ambient-wrapper">
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
        <div class="ambient-orb orb-3"></div>
        <div class="ambient-orb orb-4"></div>
      </div>

      <div class="app-container">
        <div id="sidebar-slot"></div>

        <main class="main-wrapper glass-panel">
          <div id="header-slot"></div>
          <div class="view-content-container custom-scroll" id="view-slot"></div>
        </main>

        <div id="right-panel-slot"></div>
      </div>

      <div id="bottom-nav-slot"></div>
    `;

    this.render();
  }

  render() {
    this.isMobile = window.innerWidth < 768;
    const conflicts = TimetableEngine.findConflicts(this.courses);

    // 1. Sidebar
    const sidebarSlot = document.getElementById('sidebar-slot');
    if (sidebarSlot) {
      sidebarSlot.innerHTML = Sidebar.render(this.activeView, this.user, (v) => this.navigate(v), () => this.toggleMode());
      Sidebar.bindEvents(sidebarSlot, (v) => this.navigate(v), () => this.toggleMode());
    }

    // 2. Header
    const headerSlot = document.getElementById('header-slot');
    if (headerSlot) {
      headerSlot.innerHTML = Header.render(this.activeView, this.user, conflicts.length);
      Header.bindEvents(headerSlot, {
        onImportTKB: () => AddScheduleMenuModal.openModal(),
        onExportWallpaper: () => WallpaperModal.openModal(this.courses),
        onShareClass: () => ClassCodeShareModal.openModal(this.courses),
        onSearch: () => SearchModal.openModal(this.courses, this.mode === 'high_school' ? this.homework : this.assignments)
      });
    }

    // 3. Right Panel
    const rightPanelSlot = document.getElementById('right-panel-slot');
    if (rightPanelSlot) {
      RightPanel.onReRender = () => this.render();
      rightPanelSlot.innerHTML = RightPanel.render(
        this.courses,
        this.mode === 'high_school' ? this.homework : this.assignments,
        this.user,
        (id) => this.openCourseDetails(id),
        (tId, completed) => this.toggleTask(tId, completed),
        (v) => this.navigate(v)
      );
      RightPanel.bindEvents(rightPanelSlot, {
        onSelectCourse: (id) => this.openCourseDetails(id),
        onToggleTask: (tId, completed) => this.toggleTask(tId, completed),
        onNavigate: (v) => this.navigate(v),
        onDateSelect: () => this.render()
      });
    }

    // 4. Bottom Nav
    const bottomNavSlot = document.getElementById('bottom-nav-slot');
    if (bottomNavSlot) {
      bottomNavSlot.innerHTML = BottomNav.render(this.activeView);
      BottomNav.bindEvents(bottomNavSlot, (v) => this.navigate(v));
    }

    // 5. Active View
    this.renderActiveView();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderActiveView() {
    const viewSlot = document.getElementById('view-slot');
    if (!viewSlot) return;

    viewSlot.innerHTML = '';

    try {
      switch (this.activeView) {
        case 'dashboard':
          viewSlot.innerHTML = DashboardView.render(
            this.courses,
            this.mode === 'high_school' ? this.homework : this.assignments,
            this.user,
            (id) => this.openCourseDetails(id),
            (v) => this.navigate(v),
            () => AddScheduleMenuModal.openModal(),
            () => Grade12TargetModal.openModal()
          );
          DashboardView.bindEvents(viewSlot, {
            onAddCourse: () => ManualScheduleModal.openModal(this.courses),
            onSelectCourse: (id) => this.openCourseDetails(id),
            onNavigate: (v) => this.navigate(v),
            onOpenImport: () => AddScheduleMenuModal.openModal(),
            onOpenManualEntry: () => ManualScheduleModal.openModal(this.courses),
            onOpenTarget12: () => Grade12TargetModal.openModal(),
            onToggleTask: (tId, completed) => this.toggleTask(tId, completed)
          });
          break;

        case 'timetable':
          if (this.isMobile) {
            MobileTimetable.onReRender = () => this.render();
            viewSlot.innerHTML = MobileTimetable.render(
              this.courses,
              (id) => this.openCourseDetails(id),
              (day, sp, ep) => ManualScheduleModal.openForSlot(day, sp, ep),
              () => UniversityProfileModal.openModal(),
              () => AddScheduleMenuModal.openModal()
            );
            MobileTimetable.bindEvents(viewSlot, {
              onSelectCourse: (id) => this.openCourseDetails(id),
              onAddCourse: (day, sp, ep) => ManualScheduleModal.openForSlot(day, sp, ep),
              onSwitchUniversity: () => UniversityProfileModal.openModal(),
              onOpenAddMenu: () => AddScheduleMenuModal.openModal(),
              onWeekChange: () => this.render()
            });
          } else {
            TimetableView.onReRender = () => this.render();
            viewSlot.innerHTML = TimetableView.render(
              this.courses,
              (id) => this.openCourseDetails(id),
              (day, period) => ManualScheduleModal.openForSlot(day, period),
              (cId, sId, day, start, end) => this.moveSchedule(cId, sId, day, start, end),
              () => this.openConflictResolver(),
              () => UniversityProfileModal.openModal(),
              () => AddScheduleMenuModal.openModal(),
              () => WallpaperModal.openModal(this.courses),
              () => ClassCodeShareModal.openModal(this.courses),
              (cId, sId) => this.copyScheduleToNextDay(cId, sId),
              (id) => this.deleteCourse(id)
            );
            TimetableView.bindEvents(viewSlot, {
              courses: this.courses,
              onSelectCourse: (id) => this.openCourseDetails(id),
              onSlotClick: (day, period) => ManualScheduleModal.openForSlot(day, period),
              onMoveSchedule: (cId, sId, day, start, end) => this.moveSchedule(cId, sId, day, start, end),
              onResolveConflict: () => this.openConflictResolver(),
              onSwitchUniversity: () => UniversityProfileModal.openModal(),
              onOpenAddMenu: () => AddScheduleMenuModal.openModal(),
              onExportWallpaper: () => WallpaperModal.openModal(this.courses),
              onShareClass: () => ClassCodeShareModal.openModal(this.courses),
              onCopySchedule: (cId, sId) => this.copyScheduleToNextDay(cId, sId),
              onOpenManualEntry: () => ManualScheduleModal.openModal(this.courses),
              onOpenAIImport: () => ImportModal.openImport('photo'),
              onOpenAutoSchedule: () => AutoSchedulerModal.openModal(this.courses),
              onNavigate: (v) => this.navigate(v),
              onWeekChange: () => this.render()
            });
          }
          break;

      case 'homework':
        this.homework = Storage.getHomework();
        viewSlot.innerHTML = HomeworkView.render(
          this.homework,
          this.courses,
          () => {
            const title = prompt('Nhập tên bài tập về nhà:');
            if (title) {
              const sub = prompt('Nhập tên môn học (vd: Toán, Ngữ văn, Vật lý):') || 'Toán';
              const newHw = {
                id: 'hw-' + Date.now(),
                title,
                subject: sub,
                color: '#AFC8F5',
                dueDate: '2026-08-25',
                priority: 'high',
                status: 'todo',
                notes: 'Bài tập giao về nhà'
              };
              this.homework.unshift(newHw);
              Storage.saveHomework(this.homework);
              Toast.show('Đã thêm bài tập mới!', 'success');
              this.renderActiveView();
            }
          },
          (id, newStatus) => {
            this.homework = this.homework.map(h => h.id === id ? { ...h, status: newStatus } : h);
            Storage.saveHomework(this.homework);
            Toast.show('Đã cập nhật trạng thái bài tập!', 'info');
            this.renderActiveView();
          },
          (id) => {
            this.homework = this.homework.filter(h => h.id !== id);
            Storage.saveHomework(this.homework);
            Toast.show('Đã xóa bài tập', 'info');
            this.renderActiveView();
          }
        );
        HomeworkView.bindEvents(viewSlot, {
          onAddHomework: () => {
            const title = prompt('Nhập tên bài tập:');
            if (title) {
              const sub = prompt('Tên môn học:') || 'Toán';
              this.homework.unshift({
                id: 'hw-' + Date.now(),
                title,
                subject: sub,
                color: '#AFC8F5',
                dueDate: '2026-08-26',
                priority: 'medium',
                status: 'todo'
              });
              Storage.saveHomework(this.homework);
              this.renderActiveView();
            }
          },
          onUpdateStatus: (id, newStatus) => {
            this.homework = this.homework.map(h => h.id === id ? { ...h, status: newStatus } : h);
            Storage.saveHomework(this.homework);
            this.renderActiveView();
          },
          onDeleteHomework: (id) => {
            this.homework = this.homework.filter(h => h.id !== id);
            Storage.saveHomework(this.homework);
            this.renderActiveView();
          }
        });
        break;

      case 'exams':
        this.exams = Storage.getExams();
        viewSlot.innerHTML = ExamsView.render(
          this.exams,
          () => ExamModal.openAdd(this.courses),
          (id) => {
            const ex = this.exams.find(e => e.id === id);
            if (ex) ExamModal.openEdit(ex, this.courses);
          },
          (id) => {
            if (confirm('Bạn có chắc chắn muốn xóa lịch thi này không?')) {
              this.exams = this.exams.filter(e => e.id !== id);
              Storage.saveExams(this.exams);
              Toast.show('Đã xóa lịch thi!', 'info');
              this.renderActiveView();
            }
          }
        );
        ExamsView.bindEvents(viewSlot, {
          onAddExam: () => ExamModal.openAdd(this.courses),
          onEditExam: (id) => {
            const ex = this.exams.find(e => e.id === id);
            if (ex) ExamModal.openEdit(ex, this.courses);
          },
          onDeleteExam: (id) => {
            if (confirm('Bạn có chắc chắn muốn xóa lịch thi này không?')) {
              this.exams = this.exams.filter(e => e.id !== id);
              Storage.saveExams(this.exams);
              Toast.show('Đã xóa lịch thi!', 'info');
              this.renderActiveView();
            }
          }
        });
        break;

      case 'target12':
        Grade12TargetModal.openModal();
        this.activeView = 'dashboard';
        this.renderActiveView();
        break;

      case 'courses':
        CoursesView.onReRender = () => this.renderActiveView();
        viewSlot.innerHTML = CoursesView.render(
          this.courses,
          () => CourseModal.openAdd(1, 1, 3),
          (id) => {
            const course = this.courses.find(c => c.id === id);
            if (course) CourseModal.openEdit(course);
          },
          (id) => this.deleteCourse(id),
          (id) => {
            const course = this.courses.find(c => c.id === id);
            if (course) {
              const dup = JSON.parse(JSON.stringify(course));
              dup.id = 'crs-' + Date.now();
              dup.name = `${course.name} (Bản sao)`;
              this.courses.push(dup);
              Toast.show(`Đã nhân bản "${course.name}"`, 'success');
              this.saveAndReRender();
            }
          },
          (id) => this.openCourseDetails(id)
        );
        CoursesView.bindEvents(viewSlot, {
          onAddCourse: () => CourseModal.openAdd(1, 1, 3),
          onEditCourse: (id) => {
            const course = this.courses.find(c => c.id === id);
            if (course) CourseModal.openEdit(course);
          },
          onDeleteCourse: (id) => this.deleteCourse(id),
          onDuplicateCourse: (id) => {
            const course = this.courses.find(c => c.id === id);
            if (course) {
              const dup = JSON.parse(JSON.stringify(course));
              dup.id = 'crs-' + Date.now();
              dup.name = `${course.name} (Bản sao)`;
              this.courses.push(dup);
              Toast.show(`Đã nhân bản "${course.name}"`, 'success');
              this.saveAndReRender();
            }
          },
          onViewDetails: (id) => this.openCourseDetails(id)
        });
        break;

      case 'assignments':
        AssignmentsView.onReRender = () => this.renderActiveView();
        viewSlot.innerHTML = AssignmentsView.render(
          this.assignments,
          this.courses,
          () => TaskModal.openAdd(this.courses),
          (tId, comp) => this.toggleTask(tId, comp),
          (tId) => {
            const t = this.assignments.find(a => a.id === tId);
            if (t) TaskModal.openEdit(t, this.courses);
          },
          (tId) => {
            AssignmentRepository.delete(tId);
            this.assignments = AssignmentRepository.getAll();
            Toast.show('Đã xóa bài tập', 'info');
            this.saveAndReRender();
          }
        );
        AssignmentsView.bindEvents(viewSlot, {
          onAddTask: () => TaskModal.openAdd(this.courses),
          onToggleTask: (tId, comp) => this.toggleTask(tId, comp),
          onEditTask: (tId) => {
            const t = this.assignments.find(a => a.id === tId);
            if (t) TaskModal.openEdit(t, this.courses);
          },
          onDeleteTask: (tId) => {
            AssignmentRepository.delete(tId);
            this.assignments = AssignmentRepository.getAll();
            Toast.show('Đã xóa bài tập', 'info');
            this.saveAndReRender();
          }
        });
        break;

      case 'statistics':
        viewSlot.innerHTML = StatisticsView.render(this.courses, this.mode === 'high_school' ? this.homework : this.assignments, this.user);
        StatisticsView.bindEvents(viewSlot);
        break;

      case 'settings':
        SettingsView.onReRender = () => this.renderActiveView();
        viewSlot.innerHTML = SettingsView.render(
          this.user,
          this.courses,
          this.mode === 'high_school' ? this.homework : this.assignments,
          (updatedUser) => {
            this.user = updatedUser;
            Toast.show('Đã lưu thông tin học sinh!', 'success');
            this.saveAndReRender();
          },
          () => {
            Storage.resetToDefault();
            this.courses = Storage.getCourses();
            this.user = Storage.getUser();
            this.homework = Storage.getHomework();
            this.exams = Storage.getExams();
            Toast.show('Đã khôi phục dữ liệu gốc!', 'info');
            this.render();
          },
          () => UniversityProfileModal.openModal(),
          () => this.toggleMode(),
          () => WallpaperModal.openModal(this.courses),
          () => ImportModal.openImport('photo')
        );
        SettingsView.bindEvents(viewSlot, {
          user: this.user,
          courses: this.courses,
          homeworkOrAsg: this.mode === 'high_school' ? this.homework : this.assignments,
          onSaveUser: (updatedUser) => {
            this.user = updatedUser;
            Storage.saveUser(this.user);
            Toast.show('Đã lưu thông tin người dùng! ✨', 'success');
            this.saveAndReRender();
          },
          onResetData: () => {
            Storage.resetToDefault();
            this.courses = Storage.getCourses();
            this.user = Storage.getUser();
            Toast.show('Đã khôi phục dữ liệu!', 'info');
            this.render();
          },
          onOpenUnivModal: () => UniversityProfileModal.openModal(),
          onSwitchMode: () => this.toggleMode(),
          onExportWallpaper: () => WallpaperModal.openModal(this.courses),
          onOpenImport: () => ImportModal.openImport('photo'),
          onThemeChanged: (themeId) => {
            const current = ThemeEngine.getCurrentTheme();
            Toast.show(`Đã chuyển sang giao diện ${current.emoji} ${current.name}!`, 'success');
            this.render();
          }
        });
        break;

      default:
        this.activeView = 'dashboard';
        this.renderActiveView();
        break;
    }
  } catch (err) {
    console.error('Lỗi khi render view:', this.activeView, err);
    viewSlot.innerHTML = `
      <div style="background: var(--color-card-background); border-radius: var(--radius-lg); padding: 32px 24px; text-align: center; border: 1px dashed var(--color-border); margin-top: 20px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #FEF2F2; color: #EF4444; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
          <i data-lucide="alert-triangle" style="width: 24px; height: 24px;"></i>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-text);">Đã có sự cố khi tải trang</h3>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 4px;">${err.message || 'Vui lòng thử tải lại hoặc đổi chế độ'}</p>
        <button id="btn-err-reload" class="glass-button glass-button-primary" style="margin-top: 16px; padding: 8px 20px; font-weight: 700;">
          Tải lại giao diện
        </button>
      </div>
    `;
    viewSlot.querySelector('#btn-err-reload')?.addEventListener('click', () => {
      this.render();
    });
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

  navigate(viewId) {
    this.activeView = viewId;
    this.render();
  }

  openCourseDetails(courseOrId) {
    const course = typeof courseOrId === 'object' ? courseOrId : this.courses.find(c => c.id === courseOrId);
    if (!course) return;

    CourseDetailDrawer.openDrawer(
      course,
      (c) => CourseModal.openEdit(c),
      (id) => this.deleteCourse(id),
      (c) => CourseModal.openEdit(c)
    );
  }

  pushCoursesHistory() {
    if (!this.coursesHistory) this.coursesHistory = [];
    this.coursesHistory.push(JSON.parse(JSON.stringify(this.courses)));
    if (this.coursesHistory.length > 20) this.coursesHistory.shift();
  }

  undoLastAction() {
    if (!this.coursesHistory || this.coursesHistory.length === 0) {
      Toast.show('Không có thao tác nào để hoàn tác!', 'info');
      return;
    }
    const prev = this.coursesHistory.pop();
    this.courses = prev;
    Storage.saveCourses(this.courses, true, 'Hoàn tác thao tác');
    Toast.show('Đã hoàn tác thao tác vừa rồi! ↩️', 'info');
    this.saveAndReRender();
  }

  deleteCourse(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    if (confirm(`Bạn có chắc chắn muốn xóa môn "${course.name}" khỏi thời khóa biểu?`)) {
      this.pushCoursesHistory();
      this.courses = this.courses.filter(c => c.id !== courseId);
      Storage.saveCourses(this.courses, true, `Xóa môn ${course.name}`);
      Toast.showWithAction(`Đã xóa môn "${course.name}"`, 'info', 'Hoàn tác', () => this.undoLastAction());
      this.saveAndReRender();
    }
  }

  copyScheduleToNextDay(courseId, scheduleId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    const sch = (course.schedules || []).find(s => s.id === scheduleId);
    if (!sch) return;

    const nextDay = (sch.day + 1) % 7;
    const clonedSchedule = {
      ...sch,
      id: 'sch-' + Date.now(),
      day: nextDay,
      source: 'manual'
    };

    this.pushCoursesHistory();
    this.courses = this.courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          schedules: [...(c.schedules || []), clonedSchedule]
        };
      }
      return c;
    });

    const dayLabels = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    Toast.showWithAction(`Đã sao chép tiết môn "${course.name}" sang ${dayLabels[nextDay]}!`, 'success', 'Hoàn tác', () => this.undoLastAction());
    this.saveAndReRender();
  }

  openConflictResolver() {
    const conflicts = TimetableEngine.findConflicts(this.courses);
    if (conflicts.length > 0) {
      ConflictModal.openConflict(conflicts[0], this.courses);
    } else {
      Toast.show('Không có xung đột nào trong thời khóa biểu!', 'success');
    }
  }

  openManualSchedule() {
    ManualScheduleModal.openModal(this.courses);
  }

  openAddCourseModal() {
    CourseModal.openAdd();
  }

  saveAndReRender() {
    Storage.saveCourses(this.courses);
    if (this.user) Storage.saveUser(this.user);
    this.render();
  }

  moveSchedule(courseId, scheduleId, newDay, newStart, newEnd) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    this.pushCoursesHistory();

    const newSessions = TimetableEngine.calculateSessions(newStart, newEnd);
    const activeState = ProfileEngine.getActiveProfileState();
    const periodsRange = ProfileEngine.findPeriodsFromTimeRange(activeState.profileId, newStart, newEnd);

    this.courses = this.courses.map(c => {
      if (c.id === courseId) {
        const updatedSchedules = (c.schedules || []).map(sch => {
          if (sch.id === scheduleId) {
            return {
              ...sch,
              day: newDay,
              startPeriod: periodsRange.startPeriod,
              endPeriod: periodsRange.endPeriod,
              startTime: newStart,
              endTime: newEnd,
              sessions: newSessions
            };
          }
          return sch;
        });
        return { ...c, schedules: updatedSchedules };
      }
      return c;
    });

    const conflicts = TimetableEngine.findConflicts(this.courses);
    if (conflicts.length > 0) {
      Toast.showWithAction(`Đã dời sang ${newStart} nhưng có xung đột lịch học!`, 'warning', 'Hoàn tác', () => this.undoLastAction());
    } else {
      Toast.showWithAction(`Đã cập nhật lịch môn "${course.name}" sang ${newStart} – ${newEnd}`, 'success', 'Hoàn tác', () => this.undoLastAction());
    }

    this.saveAndReRender();
  }

  toggleTask(taskId, completed) {
    if (this.mode === 'high_school') {
      HomeworkRepository.toggleComplete(taskId, completed);
      this.homework = HomeworkRepository.getAll();
    } else {
      AssignmentRepository.toggleComplete(taskId, completed);
      this.assignments = AssignmentRepository.getAll();
    }
    if (completed) {
      Toast.show('Đã hoàn thành một bài tập! 🎉', 'success');
    }
    this.saveAndReRender();
  }

  setupResizeListener() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        if (wasMobile !== this.isMobile) {
          this.render();
        }
      }, 150);
    });
  }

  setupTimeTicker() {
    setInterval(() => {
      if (this.activeView === 'dashboard' || this.activeView === 'timetable') {
        this.renderActiveView();
      }
    }, 60000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const instance = new App();
  window.classScheduleApp = instance;
  window.app = instance;
});
