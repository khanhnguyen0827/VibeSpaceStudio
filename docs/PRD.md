# Tài Liệu Yêu Cầu Sản Phẩm (PRD) - VibeSpace

## 1. Tổng Quan
**VibeSpace** là một ứng dụng web tạo không gian làm việc tập trung cá nhân, tối giản và có tính thẩm mỹ cao. Mục tiêu của ứng dụng là giúp học sinh, sinh viên, lập trình viên và người viết lách dễ dàng đi vào trạng thái tập trung sâu (flow state) bằng cách kết hợp nhạc lofi, âm thanh tiếng ồn trắng (white noise) có thể tùy chỉnh, đồng hồ Pomodoro ở trung tâm, hình nền thư giãn sinh động và trình theo dõi công việc hàng ngày tinh gọn.

### 1.1 Triết Lý Cốt Lõi
- **Trải Nghiệm Mượt Mà (Zero Friction)**: Không yêu cầu đăng ký, không cần đăng nhập. Người dùng chỉ cần mở trang web là có thể sử dụng được ngay lập tức.
- **Thẩm Mỹ Cao Cấp (Premium Aesthetics)**: Thiết kế kính mờ hiện đại (glassmorphism - `backdrop-filter: blur()`), hiệu ứng chuyển động vi mô (micro-interactions) mượt mà, bố cục lưới linh hoạt và hình nền động tạo không khí thư giãn.
- **Quyền Tự Quyết Của Người Dùng (User Autonomy)**: Người dùng có toàn quyền kiểm soát việc trộn âm thanh, lựa chọn không gian hình nền và quản lý danh sách công việc.

---

## 2. Đối Tượng Người Dùng & Các Tình Huống Sử Dụng
- **Học Sinh & Sinh Viên**: Cần một đồng hồ đếm giờ học tập có cấu trúc (Pomodoro) kết hợp nhạc nền nhẹ nhàng để tránh phân tâm từ môi trường xung quanh.
- **Người Làm Việc Từ Xa & Nhà Sáng Tạo**: Muốn tự tạo ra môi trường âm thanh riêng (kết hợp tiếng mưa, tiếng quán cà phê và nhạc lofi) để kích thích sự sáng tạo.
- **Người Theo Phong Cách Tối Giản**: Cần một không gian màn hình làm việc gọn gàng, đồng thời có thể hoạt động như một màn hình hiển thị không gian thư giãn.

---

## 3. Đặc Tả Chức Năng Chi Tiết

### 3.1 Giao Diện Người Dùng (UI/UX) - Phong Cách Modern Dark Glassmorphism
- **Chủ Đề (Theme)**: Mặc định là giao diện tối (Dark Mode) cao cấp.
- **Phong Cách Thiết Kế**: Sử dụng các bảng điều khiển kính mờ (frosted glass panels), viền phát sáng nhẹ, phông chữ hiện đại (như *Inter* hoặc *Outfit* từ Google Fonts).
- **Bố Cục (Layout)**:
  - **Lớp Nền (Backdrop)**: Hình nền hoặc video động hiển thị toàn màn hình.
  - **Trung Tâm**: Đồng hồ Pomodoro nổi bật ở giữa.
  - **Các Bảng Điều Khiển Nổi (Sidebar/Floating Panels)**: Bảng điều khiển nhạc, bộ trộn White Noise và danh sách công việc được thiết kế dưới dạng các thẻ nổi, có thể bật/tắt (thu gọn) để tối đa hóa không gian tập trung.

### 3.2 Chức Năng 1: Trình Phát Nhạc YouTube Lofi (YouTube Lofi Player)
- **Bài Nhạc Mặc Định**: Tự động phát một luồng phát trực tiếp (livestream) lofi phổ biến (ví dụ: Lofi Girl) ngay khi mở trang web.
- **Danh Sách Tuyển Chọn (Curated List)**: Một danh sách thả xuống/bảng kéo chứa các nguồn nhạc lofi được chọn sẵn (như *Chillhop*, *Jazz Lofi*, *Synthwave Lofi*) kèm thanh tìm kiếm và bộ lọc nhanh.
- **Nhập Link Trực Tiếp**: Hộp văn bản cho phép người dùng dán trực tiếp bất kỳ liên kết video hoặc danh sách phát (playlist) YouTube nào để phát nhạc.
- **Bộ Điều Khiển**:
  - Nút Phát (Play) / Tạm dừng (Pause).
  - Thanh trượt điều chỉnh âm lượng (từ 0% đến 100%) độc lập với âm lượng hệ thống.
  - Hiển thị thông tin: Tên bài hát đang phát (lấy thông tin thông qua API YouTube IFrame hoặc hiển thị tên kênh phát mặc định).

### 3.3 Chức Năng 2: Bộ Trộn Âm Thanh Tiếng Ồn Trắng (White Noise Mix Board)
- **Nguồn Âm Thanh**: Sử dụng các tệp âm thanh vòng lặp (loop) chất lượng cao, dung lượng nhẹ được lưu trữ trực tiếp trên hệ thống (`public/audio/`).
- **Các Âm Thanh Mặc Định**:
  1. Rain (Tiếng mưa rơi)
  2. Campfire (Lửa trại bập bùng)
  3. Wind (Tiếng gió xào xạc)
  4. Ocean Waves (Sóng biển rì rào)
  5. Cafe Ambient (Không gian quán cà phê)
  6. Forest Birds (Tiếng chim rừng thông)
  7. Keyboard Typing (Tiếng gõ phím cơ)
- **Bộ Điều Khiển**:
  - Thanh trượt điều chỉnh âm lượng độc lập (từ 0% đến 100%) cho từng âm thanh riêng biệt để tạo ra bản phối (mix) cá nhân.
  - Nút Bật/Tắt âm nhanh (Mute/Unmute) bên cạnh mỗi thanh trượt âm thanh.
  - Nút "Đặt Lại Bản Phối" (Reset Mix) để lập tức tắt toàn bộ âm thanh nền.
  - Cơ chế tải âm thanh chạy nền mượt mà, không bị khựng khi lặp lại vòng âm.

### 3.4 Chức Năng 3: Kho Ảnh Nền Sinh Động (Mixed Media Background Selector)
- **Thư Viện Hình Nền**: Một bảng chọn thư viện phân loại theo chủ đề phong cảnh (ví dụ: *Rừng thông*, *Đại dương*, *Núi non*, *Đô thị mưa*).
- **Định Dạng**:
  - **Ảnh Tĩnh Độ Phân Giải Cao**: Các tệp ảnh dạng WebP được tối ưu hóa để tải nhanh.
  - **Video Vòng Lặp Thư Giãn (Loopable Videos)**: Các video MP4 ngắn, chuyển động nhẹ nhàng (ví dụ: ngọn lửa trại bập bùng, hạt mưa rơi trên kính, sóng biển vỗ nhẹ).
- **Bộ Điều Khiển**:
  - Danh sách xem trước và chọn nhanh hình nền dạng lưới.
  - Thanh trượt điều chỉnh độ mờ (Opacity) của hình nền để người dùng tăng giảm độ sáng, đảm bảo chữ và các nút chức năng trên màn hình luôn rõ ràng dễ đọc.

### 3.5 Chức Năng 4: Đồng Hồ Pomodoro Ở Vị Trí Trung Tâm (Centered Pomodoro Timer)
- **Vị Trí**: Đặt nổi bật ở chính giữa màn hình. Hiển thị số đếm ngược rõ ràng kèm theo vòng tròn tiến trình hiển thị tỷ lệ thời gian còn lại.
- **Các Chế Độ**:
  - **Tập Trung (Focus Mode)**: Mặc định 25 phút.
  - **Nghỉ Ngắn (Short Break)**: Mặc định 5 phút.
  - **Nghỉ Dài (Long Break)**: Mặc định 15 phút.
- **Tùy Chỉnh**:
  - Bảng cài đặt cho phép người dùng thay đổi thời gian của các chế độ Focus, Short Break và Long Break theo ý muốn.
- **Thông Báo**:
  - Âm thanh thông báo nhẹ nhàng khi kết thúc một chu kỳ (lựa chọn giữa: *Tiếng chuông chùa nhẹ*, *Tiếng cồng gỗ*, *Tiếng bíp kỹ thuật số*).
  - Tên thẻ trình duyệt hiển thị thời gian đếm ngược trực tiếp (ví dụ: `[24:59] | VibeSpace`).
  - Tùy chọn tự động chuyển chế độ: Tự động chạy giờ nghỉ khi hết giờ học/làm việc, và ngược lại.

### 3.6 Chức Năng 5: Danh Sách Công Việc Thông Minh Hàng Ngày (Smart Daily Todo List)
- **Giao Diện**: Một thẻ nổi tinh tế nằm ở bên trái hoặc bên phải màn hình.
- **Tính Năng**:
  - Thêm công việc mới.
  - Đánh dấu hoàn thành (có hiệu ứng gạch ngang chữ và làm mờ công việc đã xong).
  - Chỉnh sửa nội dung công việc.
  - Xóa công việc.
- **Cơ Chế Tự Động Reset Thông Minh Hàng Ngày**:
  - Khi người dùng tải lại hoặc truy cập ứng dụng, hệ thống sẽ kiểm tra ngày hiện tại và so sánh với ngày truy cập gần nhất đã lưu.
  - Nếu phát hiện đã sang ngày mới:
    - **Tự động xóa các công việc đã hoàn thành** khỏi danh sách hiển thị để màn hình sạch sẽ hơn.
    - **Giữ lại các công việc chưa hoàn thành** và chuyển tiếp sang ngày hôm sau để người dùng tiếp tục làm việc mà không bị mất dữ liệu.

---

## 4. Ràng Buộc Kỹ Thuật & Lưu Trữ Dữ Liệu
- **Không Sử Dụng Cơ Sở Dữ Liệu**: Mọi thiết lập của người dùng, chủ đề hình nền đang chọn, tỷ lệ âm lượng nhạc và tiếng ồn trắng, thời gian Pomodoro tùy chỉnh và danh sách công việc sẽ được lưu trữ trực tiếp trên trình duyệt bằng `localStorage`.
- **Cấu Trúc Dữ Liệu Lưu Trữ (LocalStorage Schema)**:
  - `vibespace_settings`: `{ volumeYouTube: number, bgSelected: string, whiteNoiseMix: { rain: number, fire: number, ... }, pomodoroDurations: { focus: number, short: number, long: number } }`
  - `vibespace_todos`: `Array<{ id: string, text: string, completed: boolean, createdAt: string }>`
  - `vibespace_last_visit`: `string` (ví dụ: `"Thu Aug 06 2026"`)
- **Hoạt Động Ngoại Tuyến (Offline Reliability)**: Các nguồn âm thanh white noise và chức năng Pomodoro cùng Todo list vẫn hoạt động hoàn toàn bình thường ngay cả khi người dùng không có kết nối internet (chỉ có trình phát nhạc YouTube là yêu cầu kết nối mạng).
