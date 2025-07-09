export const getStatusColor = (status: string) => {
    switch (status) {
        case "Created": return "warning";
        case "InProgress": return "primary";
        case "Completed": return "success";
        case "Cancel": return "danger";
        default: return "default";
    }
};

export const getStatusText = (status: string) => {
    switch (status) {
        case "Created": return "Chờ duyệt";
        case "InProgress": return "Đang xử lý";
        case "Completed": return "Hoàn thành";
        case "Cancel": return "Đã hủy";
        default: return status;
    }
};

export const getBinStatusColor = (status: string) => {
    switch (status) {
        case "EMPTY": return "default";
        case "FULL": return "warning";
        case "MAINTENANCE": return "danger";
        default: return "default";
    }
};

export const getBinStatusText = (status: string) => {
    switch (status) {
        case "EMPTY": return "Trống";
        case "FULL": return "Đầy";
        case "MAINTENANCE": return "Bảo trì";
        default: return status;
    }
};