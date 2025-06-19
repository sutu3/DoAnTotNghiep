const BASE_URL_Warehouse = "https://doantotnghiep-pb6y.onrender.com/api";
const BASE_URL_User="https://userservice-kuug.onrender.com/api";
// const TEST_URL = "http://localhost:8080/api"; // Currently unused

export interface pageApi {
  pageNumber: number;
  pageSize: number;
}
export const API_ROUTES = {
  warehouse: {
    stack: {
      addStack: `${BASE_URL_Warehouse}/stacks`,
      search: (params: pageApi, warehouse: string) =>
        `${BASE_URL_Warehouse}/stacks/ByWarehouse/${warehouse}?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`,
    },
    bin: {
      addBin: `${BASE_URL_Warehouse}/bins`,
    },
    warehouse: {
      addWarehouse: `${BASE_URL_Warehouse}/warehouse`,
    },
  },
  user: {
    task: {
      search: (params: pageApi, warehouse: string) =>
          `${BASE_URL_User}/taskTypes/search/warehouse/${warehouse}/getAll?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`,
    },
  }
};
