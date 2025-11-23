import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Check, X, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from '../../types';
import {
  formatCurrency,
  formatDateTime,
  getOrderStatusLabel,
  getOrderStatusColor,
} from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [],
    deliveryInfo: {
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phoneNumber: '0123456789',
      address: '123 Đường ABC',
      city: 'Hà Nội',
    },
    subtotal: 500000,
    vat: 50000,
    deliveryFee: 22000,
    totalAmount: 572000,
    payment: {
      id: 'PAY-001',
      transactionId: 'TXN-001',
      content: 'Thanh toán đơn hàng ORD-001',
      amount: 572000,
      method: 'qrcode',
      datetime: new Date('2025-11-20'),
      status: 'success',
    },
    status: 'pending',
    createdAt: new Date('2025-11-20'),
    updatedAt: new Date('2025-11-20'),
  },
  {
    id: 'ORD-002',
    items: [],
    deliveryInfo: {
      fullName: 'Trần Thị B',
      email: 'tranthib@email.com',
      phoneNumber: '0987654321',
      address: '456 Đường XYZ',
      city: 'Hồ Chí Minh',
    },
    subtotal: 350000,
    vat: 35000,
    deliveryFee: 0,
    totalAmount: 385000,
    payment: {
      id: 'PAY-002',
      transactionId: 'TXN-002',
      content: 'Thanh toán đơn hàng ORD-002',
      amount: 385000,
      method: 'creditcard',
      datetime: new Date('2025-11-21'),
      status: 'success',
    },
    status: 'pending',
    createdAt: new Date('2025-11-21'),
    updatedAt: new Date('2025-11-21'),
  },
];

const ORDERS_PER_PAGE = 30;

export const OrderManagement: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const filteredOrders = orders.filter((order) =>
    statusFilter ? order.status === statusFilter : true
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const handleApproveOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: 'approved', updatedAt: new Date() }
          : order
      )
    );
    setSelectedOrder(null);
    alert('Đã duyệt đơn hàng thành công!');
  };

  const handleRejectOrder = (orderId: string) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: 'rejected', updatedAt: new Date() }
            : order
        )
      );
      setSelectedOrder(null);
      alert('Đã từ chối đơn hàng!');
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-1">
            Xin chào, <span className="font-medium">{user?.username}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lọc theo trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {paginatedOrders.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Không có đơn hàng nào</p>
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <div key={order.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.id}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Khách hàng:</span>{' '}
                      {order.deliveryInfo.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Số điện thoại:</span>{' '}
                      {order.deliveryInfo.phoneNumber}
                    </p>
                    <p>
                      <span className="font-medium">Tổng tiền:</span>{' '}
                      <span className="font-semibold text-primary-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Ngày đặt:</span>{' '}
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="btn btn-secondary flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Chi tiết</span>
                  </button>
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="btn bg-green-600 text-white hover:bg-green-700 flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Duyệt</span>
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="btn btn-danger flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Từ chối</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước</span>
          </button>
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary flex items-center space-x-1"
          >
            <span>Sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết đơn hàng {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông tin giao hàng
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Họ tên:</span>{' '}
                    <span className="font-medium">{selectedOrder.deliveryInfo.fullName}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span>{' '}
                    <span className="font-medium">{selectedOrder.deliveryInfo.email}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Số điện thoại:</span>{' '}
                    <span className="font-medium">
                      {selectedOrder.deliveryInfo.phoneNumber}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Địa chỉ:</span>{' '}
                    <span className="font-medium">
                      {selectedOrder.deliveryInfo.address},{' '}
                      {selectedOrder.deliveryInfo.city}
                    </span>
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông tin thanh toán
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Mã giao dịch:</span>{' '}
                    <span className="font-medium">
                      {selectedOrder.payment.transactionId}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Phương thức:</span>{' '}
                    <span className="font-medium">
                      {selectedOrder.payment.method === 'qrcode'
                        ? 'VietQR'
                        : 'Thẻ tín dụng'}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Thời gian:</span>{' '}
                    <span className="font-medium">
                      {formatDateTime(selectedOrder.payment.datetime)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tổng quan đơn hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (10%):</span>
                    <span>{formatCurrency(selectedOrder.vat)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>
                      {selectedOrder.deliveryFee === 0
                        ? 'Miễn phí'
                        : formatCurrency(selectedOrder.deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-primary-600">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedOrder.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApproveOrder(selectedOrder.id)}
                    className="btn bg-green-600 text-white hover:bg-green-700 flex-1 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Duyệt đơn hàng</span>
                  </button>
                  <button
                    onClick={() => handleRejectOrder(selectedOrder.id)}
                    className="btn btn-danger flex-1 flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Từ chối</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

