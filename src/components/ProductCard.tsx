import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, getProductCategoryLabel, truncateText } from '../utils/helpers';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, quantity);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
          {getProductCategoryLabel(product.category)}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Còn {product.stock} sản phẩm
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Hết hàng
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(product.currentPrice)}
          </span>
          {product.currentPrice < product.originalValue && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.originalValue)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="flex items-center space-x-2 pt-2">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                e.preventDefault();
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, Math.min(val, product.stock)));
              }}
              className="w-12 text-center border-x border-gray-300 py-1 outline-none"
              min="1"
              max={product.stock}
              onClick={(e) => e.preventDefault()}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuantity(Math.min(product.stock, quantity + 1));
              }}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showAddedMessage ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Đã thêm</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">Thêm vào giỏ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

