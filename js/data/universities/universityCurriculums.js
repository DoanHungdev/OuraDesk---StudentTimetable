/**
 * University Curriculum Database (Khung Chương Trình Đào Tạo Đa Trường & Đa Ngành)
 * Architecture:
 * University -> Campus -> Major / Program -> Curriculum (Cohort / Academic Year / Version) -> CourseGroup -> Course
 */

export const PRESET_CURRICULUMS = [
  // =========================================================================
  // 1. ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI (HaUI)
  // =========================================================================
  {
    id: 'curriculum_haui_ce_k20',
    universityId: 'haui',
    campusId: 'haui_hn',
    majorId: 'haui_ce',
    majorName: 'Kỹ thuật máy tính',
    faculty: 'Khoa Công nghệ Thông tin',
    cohort: '20',
    academicYear: '2026–2027',
    curriculumVersion: '1.0',
    version: '1.0',
    isActive: true,
    isDefault: true,
    name: 'HaUI Kỹ thuật máy tính – Khóa 20 (2026–2027)',
    totalCreditsRequired: 145,
    description: 'Chương trình đào tạo kỹ sư Kỹ thuật máy tính chuẩn CDIO, định hướng Hệ thống nhúng, IoT và Kiến trúc phần cứng.',
    groups: [
      {
        id: 'grp_haui_gdc',
        curriculumId: 'curriculum_haui_ce_k20',
        name: 'Giáo dục đại cương',
        code: 'GDC',
        description: 'Khối kiến thức giáo dục đại cương, toán, khoa học tự nhiên và ngoại ngữ',
        order: 1,
        color: '#AFC8F5',
        requiredCredits: 32,
        courses: [
          { code: 'MAT101', name: 'Toán cao cấp (Giải tích & Đại số)', credits: 3, isRequired: true },
          { code: 'PHY101', name: 'Vật lý đại cương & Thí nghiệm', credits: 3, isRequired: true },
          { code: 'ENG202', name: 'Tiếng Anh chuyên ngành CNTT & KTMT', credits: 3, isRequired: true },
          { code: 'PHI101', name: 'Triết học Mác - Lênin', credits: 3, isRequired: true },
          { code: 'POL102', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, isRequired: true },
          { code: 'SOC103', name: 'Chủ nghĩa xã hội khoa học', credits: 2, isRequired: true },
          { code: 'HIS104', name: 'Lịch sử Đảng Cộng sản Việt Nam', credits: 2, isRequired: true },
          { code: 'LAW105', name: 'Pháp luật đại cương', credits: 2, isRequired: true }
        ]
      },
      {
        id: 'grp_haui_csn',
        curriculumId: 'curriculum_haui_ce_k20',
        name: 'Cơ sở ngành',
        code: 'CSN',
        description: 'Khối kiến thức cơ sở kỹ thuật máy tính, lập trình và mạch điện tử',
        order: 2,
        color: '#A9DED5',
        requiredCredits: 40,
        courses: [
          { code: 'CSE201', name: 'Kỹ thuật lập trình C++', credits: 3, isRequired: true },
          { code: 'CSE202', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, isRequired: true },
          { code: 'ECE201', name: 'Kỹ thuật điện tử số & Vi mạch', credits: 3, isRequired: true },
          { code: 'ECE202', name: 'Lý thuyết mạch và Tín hiệu', credits: 3, isRequired: true },
          { code: 'CSE205', name: 'Hệ quản trị cơ sở dữ liệu', credits: 3, isRequired: true },
          { code: 'CSE206', name: 'Toán rời rạc và Lý thuyết đồ thị', credits: 3, isRequired: true },
          { code: 'ECE207', name: 'Xử lý tín hiệu số (DSP)', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_haui_cn',
        curriculumId: 'curriculum_haui_ce_k20',
        name: 'Chuyên ngành',
        code: 'CN',
        description: 'Khối kiến thức chuyên sâu về kiến trúc máy tính, hệ thống nhúng và IoT',
        order: 3,
        color: '#F5B28D',
        requiredCredits: 45,
        courses: [
          { code: 'CE301', name: 'Kiến trúc máy tính & Hợp ngữ', credits: 3, isRequired: true },
          { code: 'CE302', name: 'Hệ thống nhúng & IoT', credits: 4, isRequired: true },
          { code: 'CE303', name: 'Thiết kế vi mạch số (VHDL/Verilog)', credits: 3, isRequired: true },
          { code: 'CSE304', name: 'Hệ điều hành và Hệ điều hành nhúng', credits: 3, isRequired: true },
          { code: 'CE305', name: 'Mạng máy tính & Truyền thông số', credits: 3, isRequired: true },
          { code: 'CE306', name: 'Lập trình Vi điều khiển nâng cao (ARM/STM32)', credits: 3, isRequired: true },
          { code: 'CE307', name: 'Đồ án Kỹ thuật máy tính', credits: 2, isRequired: true }
        ]
      },
      {
        id: 'grp_haui_tc',
        curriculumId: 'curriculum_haui_ce_k20',
        name: 'Tự chọn',
        code: 'TC',
        description: 'Các học phần chuyên sâu tự chọn định hướng nghiên cứu và công nghệ cao',
        order: 4,
        color: '#C7B7F4',
        requiredCredits: 12,
        courses: [
          { code: 'CE401', name: 'Trí tuệ nhân tạo nhúng (Edge AI)', credits: 3, isRequired: false },
          { code: 'CE402', name: 'Xử lý ảnh số & Thị giác máy tính', credits: 3, isRequired: false },
          { code: 'CE403', name: 'Robot và Hệ thống tự hành', credits: 3, isRequired: false },
          { code: 'CE404', name: 'An toàn bảo mật hệ thống nhúng', credits: 3, isRequired: false }
        ]
      },
      {
        id: 'grp_haui_gdtc',
        curriculumId: 'curriculum_haui_ce_k20',
        name: 'Giáo dục thể chất',
        code: 'GDTC',
        description: 'Rèn luyện thể lực và phong cách sống lành mạnh',
        order: 5,
        color: '#F4B5C2',
        requiredCredits: 4,
        courses: [
          { code: 'PHE101', name: 'Giáo dục thể chất 1 (Điền kinh / Bóng chuyền)', credits: 1, isRequired: true },
          { code: 'PHE102', name: 'Giáo dục thể chất 2 (Cầu lông / Bóng rổ)', credits: 1, isRequired: true },
          { code: 'PHE103', name: 'Giáo dục thể chất 3 (Bơi lội / Bóng đá)', credits: 1, isRequired: true }
        ]
      },
      {
        id: 'grp_haui_gdqp',
        curriculumId: 'curriculum_haui_ce_k20',
        name: 'Giáo dục quốc phòng & an ninh',
        code: 'GDQP',
        description: 'Đào tạo kiến thức quốc phòng và an ninh quốc gia',
        order: 6,
        color: '#F7D99A',
        requiredCredits: 8,
        courses: [
          { code: 'MIL101', name: 'Đường lối quốc phòng & an ninh của ĐCSVN', credits: 2, isRequired: true },
          { code: 'MIL102', name: 'Công tác quốc phòng và an ninh', credits: 2, isRequired: true },
          { code: 'MIL103', name: 'Quân sự chung', credits: 2, isRequired: true },
          { code: 'MIL104', name: 'Kỹ thuật chiến đấu bộ binh & chiến thuật', credits: 2, isRequired: true }
        ]
      }
    ]
  },
  {
    id: 'curriculum_haui_it_k20',
    universityId: 'haui',
    campusId: 'haui_hn',
    majorId: 'haui_it',
    majorName: 'Công nghệ thông tin',
    faculty: 'Khoa Công nghệ Thông tin',
    cohort: '20',
    academicYear: '2026–2027',
    curriculumVersion: '1.0',
    version: '1.0',
    isActive: true,
    isDefault: true,
    name: 'HaUI Công nghệ thông tin – Khóa 20 (2026–2027)',
    totalCreditsRequired: 142,
    description: 'Chương trình đào tạo Cử nhân/Kỹ sư CNTT chuẩn quốc tế, tập trung vào Kỹ thuật phần mềm, Trí tuệ nhân tạo và Đám mây.',
    groups: [
      {
        id: 'grp_haui_it_gdc',
        curriculumId: 'curriculum_haui_it_k20',
        name: 'Giáo dục đại cương',
        code: 'GDC',
        order: 1,
        color: '#AFC8F5',
        requiredCredits: 30,
        courses: [
          { code: 'MAT101', name: 'Giải tích 1', credits: 3, isRequired: true },
          { code: 'MAT102', name: 'Đại số tuyến tính', credits: 3, isRequired: true },
          { code: 'ENG202', name: 'Tiếng Anh học thuật & CNTT', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_haui_it_csn',
        curriculumId: 'curriculum_haui_it_k20',
        name: 'Cơ sở nhóm ngành CNTT',
        code: 'CSN',
        order: 2,
        color: '#A9DED5',
        requiredCredits: 42,
        courses: [
          { code: 'IT201', name: 'Lập trình hướng đối tượng (OOP Java/C#)', credits: 3, isRequired: true },
          { code: 'IT202', name: 'Cấu trúc dữ liệu & Thuật toán', credits: 3, isRequired: true },
          { code: 'IT203', name: 'Cơ sở dữ liệu quan hệ', credits: 3, isRequired: true },
          { code: 'IT204', name: 'Mạng máy tính', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_haui_it_cn',
        curriculumId: 'curriculum_haui_it_k20',
        name: 'Chuyên ngành CNTT & Phát triển Web/App',
        code: 'CN',
        order: 3,
        color: '#F5B28D',
        requiredCredits: 46,
        courses: [
          { code: 'IT301', name: 'Phát triển ứng dụng Web full-stack', credits: 4, isRequired: true },
          { code: 'IT302', name: 'Điện toán đám mây & DevOps', credits: 3, isRequired: true },
          { code: 'IT303', name: 'Trí tuệ nhân tạo và Machine Learning', credits: 3, isRequired: true },
          { code: 'IT304', name: 'Kiến trúc phần mềm phân tán', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_haui_it_tc',
        curriculumId: 'curriculum_haui_it_k20',
        name: 'Tự chọn định hướng nghề nghiệp',
        code: 'TC',
        order: 4,
        color: '#C7B7F4',
        requiredCredits: 12,
        courses: [
          { code: 'IT401', name: 'Phát triển ứng dụng di động Flutter/React Native', credits: 3, isRequired: false },
          { code: 'IT402', name: 'Khoa học dữ liệu lớn (Big Data)', credits: 3, isRequired: false }
        ]
      },
      {
        id: 'grp_haui_it_gdtc',
        curriculumId: 'curriculum_haui_it_k20',
        name: 'Giáo dục thể chất & GDQP',
        code: 'GDTC_GDQP',
        order: 5,
        color: '#F4B5C2',
        requiredCredits: 12,
        courses: [
          { code: 'PHE101', name: 'Giáo dục thể chất 1', credits: 1, isRequired: true },
          { code: 'MIL100', name: 'Giáo dục quốc phòng', credits: 8, isRequired: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. ĐẠI HỌC BÁCH KHOA HÀ NỘI (HUST)
  // =========================================================================
  {
    id: 'curriculum_hust_it1_k69',
    universityId: 'hust',
    campusId: 'hust_main',
    majorId: 'hust_it1',
    majorName: 'Khoa học máy tính (IT1)',
    faculty: 'Trường Công nghệ Thông tin và Truyền thông (SoICT)',
    cohort: '69',
    academicYear: '2026–2027',
    curriculumVersion: '1.0',
    version: '1.0',
    isActive: true,
    isDefault: true,
    name: 'HUST Khoa học máy tính (IT1) – Khóa 69 (2026–2027)',
    totalCreditsRequired: 160,
    description: 'Chương trình Cử nhân/Kỹ sư tài năng Khoa học máy tính Bách Khoa Hà Nội.',
    groups: [
      {
        id: 'grp_hust_kcbc',
        curriculumId: 'curriculum_hust_it1_k69',
        name: 'Khối kiến thức Toán và Khoa học cơ bản',
        code: 'TKHCB',
        order: 1,
        color: '#AFC8F5',
        requiredCredits: 38,
        courses: [
          { code: 'MI1111', name: 'Giải tích 1', credits: 4, isRequired: true },
          { code: 'MI1121', name: 'Giải tích 2', credits: 3, isRequired: true },
          { code: 'MI1141', name: 'Đại số', credits: 4, isRequired: true },
          { code: 'PH1110', name: 'Vật lý đại cương 1', credits: 3, isRequired: true },
          { code: 'PH1120', name: 'Vật lý đại cương 2', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_hust_csn',
        curriculumId: 'curriculum_hust_it1_k69',
        name: 'Khối kiến thức Cơ sở ngành CNTT',
        code: 'CSN',
        order: 2,
        color: '#A9DED5',
        requiredCredits: 50,
        courses: [
          { code: 'IT1110', name: 'Tin học đại cương', credits: 4, isRequired: true },
          { code: 'IT3011', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, isRequired: true },
          { code: 'IT3020', name: 'Toán rời rạc', credits: 3, isRequired: true },
          { code: 'IT3070', name: 'Nguyên lý hệ điều hành', credits: 3, isRequired: true },
          { code: 'IT3080', name: 'Mạng máy tính', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_hust_cn',
        curriculumId: 'curriculum_hust_it1_k69',
        name: 'Khối kiến thức Chuyên ngành Khoa học máy tính',
        code: 'CN',
        order: 3,
        color: '#F5B28D',
        requiredCredits: 52,
        courses: [
          { code: 'IT4040', name: 'Trí tuệ nhân tạo', credits: 3, isRequired: true },
          { code: 'IT4140', name: 'Học máy & Khai phá dữ liệu', credits: 3, isRequired: true },
          { code: 'IT4210', name: 'Xử lý ngôn ngữ tự nhiên (NLP)', credits: 3, isRequired: true },
          { code: 'IT4441', name: 'Thị giác máy tính', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_hust_gdtc_gdqp',
        curriculumId: 'curriculum_hust_it1_k69',
        name: 'Giáo dục thể chất & GDQP-AN',
        code: 'GDTC_GDQP',
        order: 4,
        color: '#F7D99A',
        requiredCredits: 20,
        courses: [
          { code: 'PE1010', name: 'Giáo dục thể chất 1 (Bơi)', credits: 1, isRequired: true },
          { code: 'PE1020', name: 'Giáo dục thể chất 2 (Bóng đá)', credits: 1, isRequired: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. ĐẠI HỌC KINH TẾ QUỐC DÂN (NEU)
  // =========================================================================
  {
    id: 'curriculum_neu_ba_k66',
    universityId: 'neu',
    campusId: 'neu_main',
    majorId: 'neu_ba',
    majorName: 'Quản trị kinh doanh',
    faculty: 'Viện Quản trị Kinh doanh',
    cohort: '66',
    academicYear: '2026–2027',
    curriculumVersion: '1.0',
    version: '1.0',
    isActive: true,
    isDefault: true,
    name: 'NEU Quản trị kinh doanh – Khóa 66 (2026–2027)',
    totalCreditsRequired: 130,
    description: 'Chương trình Cử nhân Quản trị Kinh doanh chuẩn kiểm định quốc tế ACBSP.',
    groups: [
      {
        id: 'grp_neu_gdc',
        curriculumId: 'curriculum_neu_ba_k66',
        name: 'Kiến thức giáo dục đại cương',
        code: 'GDC',
        order: 1,
        color: '#AFC8F5',
        requiredCredits: 36,
        courses: [
          { code: 'TOA101', name: 'Toán cao cấp cho kinh tế', credits: 3, isRequired: true },
          { code: 'XST102', name: 'Lý thuyết xác suất & Thống kê toán', credits: 3, isRequired: true },
          { code: 'ENG101', name: 'Tiếng Anh thương mại', credits: 3, isRequired: true },
          { code: 'TPL101', name: 'Pháp luật đại cương', credits: 2, isRequired: true }
        ]
      },
      {
        id: 'grp_neu_cskn',
        curriculumId: 'curriculum_neu_ba_k66',
        name: 'Kiến thức cơ sở khối ngành & ngành',
        code: 'CSKN',
        order: 2,
        color: '#A9DED5',
        requiredCredits: 44,
        courses: [
          { code: 'KTV101', name: 'Kinh tế vi mô 1', credits: 3, isRequired: true },
          { code: 'KTV102', name: 'Kinh tế vĩ mô 1', credits: 3, isRequired: true },
          { code: 'QTR101', name: 'Quản trị học', credits: 3, isRequired: true },
          { code: 'MKT101', name: 'Nguyên lý Marketing', credits: 3, isRequired: true },
          { code: 'KTN101', name: 'Nguyên lý kế toán', credits: 3, isRequired: true },
          { code: 'TCH101', name: 'Tài chính - Tiền tệ', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_neu_cn',
        curriculumId: 'curriculum_neu_ba_k66',
        name: 'Kiến thức chuyên ngành Quản trị kinh doanh',
        code: 'CN',
        order: 3,
        color: '#F5B28D',
        requiredCredits: 38,
        courses: [
          { code: 'QTN101', name: 'Quản trị nhân lực', credits: 3, isRequired: true },
          { code: 'QTC101', name: 'Quản trị chiến lược', credits: 3, isRequired: true },
          { code: 'QTO101', name: 'Quản trị tác nghiệp & Chuỗi cung ứng', credits: 3, isRequired: true },
          { code: 'TCF101', name: 'Quản trị tài chính doanh nghiệp', credits: 3, isRequired: true }
        ]
      },
      {
        id: 'grp_neu_tc',
        curriculumId: 'curriculum_neu_ba_k66',
        name: 'Học phần tự chọn',
        code: 'TC',
        order: 4,
        color: '#C7B7F4',
        requiredCredits: 12,
        courses: [
          { code: 'TMDT1', name: 'Thương mại điện tử & Kinh doanh số', credits: 3, isRequired: false },
          { code: 'KNK101', name: 'Khởi nghiệp và Đổi mới sáng tạo', credits: 3, isRequired: false }
        ]
      }
    ]
  }
];

export const PRESET_MAJORS_BY_UNIVERSITY = {
  haui: [
    { id: 'haui_ce', name: 'Kỹ thuật máy tính', faculty: 'Khoa CNTT', code: '7480108', isDefault: true },
    { id: 'haui_it', name: 'Công nghệ thông tin', faculty: 'Khoa CNTT', code: '7480201' },
    { id: 'haui_se', name: 'Kỹ thuật phần mềm', faculty: 'Khoa CNTT', code: '7480103' },
    { id: 'haui_ee', name: 'Kỹ thuật điện - điện tử', faculty: 'Khoa Điện', code: '7520201' },
    { id: 'haui_me', name: 'Kỹ thuật cơ điện tử', faculty: 'Khoa Cơ khí', code: '7520114' },
    { id: 'haui_ba', name: 'Quản trị kinh doanh', faculty: 'Khoa QTKD', code: '7340101' }
  ],
  hust: [
    { id: 'hust_it1', name: 'Khoa học máy tính (IT1)', faculty: 'SoICT', code: 'IT1', isDefault: true },
    { id: 'hust_it2', name: 'Kỹ thuật máy tính (IT2)', faculty: 'SoICT', code: 'IT2' },
    { id: 'hust_ds', name: 'Khoa học dữ liệu và AI (IT-E10)', faculty: 'SoICT', code: 'IT-E10' },
    { id: 'hust_ee', name: 'Kỹ thuật điều khiển & Tự động hóa', faculty: 'SEEE', code: 'EE2' }
  ],
  vnu: [
    { id: 'vnu_it', name: 'Công nghệ thông tin', faculty: 'Trường ĐH Công nghệ (UET)', code: 'CN1', isDefault: true },
    { id: 'vnu_cs', name: 'Khoa học máy tính', faculty: 'Trường ĐH Công nghệ (UET)', code: 'CN8' }
  ],
  neu: [
    { id: 'neu_ba', name: 'Quản trị kinh doanh', faculty: 'Viện QTKD', code: '7340101', isDefault: true },
    { id: 'neu_fin', name: 'Tài chính - Ngân hàng', faculty: 'Viện NHTC', code: '7340201' },
    { id: 'neu_mkt', name: 'Marketing', faculty: 'Khoa Marketing', code: '7340115' }
  ],
  tmu: [
    { id: 'tmu_ec', name: 'Thương mại điện tử', faculty: 'Khoa TMĐT', code: '7340122', isDefault: true },
    { id: 'tmu_ba', name: 'Quản trị kinh doanh', faculty: 'Khoa QTKD', code: '7340101' },
    { id: 'tmu_log', name: 'Logistics & Chuỗi cung ứng', faculty: 'Khoa Logistics', code: '7510605' }
  ],
  utc: [
    { id: 'utc_it', name: 'Công nghệ thông tin', faculty: 'Khoa CNTT', code: '7480201', isDefault: true },
    { id: 'utc_ce', name: 'Kỹ thuật công trình xây dựng', faculty: 'Khoa Công trình', code: '7580201' }
  ]
};
