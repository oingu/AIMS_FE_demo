import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Newspaper, Disc, Film } from 'lucide-react';
import { Product } from '../types';
import { getRandomProducts } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load 20 random products on mount
    setProducts(getRandomProducts(20));
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">
              Chào mừng đến với AIMS Media Store
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Khám phá hàng ngàn sản phẩm sách, báo, CD, DVD chất lượng cao với giá tốt nhất
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Xem tất cả sản phẩm</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/products?category=book"
            className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <BookOpen className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                Sách
              </h3>
              <p className="text-gray-600 text-sm">
                Khám phá thế giới tri thức qua hàng ngàn đầu sách
              </p>
            </div>
          </Link>

          <Link
            to="/products?category=newspaper"
            className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Newspaper className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                Báo
              </h3>
              <p className="text-gray-600 text-sm">
                Cập nhật tin tức mới nhất hàng ngày
              </p>
            </div>
          </Link>

          <Link
            to="/products?category=cd"
            className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Disc className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                CD
              </h3>
              <p className="text-gray-600 text-sm">
                Thưởng thức âm nhạc chất lượng cao
              </p>
            </div>
          </Link>

          <Link
            to="/products?category=dvd"
            className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Film className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                DVD
              </h3>
              <p className="text-gray-600 text-sm">
                Bộ sưu tập phim đa dạng và hấp dẫn
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">
                Sản phẩm chính hãng, đảm bảo chất lượng tốt nhất
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600">
                Giao hàng nhanh chóng trong 1-3 ngày
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán an toàn</h3>
              <p className="text-gray-600">
                Nhiều phương thức thanh toán bảo mật
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

