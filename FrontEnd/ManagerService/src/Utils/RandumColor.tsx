const lightPastelColors: string[] = [
    '#B0E0E6', // Powder Blue
    '#ADD8E6', // Light Blue
    '#98FB98', // Pale Green
    '#90EE90', // Light Green
    '#C1FFC1', // A slightly lighter green
    '#FFB6C1', // Light Pink
    '#FFDAB9', // Peach Puff
    '#FFEDED', // Very light red/pink
    '#E6E6FA', // Lavender
    '#D8BFD8', // Thistle
    '#E0B0FF', // Light Purple
    '#CCCCFF', // Light Slate Blue (more pastel)
    '#FFFACD', // Lemon Chiffon
    '#FFF8DC', // Cornsilk
    '#FFE4B5', // Moccasin
    '#E0FFFF', // Azure (light cyan)
    '#AFEEEE', // Pale Turquoise
    '#FFFFE0'  // Light Yellow
];

const getRandomLightColor = (): string => {
    // Chọn ngẫu nhiên một index trong phạm vi của mảng
    const randomIndex = Math.floor(Math.random() * lightPastelColors.length);

    // Trả về màu tại index đó
    return lightPastelColors[randomIndex];
};

// Export hàm để có thể sử dụng ở nơi khác
export { getRandomLightColor };