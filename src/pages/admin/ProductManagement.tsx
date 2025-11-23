import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react';
import { Product } from '../../types';
import { mockProducts } from '../../data/mockProducts';
import { formatCurrency, getProductCategoryLabel } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export const ProductManagement: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.size > 10) {
      alert('Không thể xóa quá 10 sản phẩm cùng lúc');
      return;
    }

    const cannotDelete = Array.from(selectedProducts).filter((id) => {
      const product = products.find((p) => p.id === id);
      return product && product.stock > 0;
    });

    if (cannotDelete.length > 0) {
      alert('Một số sản phẩm không thể xóa vì còn hàng trong kho. Chúng sẽ được chuyển sang trạng thái "deactivated".');
    }

    // Simulate deletion/deactivation
    setProducts(
      products.map((p) =>
        selectedProducts.has(p.id)
          ? p.stock > 0
            ? { ...p, status: 'deactivated' as const }
            : p
          : p
      )
    );
    setSelectedProducts(new Set());
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Xin chào, <span className="font-medium">{user?.username}</span>
          </p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">Tất cả danh mục</option>
              <option value="book">Sách</option>
              <option value="newspaper">Báo</option>
              <option value="cd">CD</option>
              <option value="dvd">DVD</option>
            </select>
          </div>
        </div>

        {selectedProducts.size > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
            <span className="text-sm text-blue-800">
              Đã chọn {selectedProducts.size} sản phẩm
            </span>
            <button
              onClick={handleDeleteSelected}
              className="btn btn-danger text-sm flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      filteredProducts.every((p) => selectedProducts.has(p.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Không tìm thấy sản phẩm</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/50'}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.title}</p>
                          <p className="text-sm text-gray-500">{product.barcode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                        {getProductCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(product.currentPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.stock === 0
                            ? 'text-red-600'
                            : product.stock < 10
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status === 'active' ? 'Hoạt động' : 'Ngừng bán'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredProducts.length} sản phẩm
        </p>
        <div className="flex space-x-2">
          <button className="btn btn-secondary">Trước</button>
          <button className="btn btn-primary">1</button>
          <button className="btn btn-secondary">Sau</button>
        </div>
      </div>
    </div>
  );
};

