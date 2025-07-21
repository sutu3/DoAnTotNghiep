import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface InventoryChartsProps {
    dateRange: string;
}

const InventoryCharts = ({ dateRange }: InventoryChartsProps) => {
    const stockMovementData = [
        { name: 'Mon', imports: 40, exports: 24 },
        { name: 'Tue', imports: 30, exports: 13 },
        { name: 'Wed', imports: 20, exports: 98 },
        { name: 'Thu', imports: 27, exports: 39 },
        { name: 'Fri', imports: 18, exports: 48 },
        { name: 'Sat', imports: 23, exports: 38 },
        { name: 'Sun', imports: 34, exports: 43 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 400, color: '#0088FE' },
        { name: 'Clothing', value: 300, color: '#00C49F' },
        { name: 'Food', value: 300, color: '#FFBB28' },
        { name: 'Books', value: 200, color: '#FF8042' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Movement Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Stock Movements
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stockMovementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="imports" fill="#3B82F6" name="Imports" />
                        <Bar dataKey="exports" fill="#EF4444" name="Exports" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Inventory by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default InventoryCharts;