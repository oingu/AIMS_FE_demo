# AIMS - An Internet Media Store

AIMS là ứng dụng web thương mại điện tử chuyên bán các sản phẩm media bao gồm sách, báo, CD và DVD. Ứng dụng được xây dựng với React, TypeScript và Tailwind CSS.

## 🚀 Tính năng

### Dành cho Khách hàng
- ✅ Xem danh sách sản phẩm với 20 sản phẩm ngẫu nhiên trên trang chủ
- ✅ Tìm kiếm sản phẩm theo tên hoặc danh mục
- ✅ Lọc sản phẩm theo khoảng giá
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Quản lý giỏ hàng (thêm, xóa, cập nhật số lượng)
- ✅ Kiểm tra tồn kho tự động
- ✅ Nhập thông tin giao hàng
- ✅ Tính phí vận chuyển tự động
- ✅ Thanh toán qua VietQR (QR Code) hoặc PayPal (Credit Card)
- ✅ Xác nhận hoặc hủy đơn hàng sau thanh toán

### Dành cho Quản trị viên / Quản lý sản phẩm
- ✅ Đăng nhập hệ thống
- ✅ Quản lý sản phẩm (xem, thêm, sửa, xóa)
- ✅ Xóa nhiều sản phẩm cùng lúc (tối đa 10)
- ✅ Tự động chuyển trạng thái "deactivated" cho sản phẩm còn hàng
- ✅ Quản lý đơn hàng
- ✅ Duyệt hoặc từ chối đơn hàng
- ✅ Xem 30 đơn hàng trên mỗi trang

## 📋 Yêu cầu hệ thống

- Node.js 16+
- npm hoặc yarn

## 🛠️ Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd AIMSProject
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng ở chế độ development:
```bash
npm run dev
```

4. Mở trình duyệt và truy cập:
```
http://localhost:3000
```

## 🏗️ Build cho Production

```bash
npm run build
```

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Các components tái sử dụng
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── context/            # React Context (Cart, Auth)
│   ├── CartContext.tsx
│   └── AuthContext.tsx
├── data/               # Mock data
│   └── mockProducts.ts
├── pages/              # Các trang chính
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Login.tsx
│   ├── OrderSuccess.tsx
│   └── admin/
│       ├── ProductManagement.tsx
│       └── OrderManagement.tsx
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Helper functions
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 UI/UX Features

- **Responsive Design**: Hoạt động tốt trên mọi thiết bị (mobile, tablet, desktop)
- **Modern UI**: Thiết kế hiện đại với Tailwind CSS
- **Smooth Animations**: Hiệu ứng chuyển động mượt mà
- **Loading States**: Trạng thái loading cho các thao tác
- **Error Handling**: Xử lý lỗi và hiển thị thông báo thân thiện
- **Form Validation**: Kiểm tra dữ liệu đầu vào

## 🔐 Tài khoản Demo

Để truy cập trang quản trị:
- **Username**: admin
- **Password**: admin123

## 💳 Tích hợp Thanh toán

### VietQR (QR Code)
- API: https://api.vietqr.vn/en
- Phương thức: Quét mã QR để thanh toán qua ứng dụng ngân hàng

### PayPal Sandbox (Credit Card)
- API: https://developer.paypal.com/docs/api/payments/v2/
- Environment: Sandbox
- Phương thức: Thanh toán bằng thẻ tín dụng/ghi nợ

## 📊 Tính năng đặc biệt

### Tính phí vận chuyển
- Miễn phí vận chuyển (tối đa 25.000đ) cho đơn hàng trên 100.000đ
- Hà Nội/HCM: 22.000đ cho 3kg đầu tiên, thêm 2.500đ/0.5kg
- Các tỉnh khác: 30.000đ cho 0.5kg đầu tiên, thêm 2.500đ/0.5kg

### Kiểm soát giá
- Giá hiện tại phải từ 30% đến 150% giá gốc
- Hiển thị VAT 10% trong quá trình thanh toán

### Quản lý tồn kho
- Kiểm tra tồn kho tự động khi thêm vào giỏ
- Cảnh báo khi sản phẩm sắp hết hàng
- Không cho phép đặt hàng khi hết hàng

## 🛣️ Routes

### Public Routes
- `/` - Trang chủ
- `/products` - Danh sách sản phẩm
- `/product/:id` - Chi tiết sản phẩm
- `/cart` - Giỏ hàng
- `/checkout` - Thanh toán
- `/order-success` - Xác nhận đơn hàng thành công
- `/login` - Đăng nhập

### Admin Routes
- `/admin/products` - Quản lý sản phẩm
- `/admin/orders` - Quản lý đơn hàng

## 🧪 Testing

Ứng dụng sử dụng mock data để demo. Trong môi trường thực tế, cần tích hợp với:
- Backend API
- Database
- Payment Gateway (VietQR API, PayPal API)
- Email Service
- File Storage

## 🚧 Các tính năng có thể mở rộng

- [ ] Đăng ký tài khoản khách hàng
- [ ] Lịch sử đơn hàng cho khách hàng
- [ ] Đánh giá và review sản phẩm
- [ ] Wishlist
- [ ] Thông báo SMS/Push notification
- [ ] Tích hợp thêm phương thức thanh toán
- [ ] Quản lý kho hàng chi tiết
- [ ] Báo cáo thống kê
- [ ] Export dữ liệu

## 📝 License

MIT License

## 👥 Contributors

- Đinh Khải Đăng - Developer

## 📧 Contact

Để biết thêm thông tin, vui lòng liên hệ: support@aims.vn

