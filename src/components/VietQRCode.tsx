import React from 'react';

interface VietQRCodeProps {
  amount: number;
  orderInfo: string;
  bankAccount?: string;
  accountName?: string;
}

export const VietQRCode: React.FC<VietQRCodeProps> = ({
  amount,
  orderInfo,
  bankAccount = '0123456789',
  accountName = 'AIMS MEDIA STORE',
}) => {
  // Generate VietQR standard data
  // Format: https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NO}-{TEMPLATE}.jpg?amount={AMOUNT}&addInfo={INFO}
  const bankId = '970415'; // VietinBank
  const template = 'compact2'; // hoặc 'compact', 'compact2', 'qr_only'
  
  const qrImageUrl = `https://img.vietqr.io/image/${bankId}-${bankAccount}-${template}.jpg?amount=${amount}&addInfo=${encodeURIComponent(orderInfo)}&accountName=${encodeURIComponent(accountName)}`;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 shadow-lg">
      {/* VietQR Logo */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-red-600">VIET</span>
            <span className="text-2xl font-bold text-blue-600">QR</span>
          </div>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="bg-white p-4 rounded-lg shadow-md mx-auto" style={{ maxWidth: '320px' }}>
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <img
            src={qrImageUrl}
            alt="VietQR Payment QR Code"
            className="absolute inset-0 w-full h-full object-contain rounded"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4=';
            }}
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="mt-6 space-y-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Ngân hàng:</span>
            <span className="font-semibold text-gray-900">VietinBank</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Số tài khoản:</span>
            <span className="font-mono text-sm font-semibold text-gray-900">{bankAccount}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Chủ TK:</span>
            <span className="text-sm font-semibold text-gray-900">{accountName}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Số tiền:</span>
              <span className="text-lg font-bold text-red-600">
                {amount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="text-sm text-gray-600 mb-1">Nội dung:</div>
            <div className="text-sm font-medium text-gray-900 bg-gray-50 p-2 rounded">
              {orderInfo}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          📱 Quét mã QR bằng ứng dụng ngân hàng
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>✓ Tự động điền số tiền</span>
          <span>✓ Tự động điền nội dung</span>
        </div>
      </div>

      {/* Timer (optional) */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>Mã QR có hiệu lực trong 15 phút</span>
        </div>
      </div>
    </div>
  );
};

