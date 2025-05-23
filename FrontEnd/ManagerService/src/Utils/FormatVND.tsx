export const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // VNĐ thường không có số lẻ
    maximumFractionDigits: 0,
  }).format(value);
};
