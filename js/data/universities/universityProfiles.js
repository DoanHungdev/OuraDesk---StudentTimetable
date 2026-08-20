/**
 * University & Time Profile Database Configurations
 * Universal Hierarchical Model: University -> Campus -> Schedule Profile -> Periods
 */

export const PRESET_UNIVERSITIES = [
  {
    id: 'haui',
    name: 'Đại học Công nghiệp Hà Nội',
    shortName: 'HaUI',
    code: 'DCN',
    logo: 'fa-building-columns',
    campuses: [
      {
        id: 'haui_hn',
        name: 'Cơ sở 1, 2 - Hà Nội (Bắc Từ Liêm / Tây Tựu)',
        isDefault: true,
        profiles: [
          {
            id: 'haui_hn_theory',
            name: 'HaUI · Lý thuyết',
            type: 'theory',
            isDefault: true,
            description: 'Khung giờ học lý thuyết chuẩn: Tiết 50 phút, có giải lao 10 phút giữa các ca.',
            periods: [
              // CA SÁNG
              { id: 'haui-t-1', number: 1, name: 'Tiết 1', startTime: '07:00', endTime: '07:50', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-t-2', number: 2, name: 'Tiết 2', startTime: '07:50', endTime: '08:40', session: 'morning', breakAfter: 10, isUsable: true }, // Nghỉ 10p
              { id: 'haui-t-3', number: 3, name: 'Tiết 3', startTime: '08:50', endTime: '09:40', session: 'morning', breakAfter: 10, isUsable: true }, // Nghỉ 10p
              { id: 'haui-t-4', number: 4, name: 'Tiết 4', startTime: '09:50', endTime: '10:40', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-t-5', number: 5, name: 'Tiết 5', startTime: '10:40', endTime: '11:30', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-t-6', number: 6, name: 'Tiết 6', startTime: '11:30', endTime: '12:20', session: 'morning', breakAfter: 0, isUsable: false }, // Không sử dụng
              // CA CHIỀU
              { id: 'haui-t-7', number: 7, name: 'Tiết 7', startTime: '12:30', endTime: '13:20', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-t-8', number: 8, name: 'Tiết 8', startTime: '13:20', endTime: '14:10', session: 'afternoon', breakAfter: 10, isUsable: true }, // Nghỉ 10p
              { id: 'haui-t-9', number: 9, name: 'Tiết 9', startTime: '14:20', endTime: '15:10', session: 'afternoon', breakAfter: 10, isUsable: true }, // Nghỉ 10p
              { id: 'haui-t-10', number: 10, name: 'Tiết 10', startTime: '15:20', endTime: '16:10', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-t-11', number: 11, name: 'Tiết 11', startTime: '16:10', endTime: '17:00', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-t-12', number: 12, name: 'Tiết 12', startTime: '17:00', endTime: '17:50', session: 'afternoon', breakAfter: 0, isUsable: false }, // Không sử dụng
              // CA TỐI
              { id: 'haui-t-13', number: 13, name: 'Tiết 13', startTime: '17:30', endTime: '18:20', session: 'evening', breakAfter: 0, isUsable: true },
              { id: 'haui-t-14', number: 14, name: 'Tiết 14', startTime: '18:20', endTime: '19:10', session: 'evening', breakAfter: 10, isUsable: true }, // Nghỉ 10p
              { id: 'haui-t-15', number: 15, name: 'Tiết 15', startTime: '19:20', endTime: '20:10', session: 'evening', breakAfter: 0, isUsable: true },
              { id: 'haui-t-16', number: 16, name: 'Tiết 16', startTime: '20:10', endTime: '21:00', session: 'evening', breakAfter: 0, isUsable: true }
            ]
          },
          {
            id: 'haui_hn_practical',
            name: 'HaUI · Thực hành / Thí nghiệm',
            type: 'practical',
            isDefault: false,
            description: 'Khung giờ thực hành xưởng / phòng Lab HaUI: 6 tiết sáng, 6 tiết chiều, 5 tiết tối liên tục.',
            periods: [
              // SÁNG
              { id: 'haui-p-1', number: 1, name: 'Tiết 1', startTime: '07:00', endTime: '07:50', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-p-2', number: 2, name: 'Tiết 2', startTime: '07:50', endTime: '08:40', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-p-3', number: 3, name: 'Tiết 3', startTime: '08:40', endTime: '09:30', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-p-4', number: 4, name: 'Tiết 4', startTime: '09:30', endTime: '10:20', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-p-5', number: 5, name: 'Tiết 5', startTime: '10:20', endTime: '11:10', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'haui-p-6', number: 6, name: 'Tiết 6', startTime: '11:10', endTime: '12:00', session: 'morning', breakAfter: 0, isUsable: true },
              // CHIỀU
              { id: 'haui-p-7', number: 7, name: 'Tiết 7', startTime: '12:30', endTime: '13:20', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-p-8', number: 8, name: 'Tiết 8', startTime: '13:20', endTime: '14:10', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-p-9', number: 9, name: 'Tiết 9', startTime: '14:10', endTime: '15:00', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-p-10', number: 10, name: 'Tiết 10', startTime: '15:00', endTime: '15:50', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-p-11', number: 11, name: 'Tiết 11', startTime: '15:50', endTime: '16:40', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'haui-p-12', number: 12, name: 'Tiết 12', startTime: '16:40', endTime: '17:30', session: 'afternoon', breakAfter: 0, isUsable: true },
              // TỐI
              { id: 'haui-p-13', number: 13, name: 'Tiết 13', startTime: '17:45', endTime: '18:35', session: 'evening', breakAfter: 0, isUsable: true },
              { id: 'haui-p-14', number: 14, name: 'Tiết 14', startTime: '18:35', endTime: '19:25', session: 'evening', breakAfter: 0, isUsable: true },
              { id: 'haui-p-15', number: 15, name: 'Tiết 15', startTime: '19:25', endTime: '20:15', session: 'evening', breakAfter: 0, isUsable: true },
              { id: 'haui-p-16', number: 16, name: 'Tiết 16', startTime: '20:15', endTime: '21:05', session: 'evening', breakAfter: 0, isUsable: true },
              { id: 'haui-p-17', number: 17, name: 'Tiết 17', startTime: '21:05', endTime: '21:55', session: 'evening', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      },
      {
        id: 'haui_hanam',
        name: 'Cơ sở 3 - Hà Nam',
        isDefault: false,
        profiles: [
          {
            id: 'haui_hn3_theory',
            name: 'HaUI Hà Nam · Lý thuyết',
            type: 'theory',
            isDefault: true,
            periods: [
              { id: 'hn3-t-1', number: 1, name: 'Tiết 1', startTime: '07:15', endTime: '08:05', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'hn3-t-2', number: 2, name: 'Tiết 2', startTime: '08:05', endTime: '08:55', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'hn3-t-3', number: 3, name: 'Tiết 3', startTime: '09:05', endTime: '09:55', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'hn3-t-4', number: 4, name: 'Tiết 4', startTime: '10:05', endTime: '10:55', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'hn3-t-5', number: 5, name: 'Tiết 5', startTime: '10:55', endTime: '11:45', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'hn3-t-7', number: 7, name: 'Tiết 7', startTime: '12:45', endTime: '13:35', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'hn3-t-8', number: 8, name: 'Tiết 8', startTime: '13:35', endTime: '14:25', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'hn3-t-9', number: 9, name: 'Tiết 9', startTime: '14:35', endTime: '15:25', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'hn3-t-10', number: 10, name: 'Tiết 10', startTime: '15:35', endTime: '16:25', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'hn3-t-11', number: 11, name: 'Tiết 11', startTime: '16:25', endTime: '17:15', session: 'afternoon', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'hust',
    name: 'Đại học Bách khoa Hà Nội',
    shortName: 'HUST',
    code: 'BKA',
    logo: 'fa-compass-drafting',
    campuses: [
      {
        id: 'hust_main',
        name: 'Cơ sở Đại Cồ Việt (Hà Nội)',
        isDefault: true,
        profiles: [
          {
            id: 'hust_standard',
            name: 'HUST · Kíp học 90 phút',
            type: 'theory',
            isDefault: true,
            description: 'Hệ thống kíp chuẩn Bách Khoa: 6 kíp/ngày, mỗi kíp 90 phút.',
            periods: [
              { id: 'hust-k-1', number: 1, name: 'Kíp 1', startTime: '06:45', endTime: '08:15', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'hust-k-2', number: 2, name: 'Kíp 2', startTime: '08:25', endTime: '10:00', session: 'morning', breakAfter: 15, isUsable: true },
              { id: 'hust-k-3', number: 3, name: 'Kíp 3', startTime: '10:15', endTime: '11:45', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'hust-k-4', number: 4, name: 'Kíp 4', startTime: '12:30', endTime: '14:00', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'hust-k-5', number: 5, name: 'Kíp 5', startTime: '14:10', endTime: '15:45', session: 'afternoon', breakAfter: 15, isUsable: true },
              { id: 'hust-k-6', number: 6, name: 'Kíp 6', startTime: '16:00', endTime: '17:30', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'hust-k-7', number: 7, name: 'Kíp 7 (Tối)', startTime: '17:45', endTime: '19:15', session: 'evening', breakAfter: 10, isUsable: true },
              { id: 'hust-k-8', number: 8, name: 'Kíp 8 (Tối)', startTime: '19:25', endTime: '20:55', session: 'evening', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'vnu',
    name: 'Đại học Quốc gia Hà Nội',
    shortName: 'VNU',
    code: 'QGH',
    logo: 'fa-landmark',
    campuses: [
      {
        id: 'vnu_caugiay',
        name: 'Cơ sở Cầu Giấy / Hòa Lạc',
        isDefault: true,
        profiles: [
          {
            id: 'vnu_standard',
            name: 'VNU · Chuẩn 50 phút',
            type: 'theory',
            isDefault: true,
            description: 'Tiết 50 phút chuẩn ĐHQG Hà Nội.',
            periods: [
              { id: 'vnu-t-1', number: 1, name: 'Tiết 1', startTime: '07:00', endTime: '07:50', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-2', number: 2, name: 'Tiết 2', startTime: '08:00', endTime: '08:50', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-3', number: 3, name: 'Tiết 3', startTime: '09:00', endTime: '09:50', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-4', number: 4, name: 'Tiết 4', startTime: '10:00', endTime: '10:50', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-5', number: 5, name: 'Tiết 5', startTime: '11:00', endTime: '11:50', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'vnu-t-6', number: 6, name: 'Tiết 6', startTime: '13:00', endTime: '13:50', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-7', number: 7, name: 'Tiết 7', startTime: '14:00', endTime: '14:50', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-8', number: 8, name: 'Tiết 8', startTime: '15:00', endTime: '15:50', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-9', number: 9, name: 'Tiết 9', startTime: '16:00', endTime: '16:50', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'vnu-t-10', number: 10, name: 'Tiết 10', startTime: '17:00', endTime: '17:50', session: 'afternoon', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'neu',
    name: 'Đại học Kinh tế Quốc dân',
    shortName: 'NEU',
    code: 'KHA',
    logo: 'fa-chart-line',
    campuses: [
      {
        id: 'neu_main',
        name: 'Cơ sở Giải Phóng (Hà Nội)',
        isDefault: true,
        profiles: [
          {
            id: 'neu_standard',
            name: 'NEU · Chuẩn 50 phút',
            type: 'theory',
            isDefault: true,
            periods: [
              { id: 'neu-1', number: 1, name: 'Tiết 1', startTime: '06:45', endTime: '07:35', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'neu-2', number: 2, name: 'Tiết 2', startTime: '07:40', endTime: '08:30', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'neu-3', number: 3, name: 'Tiết 3', startTime: '08:40', endTime: '09:30', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'neu-4', number: 4, name: 'Tiết 4', startTime: '09:40', endTime: '10:30', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'neu-5', number: 5, name: 'Tiết 5', startTime: '10:35', endTime: '11:25', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'neu-6', number: 6, name: 'Tiết 6', startTime: '11:30', endTime: '12:20', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'neu-7', number: 7, name: 'Tiết 7', startTime: '12:45', endTime: '13:35', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'neu-8', number: 8, name: 'Tiết 8', startTime: '13:40', endTime: '14:30', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'neu-9', number: 9, name: 'Tiết 9', startTime: '14:40', endTime: '15:30', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'neu-10', number: 10, name: 'Tiết 10', startTime: '15:40', endTime: '16:30', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'neu-11', number: 11, name: 'Tiết 11', startTime: '16:35', endTime: '17:25', session: 'afternoon', breakAfter: 0, isUsable: true },
              { id: 'neu-12', number: 12, name: 'Tiết 12', startTime: '17:30', endTime: '18:20', session: 'afternoon', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tmu',
    name: 'Đại học Thương mại',
    shortName: 'TMU',
    code: 'TMA',
    logo: 'fa-store',
    campuses: [
      {
        id: 'tmu_main',
        name: 'Cơ sở Hồ Tùng Mậu (Hà Nội)',
        isDefault: true,
        profiles: [
          {
            id: 'tmu_standard',
            name: 'TMU · Chuẩn 50 phút',
            type: 'theory',
            isDefault: true,
            periods: [
              { id: 'tmu-1', number: 1, name: 'Tiết 1', startTime: '06:45', endTime: '07:35', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'tmu-2', number: 2, name: 'Tiết 2', startTime: '07:40', endTime: '08:30', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'tmu-3', number: 3, name: 'Tiết 3', startTime: '08:40', endTime: '09:30', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'tmu-4', number: 4, name: 'Tiết 4', startTime: '09:40', endTime: '10:30', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'tmu-5', number: 5, name: 'Tiết 5', startTime: '10:35', endTime: '11:25', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'tmu-7', number: 7, name: 'Tiết 7', startTime: '13:00', endTime: '13:50', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'tmu-8', number: 8, name: 'Tiết 8', startTime: '13:55', endTime: '14:45', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'tmu-9', number: 9, name: 'Tiết 9', startTime: '14:55', endTime: '15:45', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'tmu-10', number: 10, name: 'Tiết 10', startTime: '15:55', endTime: '16:45', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'tmu-11', number: 11, name: 'Tiết 11', startTime: '16:50', endTime: '17:40', session: 'afternoon', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'utc',
    name: 'Đại học Giao thông Vận tải',
    shortName: 'UTC',
    code: 'GHA',
    logo: 'fa-train-subway',
    campuses: [
      {
        id: 'utc_main',
        name: 'Cơ sở Cầu Giấy (Hà Nội)',
        isDefault: true,
        profiles: [
          {
            id: 'utc_standard',
            name: 'UTC · Chuẩn 50 phút',
            type: 'theory',
            isDefault: true,
            periods: [
              { id: 'utc-1', number: 1, name: 'Tiết 1', startTime: '07:00', endTime: '07:50', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'utc-2', number: 2, name: 'Tiết 2', startTime: '07:55', endTime: '08:45', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'utc-3', number: 3, name: 'Tiết 3', startTime: '08:55', endTime: '09:45', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'utc-4', number: 4, name: 'Tiết 4', startTime: '09:55', endTime: '10:45', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'utc-5', number: 5, name: 'Tiết 5', startTime: '10:50', endTime: '11:40', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'utc-7', number: 7, name: 'Tiết 7', startTime: '12:30', endTime: '13:20', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'utc-8', number: 8, name: 'Tiết 8', startTime: '13:25', endTime: '14:15', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'utc-9', number: 9, name: 'Tiết 9', startTime: '14:25', endTime: '15:15', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'utc-10', number: 10, name: 'Tiết 10', startTime: '15:25', endTime: '16:15', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'utc-11', number: 11, name: 'Tiết 11', startTime: '16:20', endTime: '17:10', session: 'afternoon', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'custom',
    name: 'Khung giờ Tùy chỉnh (Cá nhân)',
    shortName: 'Tùy chỉnh',
    code: 'CUSTOM',
    logo: 'fa-sliders',
    campuses: [
      {
        id: 'custom_campus',
        name: 'Cơ sở Mặc định',
        isDefault: true,
        profiles: [
          {
            id: 'custom_profile_default',
            name: 'Khung giờ cá nhân 1',
            type: 'custom',
            isDefault: true,
            description: 'Khung giờ tự do do người dùng thiết lập.',
            periods: [
              { id: 'c-1', number: 1, name: 'Tiết 1', startTime: '07:00', endTime: '07:45', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'c-2', number: 2, name: 'Tiết 2', startTime: '07:50', endTime: '08:35', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'c-3', number: 3, name: 'Tiết 3', startTime: '08:45', endTime: '09:30', session: 'morning', breakAfter: 10, isUsable: true },
              { id: 'c-4', number: 4, name: 'Tiết 4', startTime: '09:40', endTime: '10:25', session: 'morning', breakAfter: 5, isUsable: true },
              { id: 'c-5', number: 5, name: 'Tiết 5', startTime: '10:30', endTime: '11:15', session: 'morning', breakAfter: 0, isUsable: true },
              { id: 'c-6', number: 6, name: 'Tiết 6', startTime: '13:00', endTime: '13:45', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'c-7', number: 7, name: 'Tiết 7', startTime: '13:50', endTime: '14:35', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'c-8', number: 8, name: 'Tiết 8', startTime: '14:45', endTime: '15:30', session: 'afternoon', breakAfter: 10, isUsable: true },
              { id: 'c-9', number: 9, name: 'Tiết 9', startTime: '15:40', endTime: '16:25', session: 'afternoon', breakAfter: 5, isUsable: true },
              { id: 'c-10', number: 10, name: 'Tiết 10', startTime: '16:30', endTime: '17:15', session: 'afternoon', breakAfter: 0, isUsable: true }
            ]
          }
        ]
      }
    ]
  }
];
