import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">AIMS Media Store</h3>
            <p className="text-sm leading-relaxed">
              Cửa hàng truyền thông trực tuyến cung cấp sách, báo, CD, DVD chất lượng cao với giá cả phải chăng.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products?category=book"
                  className="hover:text-primary-400 transition-colors"
                >
                  Sách
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=newspaper"
                  className="hover:text-primary-400 transition-colors"
                >
                  Báo
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=cd"
                  className="hover:text-primary-400 transition-colors"
                >
                  CD
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=dvd"
                  className="hover:text-primary-400 transition-colors"
                >
                  DVD
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Đại học Bách Khoa Hà Nội, Hai Bà Trưng, Hà Nội</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>(+84) 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>support@aims.vn</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 AIMS Media Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

