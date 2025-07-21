import { createSlice } from "@reduxjs/toolkit";
import {Product} from "@/Store/ProductSlice.tsx";
import {Category} from "@/Store/CategorySlice.tsx";
import {User} from "@/Store/UserSlice.tsx";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";

export interface InventoryStats {
    totalProducts: number;
    totalValue: string;
    lowStockItems: number;
    recentMovements: number;
    valueChangePercent: number;
    movementsChangePercent: number;
}

export interface LowStockProduct {
    inventoryProductId: string;
    productDetails: Product;
    totalQuantity: number;
    minStockLevel: number;
    category: Category;
    warehouseDetails:Warehouse
}

export interface ExpiringProduct {
    inventoryWarehouseId: string;
    productName: string;
    quantity: number;
    expiryDate: string;
    daysLeft: number;
    bin: string;
}

export interface RecentMovement {
    stockMovementId: string;
    productDetails: Product;
    movementType: "IMPORT" | "EXPORT" | "TRANSFER" | "ADJUSTMENT";
    quantity: number,
    quantityBefore: number,
    quantityAfter: number,
    performedByUser: User;
    createdAt: string;
}

export interface WarehouseCapacity {
    totalBins: number;
    occupiedBins: number;
    availableBins: number;
    totalCapacity: number;
    currentOccupancy: number;
    utilizationRate: number;
}

interface InventoryState {
    // Stats data
    stats: InventoryStats;

    // Low stock products
    lowStockProducts: LowStockProduct[];

    // Expiring products
    expiringProducts: ExpiringProduct[];

    // Recent movements
    recentMovements: RecentMovement[];

    // Warehouse capacity
    warehouseCapacity: WarehouseCapacity;

    // Loading states
    loading: {
        stats: boolean;
        lowStock: boolean;
        expiring: boolean;
        movements: boolean;
        capacity: boolean;
    };

    // Error states
    errors: {
        stats: string | null;
        lowStock: string | null;
        expiring: string | null;
        movements: string | null;
        capacity: string | null;
    };
}

const initialState: InventoryState = {
    stats: {
        totalProducts: 0,
        totalValue: "$0",
        lowStockItems: 0,
        recentMovements: 0,
        valueChangePercent: 0,
        movementsChangePercent: 0,
    },
    lowStockProducts: [],
    expiringProducts: [],
    recentMovements: [],
    warehouseCapacity: {
        totalBins: 0,
        occupiedBins: 0,
        availableBins: 0,
        totalCapacity: 0,
        currentOccupancy: 0,
        utilizationRate: 0,
    },
    loading: {
        stats: false,
        lowStock: false,
        expiring: false,
        movements: false,
        capacity: false,
    },
    errors: {
        stats: null,
        lowStock: null,
        expiring: null,
        movements: null,
        capacity: null,
    },
};

const InventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        // Stats actions
        setInventoryStats: (state, action) => {
            state.stats = action.payload;
            state.loading.stats = false;
            state.errors.stats = null;
        },
        setStatsLoading: (state, action) => {
            state.loading.stats = action.payload;
        },
        setStatsError: (state, action) => {
            state.errors.stats = action.payload;
            state.loading.stats = false;
        },

        // Low stock actions
        setLowStockProducts: (state, action) => {
            state.lowStockProducts = action.payload;
            state.loading.lowStock = false;
            state.errors.lowStock = null;
        },
        setLowStockLoading: (state, action) => {
            state.loading.lowStock = action.payload;
        },
        setLowStockError: (state, action) => {
            state.errors.lowStock = action.payload;
            state.loading.lowStock = false;
        },

        // Expiring products actions
        setExpiringProducts: (state, action) => {
            state.expiringProducts = action.payload;
            state.loading.expiring = false;
            state.errors.expiring = null;
        },
        setExpiringLoading: (state, action) => {
            state.loading.expiring = action.payload;
        },
        setExpiringError: (state, action) => {
            state.errors.expiring = action.payload;
            state.loading.expiring = false;
        },

        // Recent movements actions
        setRecentMovements: (state, action) => {
            state.recentMovements = action.payload;
            state.loading.movements = false;
            state.errors.movements = null;
        },
        setMovementsLoading: (state, action) => {
            state.loading.movements = action.payload;
        },
        setMovementsError: (state, action) => {
            state.errors.movements = action.payload;
            state.loading.movements = false;
        },

        // Warehouse capacity actions
        setWarehouseCapacity: (state, action) => {
            state.warehouseCapacity = action.payload;
            state.loading.capacity = false;
            state.errors.capacity = null;
        },
        setCapacityLoading: (state, action) => {
            state.loading.capacity = action.payload;
        },
        setCapacityError: (state, action) => {
            state.errors.capacity = action.payload;
            state.loading.capacity = false;
        },
        calculateStats: (state) => {
            state.stats = {
                totalProducts: state.lowStockProducts.length + state.expiringProducts.length, // hoặc logic phức tạp hơn
                totalValue: "$0", // tính từ inventory data
                lowStockItems: state.lowStockProducts.length,
                recentMovements: state.recentMovements.length,
                valueChangePercent: 0,
                movementsChangePercent: 0,
            };
        },
        // Clear all data
        clearInventoryData: (state) => {
            state.stats = initialState.stats;
            state.lowStockProducts = [];
            state.expiringProducts = [];
            state.recentMovements = [];
            state.warehouseCapacity = initialState.warehouseCapacity;
            state.loading = initialState.loading;
            state.errors = initialState.errors;
        },
    },
});

export const {
    setInventoryStats,
    setStatsLoading,
    setStatsError,
    setLowStockProducts,
    setLowStockLoading,
    setLowStockError,
    setExpiringProducts,
    setExpiringLoading,
    setExpiringError,
    setRecentMovements,
    setMovementsLoading,
    setMovementsError,
    setWarehouseCapacity,
    setCapacityLoading,
    setCapacityError,
    clearInventoryData,
    calculateStats
} = InventorySlice.actions;

export default InventorySlice;