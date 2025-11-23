import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { Product, Book, CD, DVD, Newspaper } from '../types';
import { getProductById } from '../data/mockProducts';
import { formatCurrency, formatDate, getProductCategoryLabel } from '../utils/helpers';
import { useCart } from '../context/CartContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="card">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/600'}
              alt={product.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded mb-2">
              {getProductCategoryLabel(product.category)}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-primary-600">
                {formatCurrency(product.currentPrice)}
              </span>
              {product.currentPrice < product.originalValue && (
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.originalValue)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Giá đã bao gồm VAT 10%: {formatCurrency(product.currentPrice * 1.1)}
            </p>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <p className="text-green-600 font-medium">
                ✓ Còn {product.stock} sản phẩm
              </p>
            ) : (
              <p className="text-red-600 font-medium">✗ Hết hàng</p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium">Số lượng:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(val, product.stock)));
                  }}
                  className="w-20 text-center border-x border-gray-300 py-2 outline-none"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full btn btn-primary flex items-center justify-center space-x-2 text-lg py-3"
            >
              {showAddedMessage ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>Đã thêm vào giỏ hàng</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>Thêm vào giỏ hàng</span>
                </>
              )}
            </button>
          </div>

          {/* Product Specifications */}
          <div className="card bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin chi tiết
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="text-gray-600 w-40">Mã sản phẩm:</span>
                <span className="text-gray-900 font-medium">{product.barcode}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40">Tình trạng:</span>
                <span className="text-gray-900 font-medium">{product.condition}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40">Kích thước:</span>
                <span className="text-gray-900 font-medium">
                  {product.dimensions.height} x {product.dimensions.width} x{' '}
                  {product.dimensions.length} cm
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40">Trọng lượng:</span>
                <span className="text-gray-900 font-medium">{product.weight} kg</span>
              </div>

              {/* Category-specific details */}
              {product.category === 'book' && (
                <>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Tác giả:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as Book).authors.join(', ')}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Nhà xuất bản:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as Book).publisher}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Loại bìa:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as Book).coverType === 'hardcover' ? 'Bìa cứng' : 'Bìa mềm'}
                    </span>
                  </div>
                  {(product as Book).numberOfPages && (
                    <div className="flex">
                      <span className="text-gray-600 w-40">Số trang:</span>
                      <span className="text-gray-900 font-medium">
                        {(product as Book).numberOfPages}
                      </span>
                    </div>
                  )}
                </>
              )}

              {product.category === 'newspaper' && (
                <>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Tổng biên tập:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as Newspaper).editorInChief}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Nhà xuất bản:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as Newspaper).publisher}
                    </span>
                  </div>
                  {(product as Newspaper).issueNumber && (
                    <div className="flex">
                      <span className="text-gray-600 w-40">Số báo:</span>
                      <span className="text-gray-900 font-medium">
                        {(product as Newspaper).issueNumber}
                      </span>
                    </div>
                  )}
                </>
              )}

              {product.category === 'cd' && (
                <>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Nghệ sĩ:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as CD).artists.join(', ')}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Hãng thu âm:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as CD).recordLabel}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Thể loại:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as CD).genre}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 mb-2">Danh sách bài hát:</span>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      {(product as CD).tracks.map((track, index) => (
                        <li key={index} className="text-gray-900">
                          {track.title} ({Math.floor(track.length / 60)}:
                          {(track.length % 60).toString().padStart(2, '0')})
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              )}

              {product.category === 'dvd' && (
                <>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Đạo diễn:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as DVD).director}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Loại đĩa:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as DVD).discType}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Thời lượng:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as DVD).runtime} phút
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-40">Phụ đề:</span>
                    <span className="text-gray-900 font-medium">
                      {(product as DVD).subtitles.join(', ')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

