const BASE_URL = "https://doantotnghiep-pb6y.onrender.com/api";

export const API_ROUTES = {
    warehouse: {
        stack:{
            addStack:`${BASE_URL}/stacks`,
        },
       bin:{
            addBin:`${BASE_URL}/bins`,
       },
       warehouse:{
            addBin:`${BASE_URL}/warehouse`,
       }
    },
    product: {
        add: `${BASE_URL}/product/add`,
        remove: `${BASE_URL}/product/remove`,
    },
    user: {
        login: `${BASE_URL}/user/login`,
        profile: `${BASE_URL}/user/profile`,
    },
};
