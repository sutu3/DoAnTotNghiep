// const BASE_URL_Warehouse = "https://doantotnghiep-pb6y.onrender.com/api";
// const BASE_URL_User = "https://userservice-kuug.onrender.com/api";
// const BASE_URL_Product = "https://productservice-8qdv.onrender.com/api";
//const BASE_URL_File = "https://fileservice-dz2g.onrender.com";
const BASE_URL_File = "http://localhost:8084";
// const BASE_URL_Order = "https://orderservice-3u1b.onrender.com/api";
// const BASE_URL_Inventory = "https://inventoryservice-0kl2.onrender.com/api";
//const TestGateWay = "https://doantotnghiep-1-netj.onrender.com/api";
const TestGateWay="http://localhost:8888/api"
export interface pageApi {
  pageNumber: number;
  pageSize: number;
}

export const API_ROUTES = {
  file:{
    uploadImage: BASE_URL_File+"/images/upload",
  },
  Authen:{
    Authen:()=>{
      const baseUrl = TestGateWay+"/authen/api/auth";
      return{
        login:baseUrl+"/login",
        logout:baseUrl+"/logout",
        refresh:baseUrl+"/refresh",
      }
    },
  },
  dashboard: {
    stats: (warehouseId: string, timeFilter: string) =>
        `${TestGateWay}/inventories/api/dashboard/stats/warehouse/${warehouseId}?timeFilter=${timeFilter}`
  },
  inventory:{
    InventoryWarehouse:(page:pageApi|null)=>{
      const base=`${TestGateWay}/inventories/api/inventory/warehouses`
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addInventoryWarehouse: base,
        expiring: `${base}/expiring`,
        search:(()=>{
          const search=base+"/search";
          return{
            byProductId:(productId:string)=>({
              getProduct:`${search}/product/${productId}`
            }),
            byWarehouseId:(warehouseId:string)=>({
              getWarehouse:`${search}/warehouse/${warehouseId}${pageUrl}`
            }),
            byBinId:(binId: string)=>({
              getBin: `${search}/bin/${binId}`,
            })
          }
        })
      }
    },
    movements:(page:pageApi|null)=>{
      const base=`${TestGateWay}/inventories/api/inventory/movements`
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addMovement: base,
        create: base,
        warehouseDateRange: (warehouseId: string, fromDate: string, toDate: string) =>
            `${base}/search/warehouse/${warehouseId}/date-range?fromDate=${fromDate}&toDate=${toDate}`,
        search:()=>{
          const search=`${base}/search`;
          return{
            dateRange: `${search}/date-range`,
            byInventoryWarehouse:(inventoryWarehouseId:string)=>`${search}/inventory-warehouse/${inventoryWarehouseId}${pageUrl}`

          }
        }
      }
    },
    stats: {
      capacity: (warehouseId: string) => `${TestGateWay}/inventories/api/inventory/stats/warehouse/${warehouseId}/capacity`,
    },
    products: (page: pageApi | null) => {
      const base =`${TestGateWay}/inventories/api/inventory/products`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        getAll: `${base}${pageUrl}`,
        lowStock: `${base}/low-stock`,
        search: {
          byWarehouse: (warehouseId: string) => ({
            getAll: `${base}/search/warehouse/${warehouseId}${pageUrl}`,
          }),
        },
      };
    },
  },
  order:{
    exportOrder:(page:pageApi|null)=>{
      const base = `${TestGateWay}/orders/api/exportOrders`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        getAllOrdersByStatusPendingAndApprove: base+"pending_Approvals",
        addOrder: base,
        search:(()=>{
          const search=base+"/search";
          return {
            ByStatus:(status:string)=>({
              getByWarehouse:(warehouseId:string)=>search+"/status/"+status+"/warehouseId/"+warehouseId+pageUrl,
            }),
          byWarehouseId:(warehouseId:string)=>({
             getAllOrdersByStatusPendingAndApprove:base+"/pending-approvals/search/warehouse/"+warehouseId+pageUrl,
           }),
          }
        }),
        changeStatus:(orderId:string)=>{
          return {
            status:`${base}/${orderId}/status`,
            approved:`${base}/${orderId}/approve`,
            reject:`${base}/${orderId}/reject`,
          }
        }
      }
    },
    exportOrderItem:(page:pageApi|null)=>{
      const base = `${TestGateWay}/orders/api/exportItems`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        addOrderItemExportBatch:base+"/batch",
        search:()=>{
          const search = `${base}/search`;
          return {
            ByOrderId:(orderId:string)=>search+"/orderId/"+orderId
          }
        },
        AddItemForOrder:(ordetId:string)=>{
          return{
            byOrderId:`${base}/${ordetId}/execute-export`,
          }
        },
      }
    },
    importOrder:(page: pageApi | null)=>{
      const base = `${TestGateWay}/orders/api/importOrders`;
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
      const base = `${TestGateWay}/orders/api/importItems`;
      return {
        addOrderItemImport:base,
        addOrderItemImportBatch:base+"/batch",
        updateItem:((ordetId:string)=>{
          return{
            byQuantity:`${base}/${ordetId}/reality-quantity`,
            byBin:`${base}/${ordetId}/bin`,
          }
        }),
        AddItemForOrder:(ordetId:string)=>{
          return{
            byOrderId:`${base}/${ordetId}/execute-import`,
          }
        },
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
      const base = `${TestGateWay}/warehouses/api/stacks`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        updateStacks:(stackId:string)=>base+"/"+stackId,
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
      const base = `${TestGateWay}/warehouses/api/bins`;
      return {
        addBin: base,
      };
    },

    warehouses: (page: pageApi | null) => {
      const base = `${TestGateWay}/warehouses/api/warehouses`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        nearFullStacks: (warehouseId: string, threshold: number = 90) =>
            `${base}/${warehouseId}/near-full-stacks?threshold=${threshold}`,
        capacityStats: (warehouseId: string, timeFilter: string) =>
            `${base}/${warehouseId}/capacity-stats?timeFilter=${timeFilter}`,
        storageAlerts: (warehouseId: string) =>
            `${base}/${warehouseId}/storage-alerts`,
        stackCapacityDetails: (warehouseId: string) =>
            `${base}/${warehouseId}/stack-capacity-details`,
        addWarehouse: base,
        GetAllList: base+"/getList",
        search: {
          getAll:base+"/search"+pageUrl,
          getByStaff:base+"/search/byStaff",

        }
      };
    },
  },
  product:{
    product:(page: pageApi | null) => {
      const base = `${TestGateWay}/products/api/products`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return{
      addProduct: base,
      search:(()=>{
        const search=base+"/search";
        return{
          byWarehouseId: () => ({
            getAll: `${search}/productPage${pageUrl}`,
          }),
          bySupplierAndWarehouse: (warehouseId: string | null, supplierId: string | null) => {
            const params: string[] = [];

            if (warehouseId) params.push(`warehouseId=${warehouseId}`);
            if (supplierId) params.push(`supplierId=${supplierId}`);
            params.push(pageUrl); // đảm bảo pageUrl là chuỗi dạng `page=0&size=10` hoặc `pageUrl=''`

            const url = search + "?" + params.join("&");

            return {
              getAll: url.slice(0,url.length-1),
            };
          }
        }
      })
    }
    },
    category:(page: pageApi | null) => {
      const base = `${TestGateWay}/products/api/categories`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addCategory: base,
        search:(()=>{
          const search=base+"/search"
          return{
            byWarehouseId: () => ({
              getAll: `${search}${pageUrl}`,
              getAllName: `${search}/categoryNames`,
            })
          }
        })
      }
    },
    unit:(page: pageApi | null) => {
      const base = `${TestGateWay}/products/api/units`;
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
      const base = `${TestGateWay}/products/api/groupUnits`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        GetAll: base+pageUrl,
      }
    }
  },
  user:{
    supplier:(page:pageApi|null)=>{
      const base = `${TestGateWay}/users/api/suppliers`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addSupplier: base,
        search:(()=>{
          const searchUrl = `${base}/search`;
          return {
            byWarehouseId: () => ({
              getAll: `${searchUrl}${pageUrl}`,
              getAllName: `${searchUrl}/SuppliersName`,
            }),
          }
        })
      }
    },
  users: (page: pageApi | null) => {
    const base = `${TestGateWay}/users/api/users`;
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
    const base = `${TestGateWay}/users/api/taskTypes`;
    const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return {
      addTask: base,
      updateTaskType:(taskTypeId: string) => `${base}/${taskTypeId}`,
      updateDescriptionTaskType:(taskTypeId: string) => `${base}/description/${taskTypeId}`,
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
    taskUsers: ((page: pageApi | null) => {
      const base = `${TestGateWay}/users/api/taskUsers`;
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        addTaskUser: base,
        search:()=>{
          const searchUrl = `${base}/search`;
          return {
            byTask:(taskId: string) => searchUrl+"/tasks/"+taskId,
          }
        }
      };
    }),


    tasks: ((page: pageApi | null) => {
      const base = `${TestGateWay}/users/api/tasks`;
      const pageUrl = page ? `&pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";

      return {
        addTask: base,

        search: (() => {
          const searchUrl = `${base}/search`;

          return {
            byTaskTypeNameAndWarehouse: (
                warehouseId: string | null,
                taskType: string | null,
            ) => {
              const params = new URLSearchParams();

              if (warehouseId) params.append("warehouseId", warehouseId);
              if (taskType) params.append("taskName", taskType);


              return {
                getAll: `${searchUrl}?${params.toString()}${pageUrl}`,
              };
            },
          };
        })(),
      };
    })
}

};
