# 🎓 OuraDesk — Ứng Dụng Thời Khóa Biểu & Quản Lý Học Tập Thông Minh

> **"Chụp TKB. Phần còn lại để app lo."**

OuraDesk là nền tảng thời khóa biểu & theo dõi học tập thế hệ mới được thiết kế đặc thù cho học sinh, sinh viên Việt Nam với hai chế độ linh hoạt: **Đại học (University)** và **Trung học phổ thông (THPT)**.

---

## 🌟 Tính Năng Nổi Bật

- ⏱️ **Lưới Thời Khóa Biểu Chuẩn Khung Giờ**: Tính toán tọa độ toán học chính xác theo từng Tiết học / Giờ ra chơi từ University Time Profile (HaUI, HUST, NEU...) hoặc THPT Time Profile.
- ⚡ **Recurrence & Date Range Engine**: Môn học chỉ xuất hiện đúng trong khoảng thời gian diễn ra (`startDate <= date <= endDate`), tự động bỏ qua ngày nghỉ lễ, Tết Nguyên Đán theo `AcademicCalendar`.
- 📅 **Calendar Engine & Đồng Bộ Real-time**: Đồng bộ Single Source of Truth giữa Mini Calendar, Lịch Tuần, Dashboard và Companion Panel.
- 📝 **Quản Lý Deadline & Bài Tập (Local-First)**: Kiến trúc Repository Pattern (`AssignmentRepository` & `HomeworkRepository`) với cơ chế Seed Versioning, lưu trữ dữ liệu vĩnh viễn không mất khi F5.
- 🎨 **Giao Diện Glassmorphism & Đa Chủ Đề**: Hỗ trợ 4 bảng màu (Pastel Clay, Midnight Blue, Mint Green, Sunset Orange) cùng chế độ hiển thị tối ưu cho Desktop và Mobile.
- 📱 **Xuất Hình Nền Khóa 9:16**: Tự động sinh ảnh hình nền khóa điện thoại sắc nét chỉ với 1 click.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu
- Trình duyệt web hiện đại (Chrome, Edge, Firefox, Safari).
- Python 3 (tùy chọn để khởi chạy No-Cache server) hoặc Live Server trong VS Code.

### Khởi Chạy Nhanh

1. **Clone repository:**
   ```bash
   git clone https://github.com/DoanHungdev/<repo-name>.git
   cd <repo-name>
   ```

2. **Chạy server cục bộ:**
   ```bash
   python server.py
   ```
   hoặc click trực tiếp file `run_app.bat`.

3. **Mở trình duyệt:**
   Truy cập `http://localhost:8088/` để trải nghiệm ứng dụng.

---

## 🏗️ Cấu Trúc Dự Án

```
StudentTimetable/
├── css/
│   └── styles.css              # Glassmorphism & Responsive Design
├── js/
│   ├── app.js                  # Core Application Controller
│   ├── components/             # UI Components (Timetable, Dashboard, Modals...)
│   ├── data/                   # Academic Calendar & Mock Data
│   ├── repositories/           # Local-First Repository Pattern
│   ├── theme/                  # Theme Engine
│   └── utils/                  # Engines (Calendar, Schedule, Timetable, Profile)
├── index.html                  # Main Entry Point
├── server.py                   # Lightweight No-Cache HTTP Server
└── run_app.bat                 # 1-Click Windows Launcher
```

---

## 📄 Bản Quyền & Tác Giả

- **Tác giả:** [DoanHungdev](https://github.com/DoanHungdev)
- **Email:** `tuanhung14110@gmail.com`
