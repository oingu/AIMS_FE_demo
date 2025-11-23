import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { ProductCategory, CoverType, DiscType } from '../../types';
import { isValidPriceRange, generateId } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

interface FormErrors {
  [key: string]: string;
}

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Basic fields
  const [barcode, setBarcode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('book');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('new');
  const [primaryColor, setPrimaryColor] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [weight, setWeight] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Book specific
  const [authors, setAuthors] = useState('');
  const [coverType, setCoverType] = useState<CoverType>('paperback');
  const [publisher, setPublisher] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [numberOfPages, setNumberOfPages] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');

  // Newspaper specific
  const [editorInChief, setEditorInChief] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [publicationFrequency, setPublicationFrequency] = useState('');
  const [issn, setIssn] = useState('');
  const [sections, setSections] = useState('');

  // CD specific
  const [artists, setArtists] = useState('');
  const [recordLabel, setRecordLabel] = useState('');
  const [tracks, setTracks] = useState('');

  // DVD specific
  const [discType, setDiscType] = useState<DiscType>('Blu-ray');
  const [director, setDirector] = useState('');
  const [runtime, setRuntime] = useState('');
  const [studio, setStudio] = useState('');
  const [subtitles, setSubtitles] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Basic validation
    if (!barcode.trim()) newErrors.barcode = 'Mã sản phẩm không được để trống';
    if (!title.trim()) newErrors.title = 'Tên sản phẩm không được để trống';
    if (!description.trim()) newErrors.description = 'Mô tả không được để trống';
    if (!condition.trim()) newErrors.condition = 'Tình trạng không được để trống';

    // Numeric validation
    if (!height || parseFloat(height) <= 0) newErrors.height = 'Chiều cao phải > 0';
    if (!width || parseFloat(width) <= 0) newErrors.width = 'Chiều rộng phải > 0';
    if (!length || parseFloat(length) <= 0) newErrors.length = 'Chiều dài phải > 0';
    if (!weight || parseFloat(weight) <= 0) newErrors.weight = 'Trọng lượng phải > 0';
    if (!stock || parseInt(stock) < 0) newErrors.stock = 'Số lượng phải >= 0';

    // Price validation
    const origValue = parseFloat(originalValue);
    const currPrice = parseFloat(currentPrice);

    if (!originalValue || origValue <= 0) {
      newErrors.originalValue = 'Giá gốc phải > 0';
    }
    if (!currentPrice || currPrice <= 0) {
      newErrors.currentPrice = 'Giá hiện tại phải > 0';
    }
    
    if (origValue > 0 && currPrice > 0) {
      if (!isValidPriceRange(currPrice, origValue)) {
        newErrors.currentPrice = 'Giá phải từ 30% đến 150% giá gốc';
      }
    }

    // Category specific validation
    switch (category) {
      case 'book':
        if (!authors.trim()) newErrors.authors = 'Tác giả không được để trống';
        if (!publisher.trim()) newErrors.publisher = 'Nhà xuất bản không được để trống';
        if (!publicationDate.trim()) newErrors.publicationDate = 'Ngày xuất bản không được để trống';
        break;
      case 'newspaper':
        if (!editorInChief.trim()) newErrors.editorInChief = 'Tổng biên tập không được để trống';
        if (!publisher.trim()) newErrors.publisher = 'Nhà xuất bản không được để trống';
        if (!publicationDate.trim()) newErrors.publicationDate = 'Ngày xuất bản không được để trống';
        break;
      case 'cd':
        if (!artists.trim()) newErrors.artists = 'Nghệ sĩ không được để trống';
        if (!recordLabel.trim()) newErrors.recordLabel = 'Hãng thu âm không được để trống';
        if (!genre.trim()) newErrors.genre = 'Thể loại không được để trống';
        if (!tracks.trim()) newErrors.tracks = 'Danh sách bài hát không được để trống';
        break;
      case 'dvd':
        if (!director.trim()) newErrors.director = 'Đạo diễn không được để trống';
        if (!studio.trim()) newErrors.studio = 'Studio không được để trống';
        if (!language.trim()) newErrors.language = 'Ngôn ngữ không được để trống';
        if (!runtime || parseInt(runtime) <= 0) newErrors.runtime = 'Thời lượng phải > 0';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Generate product data
    const productId = generateId();
    const now = new Date();

    const baseProduct = {
      id: productId,
      barcode,
      title,
      category,
      description,
      condition,
      primaryColor,
      dimensions: {
        height: parseFloat(height),
        width: parseFloat(width),
        length: parseFloat(length),
      },
      weight: parseFloat(weight),
      originalValue: parseFloat(originalValue),
      currentPrice: parseFloat(currentPrice),
      stock: parseInt(stock),
      status: 'active' as const,
      imageUrl: imageUrl || undefined,
      createdAt: now,
      updatedAt: now,
    };

    // In a real app, this would be an API call to create the product
    console.log('Creating product:', baseProduct);
    
    alert(`Sản phẩm "${title}" đã được thêm thành công!`);
    navigate('/admin/products');
  };

  const handleCategoryChange = (newCategory: ProductCategory) => {
    setCategory(newCategory);
    // Reset category-specific fields
    setAuthors('');
    setPublisher('');
    setPublicationDate('');
    setNumberOfPages('');
    setLanguage('');
    setGenre('');
    setEditorInChief('');
    setIssueNumber('');
    setPublicationFrequency('');
    setIssn('');
    setSections('');
    setArtists('');
    setRecordLabel('');
    setTracks('');
    setDirector('');
    setRuntime('');
    setStudio('');
    setSubtitles('');
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
        <p className="text-gray-600 mt-1">Điền đầy đủ thông tin sản phẩm</p>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Có {Object.keys(errors).length} lỗi cần sửa:</h3>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2">
                {Object.values(errors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã sản phẩm (Barcode) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className={`input ${errors.barcode ? 'border-red-500' : ''}`}
                placeholder="9780743273565"
              />
              {errors.barcode && <p className="text-red-500 text-sm mt-1">{errors.barcode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                className="input"
              >
                <option value="book">Sách</option>
                <option value="newspaper">Báo</option>
                <option value="cd">CD</option>
                <option value="dvd">DVD</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="The Great Gatsby"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`input ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tình trạng <span className="text-red-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className={`input ${errors.condition ? 'border-red-500' : ''}`}
              >
                <option value="new">Mới</option>
                <option value="used">Đã qua sử dụng</option>
                <option value="like-new">Như mới</option>
              </select>
              {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Màu chủ đạo
              </label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="input"
                placeholder="Đỏ, Xanh, Đen..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL hình ảnh
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input"
                placeholder="https://images.unsplash.com/photo-..."
              />
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dimensions and Weight */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kích thước & Trọng lượng</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cao (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={`input ${errors.height ? 'border-red-500' : ''}`}
                placeholder="20"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rộng (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className={`input ${errors.width ? 'border-red-500' : ''}`}
                placeholder="13"
              />
              {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dài (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className={`input ${errors.length ? 'border-red-500' : ''}`}
                placeholder="2"
              />
              {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trọng lượng (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`input ${errors.weight ? 'border-red-500' : ''}`}
                placeholder="0.3"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Giá & Tồn kho</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá gốc (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={originalValue}
                onChange={(e) => setOriginalValue(e.target.value)}
                className={`input ${errors.originalValue ? 'border-red-500' : ''}`}
                placeholder="150000"
              />
              {errors.originalValue && <p className="text-red-500 text-sm mt-1">{errors.originalValue}</p>}
              <p className="text-xs text-gray-500 mt-1">Giá nhập về, chưa bao gồm VAT</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá hiện tại (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className={`input ${errors.currentPrice ? 'border-red-500' : ''}`}
                placeholder="120000"
              />
              {errors.currentPrice && <p className="text-red-500 text-sm mt-1">{errors.currentPrice}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Phải từ 30%-150% giá gốc
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`input ${errors.stock ? 'border-red-500' : ''}`}
                placeholder="45"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Price calculation preview */}
          {parseFloat(originalValue) > 0 && parseFloat(currentPrice) > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Preview giá:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>Giá gốc:</div>
                <div className="font-semibold">{parseInt(originalValue).toLocaleString()}đ</div>
                <div>Giá bán:</div>
                <div className="font-semibold">{parseInt(currentPrice).toLocaleString()}đ</div>
                <div>Tỷ lệ:</div>
                <div className={`font-semibold ${
                  isValidPriceRange(parseFloat(currentPrice), parseFloat(originalValue))
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {((parseFloat(currentPrice) / parseFloat(originalValue)) * 100).toFixed(1)}%
                  {isValidPriceRange(parseFloat(currentPrice), parseFloat(originalValue))
                    ? ' ✓'
                    : ' ✗ (30%-150%)'}
                </div>
                <div>Giá + VAT 10%:</div>
                <div className="font-semibold">
                  {(parseInt(currentPrice) * 1.1).toLocaleString()}đ
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Specific Fields - Same as EditProduct */}
        {category === 'book' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin Sách</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tác giả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className={`input ${errors.authors ? 'border-red-500' : ''}`}
                  placeholder="Tên tác giả (phân cách bằng dấu phẩy)"
                />
                {errors.authors && <p className="text-red-500 text-sm mt-1">{errors.authors}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại bìa <span className="text-red-500">*</span>
                </label>
                <select
                  value={coverType}
                  onChange={(e) => setCoverType(e.target.value as CoverType)}
                  className="input"
                >
                  <option value="paperback">Bìa mềm</option>
                  <option value="hardcover">Bìa cứng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhà xuất bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className={`input ${errors.publisher ? 'border-red-500' : ''}`}
                  placeholder="Nhà xuất bản Trẻ"
                />
                {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày xuất bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className={`input ${errors.publicationDate ? 'border-red-500' : ''}`}
                  placeholder="1 January 1997"
                />
                {errors.publicationDate && <p className="text-red-500 text-sm mt-1">{errors.publicationDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số trang
                </label>
                <input
                  type="number"
                  value={numberOfPages}
                  onChange={(e) => setNumberOfPages(e.target.value)}
                  className="input"
                  placeholder="309"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input"
                  placeholder="Tiếng Việt, English"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thể loại
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="input"
                  placeholder="Fiction, Fantasy, Romance..."
                />
              </div>
            </div>
          </div>
        )}

        {category === 'newspaper' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin Báo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tổng biên tập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editorInChief}
                  onChange={(e) => setEditorInChief(e.target.value)}
                  className={`input ${errors.editorInChief ? 'border-red-500' : ''}`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.editorInChief && <p className="text-red-500 text-sm mt-1">{errors.editorInChief}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhà xuất bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className={`input ${errors.publisher ? 'border-red-500' : ''}`}
                  placeholder="Tuổi Trẻ"
                />
                {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày xuất bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className={`input ${errors.publicationDate ? 'border-red-500' : ''}`}
                  placeholder="23 November 2025"
                />
                {errors.publicationDate && <p className="text-red-500 text-sm mt-1">{errors.publicationDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số báo
                </label>
                <input
                  type="text"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  className="input"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tần suất xuất bản
                </label>
                <select
                  value={publicationFrequency}
                  onChange={(e) => setPublicationFrequency(e.target.value)}
                  className="input"
                >
                  <option value="">Chọn tần suất</option>
                  <option value="Daily">Hàng ngày</option>
                  <option value="Weekly">Hàng tuần</option>
                  <option value="Monthly">Hàng tháng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISSN
                </label>
                <input
                  type="text"
                  value={issn}
                  onChange={(e) => setIssn(e.target.value)}
                  className="input"
                  placeholder="1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input"
                  placeholder="Tiếng Việt"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chuyên mục
                </label>
                <input
                  type="text"
                  value={sections}
                  onChange={(e) => setSections(e.target.value)}
                  className="input"
                  placeholder="Thời sự, Kinh tế, Thể thao (phân cách bằng dấu phẩy)"
                />
              </div>
            </div>
          </div>
        )}

        {category === 'cd' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin CD</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nghệ sĩ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={artists}
                  onChange={(e) => setArtists(e.target.value)}
                  className={`input ${errors.artists ? 'border-red-500' : ''}`}
                  placeholder="The Beatles (phân cách bằng dấu phẩy)"
                />
                {errors.artists && <p className="text-red-500 text-sm mt-1">{errors.artists}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hãng thu âm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={recordLabel}
                  onChange={(e) => setRecordLabel(e.target.value)}
                  className={`input ${errors.recordLabel ? 'border-red-500' : ''}`}
                  placeholder="Apple Records"
                />
                {errors.recordLabel && <p className="text-red-500 text-sm mt-1">{errors.recordLabel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thể loại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className={`input ${errors.genre ? 'border-red-500' : ''}`}
                  placeholder="Rock, Pop, Jazz..."
                />
                {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày phát hành
                </label>
                <input
                  type="text"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="input"
                  placeholder="26 September 1969"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh sách bài hát <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={tracks}
                  onChange={(e) => setTracks(e.target.value)}
                  rows={6}
                  className={`input ${errors.tracks ? 'border-red-500' : ''}`}
                  placeholder="Come Together|259&#10;Something|182&#10;Here Comes the Sun|185&#10;(Mỗi bài: Tên|Độ dài giây)"
                />
                {errors.tracks && <p className="text-red-500 text-sm mt-1">{errors.tracks}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Mỗi dòng: Tên bài hát|Độ dài (giây)
                </p>
              </div>
            </div>
          </div>
        )}

        {category === 'dvd' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin DVD</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại đĩa <span className="text-red-500">*</span>
                </label>
                <select
                  value={discType}
                  onChange={(e) => setDiscType(e.target.value as DiscType)}
                  className="input"
                >
                  <option value="Blu-ray">Blu-ray</option>
                  <option value="HD-DVD">HD-DVD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đạo diễn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  className={`input ${errors.director ? 'border-red-500' : ''}`}
                  placeholder="Christopher Nolan"
                />
                {errors.director && <p className="text-red-500 text-sm mt-1">{errors.director}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời lượng (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  className={`input ${errors.runtime ? 'border-red-500' : ''}`}
                  placeholder="148"
                />
                {errors.runtime && <p className="text-red-500 text-sm mt-1">{errors.runtime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Studio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  className={`input ${errors.studio ? 'border-red-500' : ''}`}
                  placeholder="Warner Bros"
                />
                {errors.studio && <p className="text-red-500 text-sm mt-1">{errors.studio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`input ${errors.language ? 'border-red-500' : ''}`}
                  placeholder="English"
                />
                {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phụ đề
                </label>
                <input
                  type="text"
                  value={subtitles}
                  onChange={(e) => setSubtitles(e.target.value)}
                  className="input"
                  placeholder="Vietnamese, English, French (phân cách bằng dấu phẩy)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thể loại
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="input"
                  placeholder="Sci-Fi, Action, Drama..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày phát hành
                </label>
                <input
                  type="text"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="input"
                  placeholder="16 July 2010"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Link
            to="/admin/products"
            className="btn btn-secondary"
          >
            Hủy
          </Link>
          <button
            type="submit"
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </form>
    </div>
  );
};

