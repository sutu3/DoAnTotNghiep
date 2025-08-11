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
        changePassword:baseUrl+"/change-password",
        login:baseUrl+"/login",
        logout:baseUrl+"/logout",
        refresh:baseUrl+"/refresh",
          forgotPassword: `${baseUrl}/forgot-password`,
          resetPassword: `${baseUrl}/reset-password`,
      }
    },
  },
  dashboard: {
    allStats: (timeFilter: string) =>
        `${TestGateWay}/inventories/api/dashboard/stats/all?timeFilter=${timeFilter}`,
    stats: (warehouseId: string, timeFilter: string) =>
        `${TestGateWay}/inventories/api/dashboard/stats/warehouse/${warehouseId}?timeFilter=${timeFilter}`
  },
  inventory:{
    checkDetails:(page:pageApi|null)=> {
      const base=`${TestGateWay}/inventories/api/inventory/check-details/`
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        create: `${base}`,
        update:(SheetId:string)=> `${base}/${SheetId}`,
      }
    },
    checkSheets:(page:pageApi|null)=> {
      const base=`${TestGateWay}/inventories/api/inventory/check-sheets`
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        create: `${base}`,
        getAll: () => {
          return{
            byWarehouse:(warehouseId:string)=>base+"/warehouse/"+warehouseId+pageUrl,
            byUser:()=>base+"/performed-by"+pageUrl
          }
        },
        getById: (id: string) => `${TestGateWay}/inventories/api/inventory/check-sheets/${id}`,
        updateStatusComplete: (id: string) => `${base}/${id}/status-completed`,
        updateStatusApprove: (id: string) => `${base}/${id}/status-Approve`,
        process: (id: string) => `${TestGateWay}/inventories/api/inventory/check-sheets/${id}/process`,
        delete: (id: string) => `${TestGateWay}/inventories/api/inventory/check-sheets/${id}`
      }
    },
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
              getProduct:`${search}/product/${productId}`,
              getWarehouse:(warehouseId:string)=>`${search}/product/${productId}/warehouse/${warehouseId}`,
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
    InventoryProduct:(page:pageApi|null)=>{
      const base=`${TestGateWay}/inventories/api/inventory/products`
      const pageUrl = page ? `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        search:(()=>{
          const search=base+"/search";
          return{
            byProductId:(productId:string)=>({
              getProduct:`${search}/product/${productId}/getFirst`,
              getAll:`${search}/product/${productId}`,
            }),
            byWarehouseId:(warehouseId:string)=>({
              getWarehouse:`${search}/warehouse/${warehouseId}${pageUrl}`,
            }),
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
        allWarehouseDateRange: (fromDate: string, toDate: string) =>
            `${base}/search/all-warehouses/date-range?fromDate=${fromDate}&toDate=${toDate}`,
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
        batch:(productId:string)=>`${base}/batch/${productId}`,
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
            Filter:(warehouseId: string | null, status: string | null) => {
              const pages = page ? `pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";

              const params: string[] = [];
                if (warehouseId) params.push(`warehouseId=${warehouseId}`);
                if (status) params.push(`status=${status}`);
              params.push(pages)
              const url = search + "?" + params.join("&");
                return {
                    getAll: url,
                };
            },
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
    receiptWarehouse:(page: pageApi | null)=>{
      const base = `${TestGateWay}/orders/api/warehouse-receipts`;
      const pageUrl = page ? `pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addReceipt:base,
        getByReceiptId:(receiptId:string)=>base+"/"+receiptId,
        updateComplete:(receiptId:string)=>base+`/${receiptId}/complete`,
        updateItem:(receiptId:string,receiptItemId:string)=>base+`/${receiptId}/items/${receiptItemId}`,
        search:()=>{
          const search=base+"/search";
          return {
            byWarehouseReceipts:(warehouseReceiptId:string)=>search+"/warehouseReceipt/"+warehouseReceiptId,
            byWarehouseId:(warehouseId: string|null,status:string|null,receiptId:string|null)=>{
              const params: string[] = [];
              if (warehouseId) params.push(`warehouseId=${warehouseId}`);
              if (status) params.push(`status=${status}`);
              if (receiptId) params.push(`receiptId=${receiptId}`);
              params.push(pageUrl)
              const url = search + "?" + params.join("&");

              return {
                getAll: url,
              };
            }
          }
        }
      }
    },
    deliveryWarehouse:(page: pageApi | null)=>{
      const base = `${TestGateWay}/orders/api/warehouse-deliveries`;
      const pageUrl = page ? `pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return{
        addReceipt:base,
        getByReceiptId:(deliveryId:string)=>base+"/"+deliveryId,
        updateComplete:(deliveryId:string)=>base+`/${deliveryId}/complete`,
        updateItem:(receiptId:string,receiptItemId:string)=>base+`/${receiptId}/items/${receiptItemId}`,

        search:(()=>{
          const search=base+"/search";
          return{
            byWarehouseId:(warehouseId: string|null,status:string|null)=>{
              const params: string[] = [];
              if (warehouseId) params.push(`warehouseId=${warehouseId}`);
              if (status) params.push(`status=${status}`);
              const url = search+"/getAllPage" + "?" + params.join("&");
              return {
                byStatus: url.slice(0,url.length)+"&"+pageUrl,
                getAll: `${search}/warehouse/${warehouseId}?${pageUrl}`,
              };
            },
            byDeliveryId:(deliveryId:string)=>{
                return {
                    getAll: `${search}/deliveryId/${deliveryId}`,
                };
            }
          }
        })
      }
    },
    importOrder:(page: pageApi | null)=>{
      const base = `${TestGateWay}/orders/api/importOrders`;
      const pageUrl = page ? `pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        readyForReceipt:(warehouseId:string)=>`${base}/ready-for-receipt/warehouse/${warehouseId}`,
        addOrderImport:base,
        changeStatus:(orderId: string) => {
          return{
            approve:`${base}/${orderId}/approve`,
            reject:`${base}/${orderId}/reject`,
            ChangeStatus:`${base}/${orderId}/status`,
            markGoodsArrived:`${base}/${orderId}/mark-goods-arrived`,
          }
        },
        search:(()=>{
          const search=base+"/search";
          return{
            byWarehouseId:(warehouseId: string|null,status:string|null)=>{
              const params: string[] = [];
              if (warehouseId) params.push(`warehouseId=${warehouseId}`);
              if (status) params.push(`status=${status}`);
              const url = search+"/getAllPage" + "?" + params.join("&");
              return {
                byStatus: url.slice(0,url.length)+"&"+pageUrl,
                getAll: `${search}/warehouse/${warehouseId}?${pageUrl}`,
              };
            }
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
      const pageUrl = page ? `pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
      return {
        updateStacks:(stackId:string)=>base+"/"+stackId,
        addStacks: base,
        search:()=> {
          const search = `${base}/search`
            return {
              Filter: (warehouseId: string | null, stackName: string | null) => {
                const params: string[] = [];
                if (warehouseId) params.push(`warehouseId=${warehouseId}`);
                if (stackName) params.push(`stackName=${stackName}`);
                params.push(pageUrl)
                const url = search+"/filter" + "?" + params.join("&");

                return {
                  getAll: url,
                };
              },
              byWarehouseId: (warehouseId: string) => ({
                getAllList: `${base}/ByWarehouse/${warehouseId}/list`,
              }),

            }
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
      const pageUrl = page ? `pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";
    return{
      addProduct: base,
      deleteProduct:(productId:string)=>base+"/"+productId,
      search:(()=>{
        const search=base+"/search";
        return{
          byProduct:(productId:string)=>`${search}/productId/${productId}`,
          byWarehouseId: () => ({
            getAll: `${search}/productPage?${pageUrl}`,
          }),
          bySupplierAndWarehouse: (warehouseId: string | null, supplierId: string | null
                                   ,categoryId:string|null,unitId:string|null
                                   ,productName:string|null) => {
            const params: string[] = [];

            if (warehouseId) params.push(`warehouseId=${warehouseId}`);
            if (supplierId) params.push(`supplierId=${supplierId}`);
            if (productName) params.push(`productName=${productName}`);
            if (categoryId) params.push(`categoryId=${categoryId}`);
            if (unitId) params.push(`unitId=${unitId}`);
            params.push(pageUrl)

            const url = search + "?" + params.join("&");

            return {
              getAll: url,
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
        updateSupplier:(supplierId:string)=>base+"/update/"+supplierId,
        deleteSupplier:(supplierId:string)=>base+"/delete/"+supplierId,
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
      getMyInfor: `${base}/search/idUser`,
      search: (() => {
        const searchUrl = `${base}/search`;
        return {
          byWarehouseId: (warehouseId: string) => ({
            getAll: `${searchUrl}/warehouses/${warehouseId}${pageUrl}`,
          }),
          byUserName: (username: string) => ({
            getAll: `${searchUrl}/userName/${username}${pageUrl}`,
          }),
          byUserId: (userId: string) => ({
            role:`${searchUrl}/user/${userId}/roles`,
            infor:`${searchUrl}/user/${userId}/infor`
          })
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
        statsInfor:base+"/stats",
        updateStatus: (taskUserId: string) => `${base}/${taskUserId}/status`,
        updateCompleted: (taskUserId: string) => `${base}/${taskUserId}/Complete`,
        updateCancel: (taskUserId: string) => `${base}/${taskUserId}/Cancel`,
        search:()=>{
          const searchUrl = `${base}/search`;
          return {
            byTask:(taskId: string) => searchUrl+"/tasks/"+taskId,
            byUser:()=>searchUrl+`/users`+pageUrl
          }
        }
      };
    }),


    tasks: ((page: pageApi | null) => {
      const base = `${TestGateWay}/users/api/tasks`;
      const pageUrl = page ? `&pageNumber=${page.pageNumber}&pageSize=${page.pageSize}` : "";

      return {
        addTask: base,
        updateStatus: (taskId: string) => `${base}/${taskId}/status`,
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
              filter: (
                  warehouseId: string | null,
                  taskType: string | null,
              ) => {
                  const params = new URLSearchParams();

                  if (warehouseId) params.append("warehouseId", warehouseId);
                  if (taskType) params.append("taskName", taskType);

                  return {
                      stats: `${base}/stats?${params.toString()}`,
                  };
              },
          };
        })(),
      };
    })
}

};
