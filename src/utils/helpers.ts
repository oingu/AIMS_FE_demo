// Format currency in VND
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Calculate VAT (10%)
export const calculateVAT = (amount: number): number => {
  return amount * 0.1;
};

// Calculate total with VAT
export const calculateTotalWithVAT = (amount: number): number => {
  return amount + calculateVAT(amount);
};

// Calculate delivery fee
interface DeliveryFeeParams {
  totalWeight: number; // kg
  city: string;
  orderValue: number; // VND
}

export const calculateDeliveryFee = ({
  totalWeight,
  city,
  orderValue,
}: DeliveryFeeParams): number => {
  let fee = 0;
  const isHanoiOrHCM = city === 'Hà Nội' || city === 'Hồ Chí Minh';

  if (isHanoiOrHCM) {
    // Initial price for first 3kg: 22,000 VND
    fee = 22000;
    if (totalWeight > 3) {
      // Additional fee: 2,500 VND per 0.5kg
      const additionalWeight = totalWeight - 3;
      const additionalUnits = Math.ceil(additionalWeight / 0.5);
      fee += additionalUnits * 2500;
    }
  } else {
    // Initial price for first 0.5kg: 30,000 VND
    fee = 30000;
    if (totalWeight > 0.5) {
      // Additional fee: 2,500 VND per 0.5kg
      const additionalWeight = totalWeight - 0.5;
      const additionalUnits = Math.ceil(additionalWeight / 0.5);
      fee += additionalUnits * 2500;
    }
  }

  // Free shipping discount (up to 25,000 VND) for orders > 100,000 VND
  if (orderValue > 100000) {
    const discount = Math.min(fee, 25000);
    fee -= discount;
  }

  return fee;
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Format datetime
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Validate price range (30% - 150% of original value)
export const isValidPriceRange = (
  currentPrice: number,
  originalValue: number
): boolean => {
  const minPrice = originalValue * 0.3;
  const maxPrice = originalValue * 1.5;
  return currentPrice >= minPrice && currentPrice <= maxPrice;
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Vietnamese format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Get price range label
export const getPriceRangeLabel = (min: number, max: number | null): string => {
  if (max === null) {
    return `Trên ${formatCurrency(min)}`;
  }
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Get product category label
export const getProductCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    book: 'Sách',
    newspaper: 'Báo',
    cd: 'CD',
    dvd: 'DVD',
  };
  return labels[category] || category;
};

// Get order status label
export const getOrderStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Chờ xử lý',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
    cancelled: 'Đã hủy',
  };
  return labels[status] || status;
};

// Get order status color
export const getOrderStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

