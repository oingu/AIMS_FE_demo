import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail, Package } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Đặt hàng thành công!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Cảm ơn bạn đã mua sắm tại AIMS Media Store. Đơn hàng của bạn đã được xác nhận
          và đang được xử lý.
        </p>

        <div className="card text-left mb-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email xác nhận đã được gửi
                </h3>
                <p className="text-sm text-gray-600">
                  Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn. Vui
                  lòng kiểm tra hộp thư đến hoặc thư rác.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Package className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Đơn hàng đang được xử lý
                </h3>
                <p className="text-sm text-gray-600">
                  Đơn hàng của bạn đang chờ xác nhận từ bộ phận quản lý. Chúng tôi sẽ thông
                  báo cho bạn khi đơn hàng được duyệt và bắt đầu giao hàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Về trang chủ
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

