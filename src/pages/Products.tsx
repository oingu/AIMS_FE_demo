import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Product, PriceRange } from '../types';
import { mockProducts, searchProducts, filterProductsByPrice } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';

const priceRanges: PriceRange[] = [
  { min: 0, max: 100000, label: 'Dưới 100.000đ' },
  { min: 100000, max: 200000, label: '100.000đ - 200.000đ' },
  { min: 200000, max: 300000, label: '200.000đ - 300.000đ' },
  { min: 300000, max: 400000, label: '300.000đ - 400.000đ' },
  { min: 400000, max: null, label: 'Trên 400.000đ' },
];

export const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');

    let results = mockProducts;

    // Search by query
    if (searchQuery) {
      results = searchProducts(searchQuery);
    }

    // Filter by category from URL
    if (categoryQuery) {
      results = results.filter((p) => p.category === categoryQuery);
      setSelectedCategories(new Set([categoryQuery]));
    }

    setProducts(results);
    setFilteredProducts(results);
  }, [searchParams]);

  useEffect(() => {
    let results = [...products];

    // Filter by multiple categories
    if (selectedCategories.size > 0) {
      results = results.filter((p) => selectedCategories.has(p.category));
    }

    // Filter by price range
    if (selectedPriceRange) {
      results = filterProductsByPrice(
        results,
        selectedPriceRange.min,
        selectedPriceRange.max
      );
    }

    setFilteredProducts(results);
  }, [products, selectedCategories, selectedPriceRange]);

  const handleCategoryChange = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setSelectedPriceRange(
      selectedPriceRange?.min === range.min ? null : range
    );
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedPriceRange(null);
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="card sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
              {(selectedCategories.size > 0 || selectedPriceRange) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Danh mục
                {selectedCategories.size > 0 && (
                  <span className="ml-2 text-sm text-primary-600">
                    ({selectedCategories.size} đã chọn)
                  </span>
                )}
              </h3>
              <div className="space-y-2">
                {['book', 'newspaper', 'cd', 'dvd'].map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700">
                      {category === 'book' && 'Sách'}
                      {category === 'newspaper' && 'Báo'}
                      {category === 'cd' && 'CD'}
                      {category === 'dvd' && 'DVD'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Giá</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={`${range.min}-${range.max}`}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPriceRange?.min === range.min}
                      onChange={() => handlePriceRangeChange(range)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700 text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Bộ lọc</span>
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
                {(selectedCategories.size > 0 || selectedPriceRange) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Danh mục
                    {selectedCategories.size > 0 && (
                      <span className="ml-2 text-sm text-primary-600">
                        ({selectedCategories.size} đã chọn)
                      </span>
                    )}
                  </h3>
                  <div className="space-y-2">
                    {['book', 'newspaper', 'cd', 'dvd'].map((category) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.has(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-gray-700">
                          {category === 'book' && 'Sách'}
                          {category === 'newspaper' && 'Báo'}
                          {category === 'cd' && 'CD'}
                          {category === 'dvd' && 'DVD'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Giá</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={`${range.min}-${range.max}`}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPriceRange?.min === range.min}
                          onChange={() => handlePriceRangeChange(range)}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-gray-700 text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {searchParams.get('search')
                ? `Kết quả tìm kiếm: "${searchParams.get('search')}"`
                : 'Tất cả sản phẩm'}
            </h1>
            <p className="text-gray-600">
              Tìm thấy {filteredProducts.length} sản phẩm
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 card">
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm phù hợp
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

