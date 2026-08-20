/**
 * Mock Import Templates & Samples for Testing Class Schedule Import Pipeline
 * Supports Multi-Class Matrix, Single Class Image OCR, PDF, Excel and Share Codes
 */

export const MOCK_MULTI_CLASS_MATRIX = {
  name: 'Thời Khóa Biểu Khối 11 & 12 - Học Kỳ 1 (Bảng Ma Trận)',
  classes: ['11A1', '11A2', '12A1', '12A2', '12A3'],
  scheduleMatrix: [
    // THỨ 2
    { day: 1, period: 1, '11A1': 'Chào cờ', '11A2': 'Chào cờ', '12A1': 'Chào cờ', '12A2': 'Chào cờ', '12A3': 'Chào cờ' },
    { day: 1, period: 2, '11A1': 'Toán', '11A2': 'Toán', '12A1': 'Toán', '12A2': 'Văn', '12A3': 'Toán' },
    { day: 1, period: 3, '11A1': 'Toán', '11A2': 'Toán', '12A1': 'Toán', '12A2': 'Văn', '12A3': 'Toán' },
    { day: 1, period: 4, '11A1': 'Lý', '11A2': 'Tiếng Anh', '12A1': 'Lý', '12A2': 'Toán', '12A3': 'Tiếng Anh' },
    { day: 1, period: 5, '11A1': 'Lý', '11A2': 'Tiếng Anh', '12A1': 'Lý', '12A2': 'Toán', '12A3': 'Tiếng Anh' },

    // THỨ 3
    { day: 2, period: 1, '11A1': 'Ngữ văn', '11A2': 'Ngữ văn', '12A1': 'Ngữ văn', '12A2': 'Lý', '12A3': 'Ngữ văn' },
    { day: 2, period: 2, '11A1': 'Ngữ văn', '11A2': 'Ngữ văn', '12A1': 'Ngữ văn', '12A2': 'Lý', '12A3': 'Ngữ văn' },
    { day: 2, period: 3, '11A1': 'Tiếng Anh', '11A2': 'Lịch sử', '12A1': 'Tiếng Anh', '12A2': 'Hóa', '12A3': 'Vật lý' },
    { day: 2, period: 4, '11A1': 'Hóa học', '11A2': 'Lịch sử', '12A1': 'Hóa học', '12A2': 'Anh', '12A3': 'Vật lý' },
    { day: 2, period: 5, '11A1': 'Sinh học', '11A2': 'Tin học', '12A1': 'Sinh học', '12A2': 'Sinh', '12A3': 'Lịch sử' },

    // THỨ 4
    { day: 3, period: 1, '11A1': 'Toán', '11A2': 'Vật lý', '12A1': 'Toán', '12A2': 'Toán', '12A3': 'Toán' },
    { day: 3, period: 2, '11A1': 'Toán', '11A2': 'Vật lý', '12A1': 'Toán', '12A2': 'Toán', '12A3': 'Toán' },
    { day: 3, period: 3, '11A1': 'Tin học', '11A2': 'Hóa học', '12A1': 'Tin học', '12A2': 'Văn', '12A3': 'Hóa học' },
    { day: 3, period: 4, '11A1': 'Công nghệ', '11A2': 'Hóa học', '12A1': 'Công nghệ', '12A2': 'Tin', '12A3': 'Hóa học' },
    { day: 3, period: 5, '11A1': 'GDKT&PL', '11A2': 'Địa lý', '12A1': 'GDKT&PL', '12A2': 'Công nghệ', '12A3': 'Địa lý' },

    // THỨ 5
    { day: 4, period: 1, '11A1': 'Vật lý', '11A2': 'Toán', '12A1': 'Vật lý', '12A2': 'Anh', '12A3': 'Tiếng Anh' },
    { day: 4, period: 2, '11A1': 'Hóa học', '11A2': 'Toán', '12A1': 'Hóa học', '12A2': 'Lý', '12A3': 'Sinh học' },
    { day: 4, period: 3, '11A1': 'Ngữ văn', '11A2': 'Tiếng Anh', '12A1': 'Ngữ văn', '12A2': 'Toán', '12A3': 'Ngữ văn' },
    { day: 4, period: 4, '11A1': 'Ngữ văn', '11A2': 'GDQP', '12A1': 'Ngữ văn', '12A2': 'Toán', '12A3': 'Ngữ văn' },
    { day: 4, period: 5, '11A1': 'GDQP', '11A2': 'GDQP', '12A1': 'GDQP', '12A2': 'GDQP', '12A3': 'GDQP' },

    // THỨ 6
    { day: 5, period: 1, '11A1': 'Toán', '11A2': 'GDKT&PL', '12A1': 'Toán', '12A2': 'Văn', '12A3': 'Toán' },
    { day: 5, period: 2, '11A1': 'Tiếng Anh', '11A2': 'GDKT&PL', '12A1': 'Tiếng Anh', '12A2': 'Hóa', '12A3': 'Vật lý' },
    { day: 5, period: 3, '11A1': 'GD Thể chất', '11A2': 'Ngữ văn', '12A1': 'GD Thể chất', '12A2': 'GDTC', '12A3': 'GD Thể chất' },
    { day: 5, period: 4, '11A1': 'GD Thể chất', '11A2': 'Ngữ văn', '12A1': 'GD Thể chất', '12A2': 'GDTC', '12A3': 'GD Thể chất' },
    { day: 5, period: 5, '11A1': 'SHCN', '11A2': 'SHCN', '12A1': 'SHCN', '12A2': 'SHCN', '12A3': 'SHCN' }
  ]
};

export const MOCK_COMMUNITY_CODES = {
  'DA-11A2-W03': {
    school: 'THPT Đông Anh',
    className: '11A2',
    week: 'Tuần 03',
    updatedAt: '19/08/2026',
    author: 'Lớp trưởng 11A2',
    periodsCount: 25
  },
  'TL-12A3-W03': {
    school: 'Trường THPT Thăng Long (Hà Nội)',
    className: '12A3',
    week: 'Tuần 03',
    updatedAt: '19/08/2026',
    author: 'Lớp trưởng 12A3',
    periodsCount: 25
  },
  'HAUI-CNTT-W01': {
    school: 'Đại học Công nghiệp Hà Nội',
    className: 'K20 CNTT',
    week: 'Tuần 01',
    updatedAt: '19/08/2026',
    author: 'Nguyễn Doãn Tuấn Hưng',
    periodsCount: 18
  }
};
