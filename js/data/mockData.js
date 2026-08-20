/**
 * Mock Data for Class Schedule (University Mode)
 * University Time Profile Integrated
 */

export const INITIAL_CATEGORIES = [
  { id: 'grp_haui_gdc', name: 'Giáo dục đại cương', color: '#AFC8F5', darkColor: '#3B82F6', icon: 'book-open' },
  { id: 'grp_haui_csn', name: 'Cơ sở ngành', color: '#A9DED5', darkColor: '#059669', icon: 'cpu' },
  { id: 'grp_haui_cn', name: 'Chuyên ngành', color: '#F5B28D', darkColor: '#EA580C', icon: 'settings' },
  { id: 'grp_haui_gdtc', name: 'Giáo dục thể chất', color: '#F4B5C2', darkColor: '#DB2777', icon: 'activity' }
];

export const INITIAL_COURSES = [
  {
    id: 'crs-1',
    universityId: 'haui',
    campusId: 'haui_hn',
    profileId: 'haui_hn_theory',
    curriculumId: 'curriculum_haui_ce_k20',
    courseGroupId: 'grp_haui_gdc',
    courseGroupName: 'Giáo dục đại cương',
    name: 'Toán cao cấp',
    code: 'MAT101',
    credits: 3,
    totalHours: 45,
    hoursPerWeek: 3,
    type: 'theory',
    teacher: 'ThS. Nguyễn Văn An',
    teacherEmail: 'an.nguyen@haui.edu.vn',
    room: 'Phòng A203',
    color: '#AFC8F5',
    category: 'grp_haui_gdc',
    startDate: '2026-08-03',
    calculatedEndDate: '30/11/2026',
    calculatedEndDateIso: '2026-11-30',
    endDateMode: 'auto',
    totalWeeks: 15,
    totalSessions: 15,
    schedules: [
      {
        id: 'sch-1',
        day: 1, // Thứ 2
        startPeriod: 1,
        endPeriod: 3,
        startTime: '07:00',
        endTime: '09:40',
        sessions: 3,
        room: 'Phòng A203',
        teacher: 'ThS. Nguyễn Văn An',
        type: 'theory'
      }
    ],
    notes: 'Mang theo máy tính Casio và giáo trình Giải tích 1 chương tích phân.'
  },
  {
    id: 'crs-2',
    universityId: 'haui',
    campusId: 'haui_hn',
    profileId: 'haui_hn_theory',
    curriculumId: 'curriculum_haui_ce_k20',
    courseGroupId: 'grp_haui_gdc',
    courseGroupName: 'Giáo dục đại cương',
    name: 'Vật lý đại cương',
    code: 'PHY101',
    credits: 3,
    totalHours: 45,
    hoursPerWeek: 3,
    type: 'theory',
    teacher: 'TS. Lê Hoàng Nam',
    teacherEmail: 'nam.le@haui.edu.vn',
    room: 'Phòng B104',
    color: '#AFC8F5',
    category: 'grp_haui_gdc',
    startDate: '2026-08-03',
    calculatedEndDate: '30/11/2026',
    calculatedEndDateIso: '2026-11-30',
    endDateMode: 'auto',
    totalWeeks: 15,
    totalSessions: 15,
    schedules: [
      {
        id: 'sch-2',
        day: 2, // Thứ 3
        startPeriod: 7,
        endPeriod: 9,
        startTime: '12:30',
        endTime: '15:10',
        sessions: 3,
        room: 'Phòng B104',
        teacher: 'TS. Lê Hoàng Nam',
        type: 'theory'
      }
    ],
    notes: 'Chương Cơ học lượng tử và Thuyết tương đối hẹp.'
  },
  {
    id: 'crs-3',
    universityId: 'haui',
    campusId: 'haui_hn',
    profileId: 'haui_hn_theory',
    curriculumId: 'curriculum_haui_ce_k20',
    courseGroupId: 'grp_haui_csn',
    courseGroupName: 'Cơ sở ngành',
    name: 'Kỹ thuật lập trình C++',
    code: 'CSE201',
    credits: 4,
    totalHours: 60,
    hoursPerWeek: 4,
    type: 'theory',
    teacher: 'TS. Trần Thị Mai',
    teacherEmail: 'mai.tran@haui.edu.vn',
    room: 'Lab CNTT 3',
    color: '#A9DED5',
    category: 'grp_haui_csn',
    startDate: '2026-08-03',
    calculatedEndDate: '30/11/2026',
    calculatedEndDateIso: '2026-11-30',
    endDateMode: 'auto',
    totalWeeks: 15,
    totalSessions: 15,
    schedules: [
      {
        id: 'sch-3',
        day: 3, // Thứ 4
        startPeriod: 1,
        endPeriod: 3,
        startTime: '07:00',
        endTime: '09:40',
        sessions: 3,
        room: 'Lab CNTT 3',
        teacher: 'TS. Trần Thị Mai',
        type: 'theory'
      }
    ],
    notes: 'Thực hành con trỏ, OOP và Template trong C++.'
  },
  {
    id: 'crs-4',
    universityId: 'haui',
    campusId: 'haui_hn',
    profileId: 'haui_hn_theory',
    curriculumId: 'curriculum_haui_ce_k20',
    courseGroupId: 'grp_haui_gdc',
    courseGroupName: 'Giáo dục đại cương',
    name: 'Tiếng Anh chuyên ngành',
    code: 'ENG202',
    credits: 3,
    totalHours: 45,
    hoursPerWeek: 3,
    type: 'theory',
    teacher: 'ThS. Hoàng Minh Đức',
    teacherEmail: 'duc.hoang@haui.edu.vn',
    room: 'Phòng C302',
    color: '#AFC8F5',
    category: 'grp_haui_gdc',
    startDate: '2026-08-03',
    calculatedEndDate: '30/11/2026',
    calculatedEndDateIso: '2026-11-30',
    endDateMode: 'auto',
    totalWeeks: 15,
    totalSessions: 15,
    schedules: [
      {
        id: 'sch-4',
        day: 4, // Thứ 5
        startPeriod: 4,
        endPeriod: 5,
        startTime: '09:50',
        endTime: '11:30',
        sessions: 2,
        room: 'Phòng C302',
        teacher: 'ThS. Hoàng Minh Đức',
        type: 'theory'
      }
    ],
    notes: 'Chuẩn bị bài thuyết trình thuật ngữ IT và Cloud Computing.'
  },
  {
    id: 'crs-5',
    universityId: 'haui',
    campusId: 'haui_hn',
    profileId: 'haui_hn_theory',
    curriculumId: 'curriculum_haui_ce_k20',
    courseGroupId: 'grp_haui_gdtc',
    courseGroupName: 'Giáo dục thể chất',
    name: 'Giáo dục thể chất 1',
    code: 'PHE101',
    credits: 2,
    totalHours: 30,
    hoursPerWeek: 2,
    type: 'practical',
    teacher: 'Thầy Phạm Quốc Bảo',
    teacherEmail: 'bao.pham@haui.edu.vn',
    room: 'Nhà thi đấu Đa năng',
    color: '#F4B5C2',
    category: 'grp_haui_gdtc',
    startDate: '2026-08-03',
    calculatedEndDate: '30/11/2026',
    calculatedEndDateIso: '2026-11-30',
    endDateMode: 'auto',
    totalWeeks: 15,
    totalSessions: 15,
    schedules: [
      {
        id: 'sch-5',
        day: 5, // Thứ 6
        startPeriod: 7,
        endPeriod: 8,
        startTime: '12:30',
        endTime: '14:10',
        sessions: 2,
        room: 'Nhà thi đấu Đa năng',
        teacher: 'Thầy Phạm Quốc Bảo',
        type: 'practical'
      }
    ],
    notes: 'Đi giày thể thao đế mềm, trang phục đúng quy định.'
  },
  {
    id: 'crs-6',
    universityId: 'haui',
    campusId: 'haui_hn',
    profileId: 'haui_hn_theory',
    curriculumId: 'curriculum_haui_ce_k20',
    courseGroupId: 'grp_haui_cn',
    courseGroupName: 'Chuyên ngành',
    name: 'Kiến trúc máy tính & Hợp ngữ',
    code: 'CE301',
    credits: 3,
    totalHours: 45,
    hoursPerWeek: 3,
    type: 'theory',
    teacher: 'TS. Vũ Đình Trọng',
    teacherEmail: 'trong.vu@haui.edu.vn',
    room: 'Phòng A305',
    color: '#F5B28D',
    category: 'grp_haui_cn',
    startDate: '2026-08-03',
    calculatedEndDate: '30/11/2026',
    calculatedEndDateIso: '2026-11-30',
    endDateMode: 'auto',
    totalWeeks: 15,
    totalSessions: 15,
    schedules: [
      {
        id: 'sch-6',
        day: 6, // Thứ 7
        startPeriod: 1,
        endPeriod: 3,
        startTime: '07:00',
        endTime: '09:40',
        sessions: 3,
        room: 'Phòng A305',
        teacher: 'TS. Vũ Đình Trọng',
        type: 'theory'
      }
    ],
    notes: 'Tập lệnh MIPS, ALU và cấu trúc vi xử lý.'
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    courseId: 'crs-3',
    title: 'Bài tập lớn: Xây dựng hệ thống quản lý sinh viên C++',
    courseName: 'Kỹ thuật lập trình C++',
    courseCode: 'CSE201',
    color: '#A9DED5',
    dueDate: '2026-08-25',
    priority: 'high',
    completed: false,
    notes: 'Nộp file nén mã nguồn qua hệ thống LMS trước 23:59.'
  },
  {
    id: 'asg-2',
    courseId: 'crs-2',
    title: 'Báo cáo thí nghiệm: Đo gia tốc trọng trường g',
    courseName: 'Vật lý đại cương',
    courseCode: 'PHY101',
    color: '#AFC8F5',
    dueDate: '2026-08-27',
    priority: 'medium',
    completed: false,
    notes: 'Vẽ đồ thị sai số thực nghiệm bằng Excel hoặc Python.'
  },
  {
    id: 'asg-3',
    courseId: 'crs-1',
    title: 'Bài tập tuần 3: Tích phân suy rộng loại 1 & 2',
    courseName: 'Toán cao cấp',
    courseCode: 'MAT101',
    color: '#AFC8F5',
    dueDate: '2026-08-22',
    priority: 'low',
    completed: true,
    notes: 'Làm bài 12 đến 25 trang 84 sách bài tập.'
  },
  {
    id: 'asg-4',
    courseId: 'crs-4',
    title: 'Slide thuyết trình: Cloud Computing Trends',
    courseName: 'Tiếng Anh chuyên ngành',
    courseCode: 'ENG202',
    color: '#AFC8F5',
    dueDate: '2026-08-29',
    priority: 'high',
    completed: false,
    notes: 'Thuyết trình nhóm 10 phút trước lớp bằng tiếng Anh.'
  }
];

export const INITIAL_USER = {
  id: 'usr_univ_demo',
  name: 'Nguyễn Doãn Tuấn Hưng',
  studentId: '2025601062',
  university: 'Đại học Công nghiệp Hà Nội',
  universityId: 'haui',
  schoolShort: 'HaUI',
  campus: 'Cơ sở 1, 2 - Hà Nội',
  campusId: 'haui_hn',
  major: 'Kỹ thuật máy tính',
  majorId: 'haui_ce',
  cohort: '20',
  faculty: 'Khoa Công nghệ Thông tin',
  curriculumId: 'curriculum_haui_ce_k20',
  curriculumName: 'HaUI Kỹ thuật máy tính – Khóa 20 (2026–2027)',
  semester: 'Học kỳ 1 (2026 - 2027)',
  academicYear: '2026–2027',
  avatar: 'TH',
  targetCredits: 18,
  mode: 'university'
};

export const DAY_NAMES = [
  { day: 1, name: 'Thứ Hai', shortName: 'T2', en: 'Monday' },
  { day: 2, name: 'Thứ Ba', shortName: 'T3', en: 'Tuesday' },
  { day: 3, name: 'Thứ Tư', shortName: 'T4', en: 'Wednesday' },
  { day: 4, name: 'Thứ Năm', shortName: 'T5', en: 'Thursday' },
  { day: 5, name: 'Thứ Sáu', shortName: 'T6', en: 'Friday' },
  { day: 6, name: 'Thứ Bảy', shortName: 'T7', en: 'Saturday' },
  { day: 0, name: 'Chủ Nhật', shortName: 'CN', en: 'Sunday' }
];

export const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];
