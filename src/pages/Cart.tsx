import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateVAT, calculateTotalWithVAT } from '../utils/helpers';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  // Check for stock availability
  const hasStockIssue = cart.items.some((item) => item.quantity > item.product.stock);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const stockIssue = item.quantity > item.product.stock;
            const available = item.product.stock;

            return (
              <div
                key={item.product.id}
                className={`card ${stockIssue ? 'border-2 border-red-300' : ''}`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-full sm:w-32 h-32 flex-shrink-0"
                  >
                    <img
                      src={item.product.imageUrl || 'https://via.placeholder.com/150'}
                      alt={item.product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="font-semibold text-lg text-gray-900 hover:text-primary-600 line-clamp-2"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">
                      Đơn giá: {formatCurrency(item.product.currentPrice)}
                    </p>

                    {stockIssue && (
                      <div className="flex items-start space-x-2 mt-2 p-2 bg-red-50 rounded">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-600">
                          <p className="font-medium">Không đủ hàng trong kho!</p>
                          <p>Chỉ còn {available} sản phẩm</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Số lượng:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              updateQuantity(
                                item.product.id,
                                Math.max(1, Math.min(val, item.product.stock))
                              );
                            }}
                            className="w-16 text-center border-x border-gray-300 py-1 outline-none"
                            min="1"
                            max={item.product.stock}
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="text-sm">Xóa</span>
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-2 text-right">
                      <span className="text-lg font-semibold text-primary-600">
                        {formatCurrency(item.product.currentPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng quan đơn hàng</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Tạm tính:</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>VAT (10%):</span>
                <span>{formatCurrency(calculateVAT(cart.totalPrice))}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">
                    {formatCurrency(calculateTotalWithVAT(cart.totalPrice))}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              * Phí vận chuyển sẽ được tính ở bước tiếp theo
            </p>

            {hasStockIssue && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">
                  Vui lòng cập nhật số lượng sản phẩm trước khi tiếp tục
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              disabled={hasStockIssue}
              className="w-full btn btn-primary text-lg py-3 mb-3"
            >
              Tiến hành thanh toán
            </button>

            <Link
              to="/products"
              className="block text-center text-primary-600 hover:text-primary-700 text-sm"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

