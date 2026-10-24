# Thiệp sinh nhật Hạ Vy — source project

## Cấu trúc thư mục

- `index.html`: trang thiệp và cấu trúc giao diện.
- `src/css/style.css`: toàn bộ kiểu dáng và hiệu ứng.
- `src/js/app.js`: bộ đếm, bánh 3D, hộp quà, lời chúc và form khách gửi.
- `database/supabase-loi-chuc.sql`: SQL khởi tạo bảng lời chúc Supabase.
- `database/supabase-loi-chuc-dung-chung-mau.js`: mã mẫu kết nối Supabase rời.
- `assets/`: ảnh và nhạc đã được cung cấp.

## Chạy thử

Có thể mở `index.html` trực tiếp để xem phần giao diện. Để tránh giới hạn trình duyệt khi chạy file cục bộ, nên chạy web server tĩnh từ thư mục dự án, ví dụ:

```bash
python3 -m http.server 8000
```

Sau đó mở `http://localhost:8000`.

## Bật lời chúc dùng chung

1. Tạo dự án Supabase.
2. Chạy `database/supabase-loi-chuc.sql` trong SQL Editor.
3. Mở `src/js/app.js`, thay `https://PROJECT_ID.supabase.co` và `DAN_PUBLISHABLE_OR_ANON_KEY_VAO_DAY` bằng Project URL và publishable/anon public key. Không bao giờ đưa `service_role` key vào trang web.
4. Đưa toàn bộ thư mục dự án lên cùng một dịch vụ hosting tĩnh để khách truy cập cùng URL.

Mã hiện tải lời chúc mới nhất và đồng bộ khoảng 8 giây/lần. Ảnh và MP3 được đóng gói trong `assets`; HTML hiện tại chưa tự phát nhạc hoặc hiển thị ảnh.
