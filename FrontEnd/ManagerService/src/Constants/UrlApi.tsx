const BASE_URL_Warehouse = "https://doantotnghiep-pb6y.onrender.com/api";
const BASE_URL_User = "https://userservice-kuug.onrender.com/api";
const BASE_URL_Product = "https://productservice-8qdv.onrender.com/api";
const BASE_URL_File = "https://fileservice-dz2g.onrender.com";
const BASE_URL_Order = "https://orderservice-3u1b.onrender.com/api";
const BASE_URL_Inventory = "https://inventoryservice-0kl2.onrender.com/api";
export interface pageApi {
  pageNumber: number;
  pageSize: number;
}

export const API_ROUTES = {
  file:{
    uploadImage: BASE_URL_File+"/images/upload",
  },
  inventory:{
    InventoryWarehouse:(page:pageApi|null)=>{
      const base=`${BASE_URL_Inventory}/inventory/warehouses`
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addInventoryWarehouse: base
      }
    },
    movements:(page:pageApi|null)=>{
      const base=`${BASE_URL_Inventory}/inventory/movements`
      const pageUrl = page ? `?pageNumber=${page.pageNumber}` : "";
      return{
        addMovement: base
      }
    }
  },
  order:{
    importOrder:(page: pageApi | null)=>{
      const base = `${BASE_URL_Order}/importOrders`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        addOrderImport:base,
        changeStatus:(orderId: string) => {
          return{
            approve:`${base}/${orderId}/approve`,
            reject:`${base}/${orderId}/reject`,
            ChangeStatus:`${base}/${orderId}/status`,
          }
        },
        search:(()=>{
          const search=base+"/search";
          return{
            byWarehouseId:(warehouseId: string,status:string|null)=>({
              getAll: `${search}/warehouse/${warehouseId}${pageUrl}`,
              byStatus:`${search}/warehouse/${warehouseId}/status/${status}${pageUrl}`,
            })
          }
        })
      }
    },
    orderItems:(page: pageApi | null)=>{
      const base = `${BASE_URL_Order}/importItems`;
      return {
        addOrderItemImport:base,
        addOrderItemImportBatch:base+"/batch",
        updateItem:((ordetId:string)=>{
          return{
            byQuantity:`${base}/${ordetId}/reality-quantity`,
            byBin:`${base}/${ordetId}/bin`,
          }
        }),
        search:(()=>{
          const search=base+"/search";
          return{
            byOrderId:(orderId: string)=>({
              getAll:`${search}/orderId/${orderId}`,
            })
          }
        }),
      }
    }
  },
  warehouse: {
    stacks: (page: pageApi | null) => {
      const base = `${BASE_URL_Warehouse}/stacks`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        addStacks: base,
        search: {
          byWarehouseId: (warehouseId: string) => ({
            getAll: `${base}/ByWarehouse/${warehouseId}${pageUrl}`,
            getAllList: `${base}/ByWarehouse/${warehouseId}/list`,
          }),
        },
      };
    },
    bins: (page: pageApi | null) => {
      const base = `${BASE_URL_Warehouse}/bins`;
      return {
        addBin: base,
      };
    },

    warehouses: (page: pageApi | null) => {
      const base = `${BASE_URL_Warehouse}/warehouses`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        addWarehouse: base,
      };
    },
  },
  product:{
    product:(page: pageApi | null) => {
      const base = `${BASE_URL_Product}/products`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return{
      addProduct: base,
      search:(()=>{
        const search=base+"/search";
        return{
          byWarehouseId: (warehouseId: string) => ({
            getAll: `${search}/warehouseId/${warehouseId}${pageUrl}`,
          }),
          bySupplierAndWarehouse: (warehouseId: string, supplierId: string|null) =>{
            const url = supplierId
                ? `${search}?warehouseId=${warehouseId}&supplier=${supplierId}&isActive=${true}${pageUrl}`
                : `${search}?warehouseId=${warehouseId}&isActive=${true}${pageUrl}`;
            return {
              getAll: url,
            };
          }
        }
      })
    }
    },
    category:(page: pageApi | null) => {
      const base = `${BASE_URL_Product}/categories`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addCategory: base,
        search:(()=>{
          const search=base+"/search"
          return{
            byWarehouseId: (warehouseId: string) => ({
              getAll: `${search}/warehouseId/${warehouseId}${pageUrl}`,
              getAllName: `${search}/warehouseId/${warehouseId}/categoryNames`,
            })
          }
        })
      }
    },
    unit:(page: pageApi | null) => {
      const base = `${BASE_URL_Product}/units`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return{
      getAll: base+pageUrl,
      addUnit: base,
      search:(()=>{
        const searchUrl = `${base}/search`;
        return {
          unitName:`${searchUrl}/UnitNames`,
          unitGroupName:((groupName: string) => {
            const GroupUnitName=searchUrl+"/groupUnitName/"+groupName;
            return{
              GetAll:GroupUnitName+pageUrl,
            }
          })
        }
      })
    }
    },
    GroupUnit:(page: pageApi | null) => {
      const base = `${BASE_URL_Product}/groupUnits`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        GetAll: base+pageUrl,
      }
    }
  },
  user:{
    supplier:(page:pageApi|null)=>{
      const base = `${BASE_URL_User}/suppliers`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addSupplier: base,
        search:(()=>{
          const searchUrl = `${base}/search`;
          return {
            byWarehouseId: (warehouseId: string) => ({
              getAll: `${searchUrl}/byWarehouseId/${warehouseId}${pageUrl}`,
              getAllName: `${searchUrl}/byWarehouseId/${warehouseId}/SuppliersName`,
            }),
          }
        })
      }
    },
  users: (page: pageApi | null) => {
    const base = `${BASE_URL_User}/users`;
    const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return {
      create: base,
      delete: (id: string) => `${base}/${id}`,
      search: (() => {
        const searchUrl = `${base}/search`;
        return {
          byWarehouseId: (warehouseId: string) => ({
            getAll: `${searchUrl}/warehouses/${warehouseId}${pageUrl}`,
          }),
          byUserName: (username: string) => ({
            getAll: `${searchUrl}/userName/${username}${pageUrl}`,
          }),
        };
      })(),
    };
  },

  taskType: ((page: pageApi | null) => {
    const base = `${BASE_URL_User}/taskTypes`;
    const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return {
      addTask: base,
      search: (() => {
        const searchUrl = `${base}/search`;
        return {
          byWarehouseId: (warehouseId: string) => ({
            getAll: `${searchUrl}/warehouse/${warehouseId}/getAll${pageUrl}`,
          }),
        };
      })(),
    };
  }),

  tasks: ((page: pageApi | null) => {
    const base = `${BASE_URL_User}/tasks`;
    const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return {
      addTask: base,
      search: (() => {
        const searchUrl = `${base}/search`;
        return {
          byWarehouseId: (warehouseId: string) => ({
            byIdTaskType: (taskTypeId: string) => ({
              getAll: `${searchUrl}/warehouse/${warehouseId}/taskType/${taskTypeId}${pageUrl}`,
            }),
          }),
        };
      })(),
    };
  }),
}

};
