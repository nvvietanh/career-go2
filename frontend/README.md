# Website tuyển dụng - tìm kiếm việc làm CareerGo

## Demo sản phẩm:
https://career-go2.vercel.app/

## Triển khai localhost:

- Cài đặt NodeJS, MongoDB
- Các biến môi trường trong /backend/.env:
  - JWT_SECRET=<chuỗi khóa jwt>
  - PORT="5000"
  - MONGO_URI=<đường dẫn cơ sở dữ liệu MongoDB>
- Các biến môi trường trong /frontend/.env:
  - REACT_APP_SERVER_URL=http://localhost:5000
- Chạy `npm install` tại đường dẫn của backend
- Chạy backend server: `npm start` tại đường dẫn của backend
- Backend sử dụng cổng 5000.
- Chạy `npm install --force` tại đường dẫn của frontend
- Chạy frontend server: `npm start` tại đường dẫn của frontend
- Frontend sử dụng cổng 3000
- Mở URL `http://localhost:3000/` để truy cập website.

