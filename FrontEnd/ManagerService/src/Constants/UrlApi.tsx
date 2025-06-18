const BASE_URL = "https://doantotnghiep-pb6y.onrender.com/api";
// const TEST_URL = "http://localhost:8080/api"; // Currently unused

export interface pageApi {
  pageNumber: number;
  pageSize: number;
}
export const API_ROUTES = {
  warehouse: {
    stack: {
      addStack: `${BASE_URL}/stacks`,
      search: (params: pageApi, warehouse: string) =>
        `${BASE_URL}/stacks/ByWarehouse/${warehouse}?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`,
    },
    bin: {
      addBin: `${BASE_URL}/bins`,
    },
    warehouse: {
      addWarehouse: `${BASE_URL}/warehouse`,
    },
  },
};
