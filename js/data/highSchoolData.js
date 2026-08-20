/**
 * High School (THPT) Data Catalog & Configurations
 * Standard Vietnamese High School Curriculum (Grades 10, 11, 12)
 */

export const PRESET_HIGH_SCHOOLS = [
  {
    id: 'thpt_donganh',
    name: 'THPT Đông Anh',
    shortName: 'THPT Đông Anh',
    grades: [10, 11, 12],
    classes: ['10A1', '10A2', '11A1', '11A2', '11A3', '12A1', '12A2', '12A3'],
    campuses: [{ id: 'main', name: 'Cơ sở chính (Đông Anh, Hà Nội)' }]
  },
  {
    id: 'thpt_thanglong',
    name: 'Trường THPT Thăng Long (Hà Nội)',
    shortName: 'THPT Thăng Long',
    grades: [10, 11, 12],
    classes: ['10A1', '10A2', '10D1', '11A1', '11A2', '11D1', '12A1', '12A2', '12A3', '12D1', '12D2'],
    campuses: [{ id: 'main', name: 'Cơ sở Tạ Quang Bửu, Hai Bà Trưng' }]
  },
  {
    id: 'thpt_chuvanan',
    name: 'Trường THPT Chu Văn An (Hà Nội)',
    shortName: 'THPT Chu Văn An',
    grades: [10, 11, 12],
    classes: ['10 Toán', '10 Văn', '11 Tin', '11 Anh', '12 Toán', '12 Lý', '12A1', '12A2'],
    campuses: [{ id: 'main', name: 'Cơ sở Thụy Khuê, Tây Hồ' }]
  },
  {
    id: 'thpt_ams',
    name: 'Trường THPT Chuyên Hà Nội - Amsterdam',
    shortName: 'Chuyên Hà Nội - Amsterdam',
    grades: [10, 11, 12],
    classes: ['10 Toán 1', '10 Tin', '11 Lý 1', '11 Hóa 1', '12 Toán 1', '12 Anh 1'],
    campuses: [{ id: 'main', name: 'Cơ sở Hoàng Minh Giám, Cầu Giấy' }]
  },
  {
    id: 'thpt_custom',
    name: 'Trường THPT Tùy chỉnh (Khác)',
    shortName: 'THPT Tùy chỉnh',
    grades: [10, 11, 12],
    classes: ['11A2', '12A1', '12A2', '12A3', '11A1', '10A1'],
    campuses: [{ id: 'main', name: 'Cơ sở Trường' }]
  }
];

export const HIGH_SCHOOL_TIME_PROFILE = {
  id: 'thpt_standard_morning',
  name: 'THPT · Ca Sáng Chuẩn 45 phút',
  type: 'high_school',
  periodDuration: 45,
  periods: [
    { number: 1, name: 'Tiết 1', startTime: '07:00', endTime: '07:45', isUsable: true },
    { number: 2, name: 'Tiết 2', startTime: '07:45', endTime: '08:30', isUsable: true },
    { number: 3, name: 'Tiết 3', startTime: '08:45', endTime: '09:30', isUsable: true }, // Sau ra chơi 15p
    { number: 4, name: 'Tiết 4', startTime: '09:40', endTime: '10:25', isUsable: true }, // Nghỉ 10p
    { number: 5, name: 'Tiết 5', startTime: '10:30', endTime: '11:15', isUsable: true }
  ]
};

export const INITIAL_HIGH_SCHOOL_COURSES = [
  {
    id: 'thpt-crs-1',
    name: 'Toán',
    code: 'TOAN',
    color: '#AFC8F5',
    category: 'math',
    teacher: 'Thầy Nguyễn Văn An',
    room: 'Phòng 11A2',
    periodsPerWeek: 4,
    type: 'theory',
    schedules: [
      {
        id: 'thpt-sch-1',
        day: 1, // Thứ 2
        startPeriod: 2,
        endPeriod: 3,
        startTime: '07:45',
        endTime: '09:30',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Thầy Nguyễn Văn An',
        type: 'theory'
      },
      {
        id: 'thpt-sch-1b',
        day: 4, // Thứ 5
        startPeriod: 1,
        endPeriod: 2,
        startTime: '07:00',
        endTime: '08:30',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Thầy Nguyễn Văn An',
        type: 'theory'
      }
    ],
    notes: 'Lượng giác, Đạo hàm & Hình học không gian.'
  },
  {
    id: 'thpt-crs-2',
    name: 'Ngữ văn',
    code: 'VAN',
    color: '#F4B5C2',
    category: 'literature',
    teacher: 'Cô Trần Thu Hà',
    room: 'Phòng 11A2',
    periodsPerWeek: 4,
    type: 'theory',
    schedules: [
      {
        id: 'thpt-sch-2',
        day: 2, // Thứ 3
        startPeriod: 1,
        endPeriod: 2,
        startTime: '07:00',
        endTime: '08:30',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Cô Trần Thu Hà',
        type: 'theory'
      },
      {
        id: 'thpt-sch-2b',
        day: 5, // Thứ 6
        startPeriod: 3,
        endPeriod: 4,
        startTime: '08:45',
        endTime: '10:25',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Cô Trần Thu Hà',
        type: 'theory'
      }
    ],
    notes: 'Văn học hiện thực & Nghị luận xã hội.'
  },
  {
    id: 'thpt-crs-3',
    name: 'Tiếng Anh',
    code: 'ANH',
    color: '#A9DED5',
    category: 'language',
    teacher: 'Cô Lê Hoàng Mai',
    room: 'Phòng 11A2',
    periodsPerWeek: 3,
    type: 'theory',
    schedules: [
      {
        id: 'thpt-sch-3',
        day: 1, // Thứ 2
        startPeriod: 4,
        endPeriod: 5,
        startTime: '09:40',
        endTime: '11:15',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Cô Lê Hoàng Mai',
        type: 'theory'
      },
      {
        id: 'thpt-sch-3b',
        day: 4, // Thứ 5
        startPeriod: 3,
        endPeriod: 3,
        startTime: '08:45',
        endTime: '09:30',
        sessions: 1,
        room: 'Phòng 11A2',
        teacher: 'Cô Lê Hoàng Mai',
        type: 'theory'
      }
    ],
    notes: 'Unit 3: Becoming Independent & Speaking.'
  },
  {
    id: 'thpt-crs-4',
    name: 'Vật lý',
    code: 'LY',
    color: '#AFC8F5',
    category: 'physics',
    teacher: 'Thầy Phạm Đình Trọng',
    room: 'Phòng 11A2',
    periodsPerWeek: 2,
    type: 'theory',
    schedules: [
      {
        id: 'thpt-sch-4',
        day: 3, // Thứ 4
        startPeriod: 1,
        endPeriod: 2,
        startTime: '07:00',
        endTime: '08:30',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Thầy Phạm Đình Trọng',
        type: 'theory'
      }
    ],
    notes: 'Điện trường & Định luật Coulomb.'
  },
  {
    id: 'thpt-crs-5',
    name: 'Hóa học',
    code: 'HOA',
    color: '#F7D99A',
    category: 'chemistry',
    teacher: 'Cô Vũ Bích Ngọc',
    room: 'Phòng Lab Hóa',
    periodsPerWeek: 2,
    type: 'theory',
    schedules: [
      {
        id: 'thpt-sch-5',
        day: 3, // Thứ 4
        startPeriod: 3,
        endPeriod: 4,
        startTime: '08:45',
        endTime: '10:25',
        sessions: 2,
        room: 'Phòng Lab Hóa',
        teacher: 'Cô Vũ Bích Ngọc',
        type: 'theory'
      }
    ],
    notes: 'Hóa học hữu cơ: Hydrocarbon & Dẫn xuất.'
  },
  {
    id: 'thpt-crs-6',
    name: 'Lịch sử',
    code: 'SU',
    color: '#F5B28D',
    category: 'history',
    teacher: 'Thầy Đặng Quốc Tuấn',
    room: 'Phòng 11A2',
    periodsPerWeek: 2,
    type: 'theory',
    schedules: [
      {
        id: 'thpt-sch-6',
        day: 2, // Thứ 3
        startPeriod: 3,
        endPeriod: 4,
        startTime: '08:45',
        endTime: '10:25',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Thầy Đặng Quốc Tuấn',
        type: 'theory'
      }
    ],
    notes: 'Lịch sử thế giới hiện đại.'
  },
  {
    id: 'thpt-crs-7',
    name: 'Giáo dục kinh tế và pháp luật',
    code: 'GDKTPL',
    color: '#F7D99A',
    category: 'social',
    teacher: 'Cô Hoàng Thu Thủy',
    room: 'Phòng 11A2',
    periodsPerWeek: 2,
    type: 'theory',
    schedules: [
      {
        id: 'thpt-sch-7',
        day: 5, // Thứ 6
        startPeriod: 1,
        endPeriod: 2,
        startTime: '07:00',
        endTime: '08:30',
        sessions: 2,
        room: 'Phòng 11A2',
        teacher: 'Cô Hoàng Thu Thủy',
        type: 'theory'
      }
    ],
    notes: 'Thị trường & Cơ chế thị trường.'
  },
  {
    id: 'thpt-crs-8',
    name: 'Tin học',
    code: 'TIN',
    color: '#AFC8F5',
    category: 'it',
    teacher: 'Thầy Trần Bá Duy',
    room: 'Phòng Máy 2',
    periodsPerWeek: 2,
    type: 'practical',
    schedules: [
      {
        id: 'thpt-sch-8',
        day: 6, // Thứ 7
        startPeriod: 1,
        endPeriod: 2,
        startTime: '07:00',
        endTime: '08:30',
        sessions: 2,
        room: 'Phòng Máy 2',
        teacher: 'Thầy Trần Bá Duy',
        type: 'practical'
      }
    ],
    notes: 'Lập trình Python và Cơ sở dữ liệu quan hệ.'
  }
];

export const INITIAL_HIGH_SCHOOL_HOMEWORK = [
  {
    id: 'hw-1',
    subject: 'Toán',
    color: '#AFC8F5',
    title: 'Giải bài tập 1 đến 15 trang 42 SGK Toán 11',
    dueDate: '2026-08-24',
    priority: 'high',
    status: 'doing',
    notes: 'Làm ra vở bài tập, vẽ đồ thị hàm số đầy đủ'
  },
  {
    id: 'hw-2',
    subject: 'Ngữ văn',
    color: '#F4B5C2',
    title: 'Viết bài văn nghị luận xã hội: Ý chí và nghị lực của tuổi trẻ',
    dueDate: '2026-08-25',
    priority: 'medium',
    status: 'todo',
    notes: 'Dung lượng khoảng 600 từ'
  },
  {
    id: 'hw-3',
    subject: 'Vật lý',
    color: '#AFC8F5',
    title: 'Làm đề kiểm tra 15 phút phần Điện trường',
    dueDate: '2026-08-22',
    priority: 'high',
    status: 'todo',
    notes: '30 câu trắc nghiệm trực tuyến'
  },
  {
    id: 'hw-4',
    subject: 'Tiếng Anh',
    color: '#A9DED5',
    title: 'Học thuộc từ vựng Unit 3: Independent Living',
    dueDate: '2026-08-21',
    priority: 'low',
    status: 'done',
    notes: 'Kiểm tra miệng đầu giờ'
  }
];

export const INITIAL_HIGH_SCHOOL_EXAMS = [
  {
    id: 'ex-1',
    subject: 'Vật lý',
    color: '#AFC8F5',
    date: '2026-08-22',
    time: '07:00 – 07:45',
    type: '45 phút (1 tiết)',
    room: 'Phòng 11A2',
    scope: 'Chương 1: Điện tích và Điện trường'
  },
  {
    id: 'ex-2',
    subject: 'Toán',
    color: '#AFC8F5',
    date: '2026-08-28',
    time: '07:45 – 09:30',
    type: 'Giữa kỳ',
    room: 'Phòng 11A2',
    scope: 'Hàm số lượng giác & Phương trình lượng giác'
  },
  {
    id: 'ex-3',
    subject: 'Tiếng Anh',
    color: '#A9DED5',
    date: '2026-08-25',
    time: '09:40 – 09:55',
    type: '15 phút',
    room: 'Phòng 11A2',
    scope: 'Ngữ pháp Thì hoàn thành & Mệnh đề quan hệ'
  },
  {
    id: 'ex-4',
    subject: 'Hóa học',
    color: '#F7D99A',
    date: '2026-09-02',
    time: '08:45 – 09:30',
    type: '45 phút (1 tiết)',
    room: 'Phòng Lab Hóa',
    scope: 'Sự điện li, Axit - Bazo - Muối'
  }
];

export const INITIAL_GRADE_12_TARGETS = {
  examYear: 2027,
  examDate: '2027-06-25',
  targetTotalScore: 26.5,
  combination: 'A00 (Toán, Vật lý, Hóa học)',
  subjects: [
    { name: 'Toán', target: 9.0, currentWeeklyHours: 8, goalHours: 10 },
    { name: 'Vật lý', target: 8.75, currentWeeklyHours: 6, goalHours: 8 },
    { name: 'Hóa học', target: 8.75, currentWeeklyHours: 5, goalHours: 7 }
  ],
  targetUniversity: 'Đại học Bách khoa Hà Nội / ĐH Công nghệ - ĐHQGHN',
  targetMajor: 'Khoa học Máy tính & Công nghệ Thông tin'
};

export const INITIAL_HIGH_SCHOOL_USER = {
  id: 'usr_hs_demo',
  name: 'Nguyễn Doãn Uy Vũ',
  school: 'THPT Đông Anh',
  schoolShort: 'THPT Đông Anh',
  grade: 11,
  className: '11A2',
  academicYear: '2026–2027',
  avatar: 'UV',
  mode: 'high_school'
};
