import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  formatCurrency,
  calculateVAT,
  calculateTotalWithVAT,
  calculateDeliveryFee,
  isValidEmail,
  isValidPhoneNumber,
} from '../utils/helpers';
import { DeliveryInfo, PaymentMethod } from '../types';

type CheckoutStep = 'delivery' | 'payment' | 'confirm';

export const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qrcode');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !orderConfirmed) {
      navigate('/cart');
    }
  }, [cart.items, navigate, orderConfirmed]);

  // Calculate delivery fee when city or cart changes
  useEffect(() => {
    if (deliveryInfo.city && cart.items.length > 0) {
      const totalWeight = cart.items.reduce(
        (sum, item) => sum + item.product.weight * item.quantity,
        0
      );
      const fee = calculateDeliveryFee({
        totalWeight,
        city: deliveryInfo.city,
        orderValue: cart.totalPrice,
      });
      setDeliveryFee(fee);
    }
  }, [deliveryInfo.city, cart]);

  const validateDeliveryInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!deliveryInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!deliveryInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!isValidEmail(deliveryInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!deliveryInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!isValidPhoneNumber(deliveryInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (!deliveryInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    if (!deliveryInfo.city.trim()) {
      newErrors.city = 'Vui lòng chọn thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDeliveryInfo()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSubmit = () => {
    setPaymentProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      setCurrentStep('confirm');
    }, 2000);
  };

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    clearCart();
    // Show success message and redirect
    setTimeout(() => {
      navigate('/order-success');
    }, 1500);
  };

  const totalWithVAT = calculateTotalWithVAT(cart.totalPrice);
  const grandTotal = totalWithVAT + deliveryFee;

  return (
    <div className="container-custom py-8">
      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'delivery'
                  ? 'bg-primary-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              {currentStep !== 'delivery' ? <Check className="w-6 h-6" /> : '1'}
            </div>
            <span className="text-sm mt-2 font-medium">Thông tin giao hàng</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2">
            <div
              className={`h-full ${
                currentStep !== 'delivery' ? 'bg-green-600' : 'bg-gray-300'
              } transition-all`}
            />
          </div>
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'payment'
                  ? 'bg-primary-600 text-white'
                  : currentStep === 'confirm'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {currentStep === 'confirm' ? <Check className="w-6 h-6" /> : '2'}
            </div>
            <span className="text-sm mt-2 font-medium">Thanh toán</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2">
            <div
              className={`h-full ${
                currentStep === 'confirm' ? 'bg-green-600' : 'bg-gray-300'
              } transition-all`}
            />
          </div>
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'confirm'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              3
            </div>
            <span className="text-sm mt-2 font-medium">Xác nhận</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Delivery Info */}
          {currentStep === 'delivery' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông tin giao hàng
              </h2>
              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.fullName}
                    onChange={(e) =>
                      setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })
                    }
                    className={`input ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={deliveryInfo.email}
                    onChange={(e) =>
                      setDeliveryInfo({ ...deliveryInfo, email: e.target.value })
                    }
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={deliveryInfo.phoneNumber}
                    onChange={(e) =>
                      setDeliveryInfo({ ...deliveryInfo, phoneNumber: e.target.value })
                    }
                    className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={deliveryInfo.city}
                    onChange={(e) =>
                      setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
                    }
                    className={`input ${errors.city ? 'border-red-500' : ''}`}
                  >
                    <option value="">Chọn thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Khác">Tỉnh/Thành phố khác</option>
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={deliveryInfo.address}
                    onChange={(e) =>
                      setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
                    }
                    rows={3}
                    className={`input ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại giỏ hàng</span>
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Tiếp tục
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 'payment' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Phương thức thanh toán
              </h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="qrcode"
                    checked={paymentMethod === 'qrcode'}
                    onChange={() => setPaymentMethod('qrcode')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <QrCode className="w-6 h-6 text-primary-600" />
                      <span className="font-semibold text-gray-900">
                        Thanh toán VietQR
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Quét mã QR để thanh toán qua ứng dụng ngân hàng
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="creditcard"
                    checked={paymentMethod === 'creditcard'}
                    onChange={() => setPaymentMethod('creditcard')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-6 h-6 text-primary-600" />
                      <span className="font-semibold text-gray-900">
                        Thẻ tín dụng/ghi nợ
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Thanh toán qua PayPal với thẻ tín dụng hoặc ghi nợ
                    </p>
                  </div>
                </label>
              </div>

              {/* Payment Demo UI */}
              {paymentMethod === 'qrcode' ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="w-64 h-64 bg-white mx-auto mb-4 flex items-center justify-center border-2 border-gray-300 rounded-lg">
                    <div className="text-center">
                      <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Mã QR thanh toán</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Quét mã QR bằng ứng dụng ngân hàng của bạn
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    Số tiền: {formatCurrency(grandTotal)}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số thẻ
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày hết hạn
                        </label>
                        <input type="text" placeholder="MM/YY" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input type="text" placeholder="123" className="input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-6">
                <button
                  onClick={() => setCurrentStep('delivery')}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={paymentProcessing}
                  className="btn btn-primary flex-1"
                >
                  {paymentProcessing ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 'confirm' && (
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h2>
                <p className="text-gray-600">
                  Vui lòng xác nhận đơn hàng để hoàn tất
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông tin giao hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Họ tên:</span>{' '}
                    <span className="font-medium">{deliveryInfo.fullName}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span>{' '}
                    <span className="font-medium">{deliveryInfo.email}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Số điện thoại:</span>{' '}
                    <span className="font-medium">{deliveryInfo.phoneNumber}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Địa chỉ:</span>{' '}
                    <span className="font-medium">
                      {deliveryInfo.address}, {deliveryInfo.city}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Thông tin chi tiết đơn hàng sẽ được gửi đến email của bạn sau khi xác
                  nhận.
                </p>
              </div>

              <div className="flex space-x-4">
                <button className="btn btn-secondary flex-1">Hủy đơn hàng</button>
                <button
                  onClick={handleConfirmOrder}
                  className="btn btn-primary flex-1"
                >
                  Xác nhận đơn hàng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng</h3>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex space-x-3">
                  <img
                    src={item.product.imageUrl || 'https://via.placeholder.com/60'}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.product.title}
                    </p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.product.currentPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Tạm tính:</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>VAT (10%):</span>
                <span>{formatCurrency(calculateVAT(cart.totalPrice))}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí vận chuyển:</span>
                <span>
                  {deliveryFee === 0 && deliveryInfo.city
                    ? 'Miễn phí'
                    : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

