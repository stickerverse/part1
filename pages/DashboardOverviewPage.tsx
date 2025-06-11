
import React from 'react';
import { StatCard } from '../components/ui/Card';
import { UsersIcon, SparklesIcon, ShoppingCartIcon, UserGroupIcon } from '../components/icons/HeroIcons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_USERS, MOCK_STICKERS, MOCK_ORDERS, MOCK_ARTISTS, SALES_DATA_MONTHLY, STICKER_CATEGORY_DISTRIBUTION } from '../constants';
import { Order, Sticker, StickerStatus } from '../types';
import Table from '../components/ui/Table';

const DashboardOverviewPage: React.FC = () => {
  const totalUsers = MOCK_USERS.length;
  const totalStickers = MOCK_STICKERS.length;
  const totalOrders = MOCK_ORDERS.length;
  const totalArtists = MOCK_ARTISTS.length;

  const totalSales = MOCK_ORDERS.reduce((sum, order) => sum + order.totalAmount, 0);

  const RECENT_ORDERS_COUNT = 5;
  const recentOrders = MOCK_ORDERS.slice().sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, RECENT_ORDERS_COUNT);
  
  const PENDING_STICKERS_COUNT = 5;
  const pendingStickers = MOCK_STICKERS.filter(s => s.status === StickerStatus.PENDING).slice(0, PENDING_STICKERS_COUNT);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

  const orderColumns = [
    { key: 'id', header: 'Order ID' },
    { key: 'customerName', header: 'Customer' },
    { key: 'orderDate', header: 'Date', render: (item: Order) => new Date(item.orderDate).toLocaleDateString() },
    { key: 'totalAmount', header: 'Amount', render: (item: Order) => `$${item.totalAmount.toFixed(2)}` },
    { key: 'status', header: 'Status', render: (item: Order) => (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        item.status === 'Delivered' ? 'bg-green-500 text-green-100' :
        item.status === 'Shipped' ? 'bg-blue-500 text-blue-100' :
        item.status === 'Processing' ? 'bg-yellow-500 text-yellow-100' :
        item.status === 'Pending' ? 'bg-gray-500 text-gray-100' :
        'bg-red-500 text-red-100'
      }`}>{item.status}</span>
    )},
  ];

  const stickerColumns = [
    { key: 'name', header: 'Sticker Name', render: (item: Sticker) => (
      <div className="flex items-center">
        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md mr-3 object-cover"/>
        <span>{item.name}</span>
      </div>
    )},
    { key: 'artistName', header: 'Artist' },
    { key: 'submissionDate', header: 'Submitted', render: (item: Sticker) => new Date(item.submissionDate).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totalUsers} icon={<UsersIcon className="h-6 w-6" />} percentageChange={5} />
        <StatCard title="Total Stickers" value={totalStickers} icon={<SparklesIcon className="h-6 w-6" />} percentageChange={12} />
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingCartIcon className="h-6 w-6" />} percentageChange={-2} />
        <StatCard title="Total Artists" value={totalArtists} icon={<UserGroupIcon className="h-6 w-6" />} percentageChange={8} />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-850 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Sales Overview (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={SALES_DATA_MONTHLY} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#4A5568" />
              <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
              <YAxis tick={{ fill: '#A0AEC0' }} />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} itemStyle={{ color: '#CBD5E0' }}/>
              <Legend wrapperStyle={{ color: '#A0AEC0' }} />
              <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-850 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Sticker Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={STICKER_CATEGORY_DISTRIBUTION}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {STICKER_CATEGORY_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} itemStyle={{ color: '#CBD5E0' }}/>
               <Legend wrapperStyle={{ color: '#A0AEC0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-850 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Recent Orders</h3>
          <Table<Order> columns={orderColumns} data={recentOrders} />
        </div>
        <div className="bg-gray-850 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Pending Sticker Approvals</h3>
          <Table<Sticker> columns={stickerColumns} data={pendingStickers} />
        </div>
      </div>

    </div>
  );
};

export default DashboardOverviewPage;
