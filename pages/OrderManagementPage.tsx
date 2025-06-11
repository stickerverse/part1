
import React, { useState, useMemo } from 'react';
import Table from '../components/ui/Table';
import { Order, TableColumn, OrderStatus, OrderItem } from '../types';
import { MOCK_ORDERS } from '../constants';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { EyeIcon, PencilIcon, PaperAirplaneIcon } from '../components/icons/HeroIcons';

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // For simplicity, modal is view-only, edit would involve more complex form state
  const [editingStatus, setEditingStatus] = useState<OrderStatus | undefined>(undefined);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setEditingStatus(order.status); // Initialize editing status
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setEditingStatus(undefined);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (selectedOrder) {
      setEditingStatus(newStatus);
    }
  };

  const handleSaveStatus = () => {
    if (selectedOrder && editingStatus) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id ? { ...order, status: editingStatus } : order
        )
      );
      closeModal();
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || order.status === filterStatus)
    );
  }, [orders, searchTerm, filterStatus]);

  const columns: TableColumn<Order>[] = [
    { key: 'id', header: 'Order ID' },
    { key: 'customerName', header: 'Customer' },
    { key: 'orderDate', header: 'Date', render: (order) => new Date(order.orderDate).toLocaleDateString() },
    { key: 'totalAmount', header: 'Total', render: (order) => `$${order.totalAmount.toFixed(2)}` },
    { key: 'status', header: 'Status', render: (order) => (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
        order.status === OrderStatus.DELIVERED ? 'bg-green-500 text-green-100' :
        order.status === OrderStatus.SHIPPED ? 'bg-blue-500 text-blue-100' :
        order.status === OrderStatus.PROCESSING ? 'bg-yellow-500 text-yellow-100' :
        order.status === OrderStatus.PENDING ? 'bg-gray-500 text-gray-100' :
        order.status === OrderStatus.CANCELLED ? 'bg-red-500 text-red-100' :
        'bg-purple-500 text-purple-100' // Refunded
      }`}>{order.status}</span>
    )},
     { key: 'itemCount', header: 'Items', render: (order) => order.items.reduce((sum, item) => sum + item.quantity, 0) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-100">Order Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search orders by ID or customer name..."
          className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          {Object.values(OrderStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <Table<Order>
        columns={columns}
        data={filteredOrders}
        renderActions={(order) => (
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={() => openModal(order)}><EyeIcon className="h-5 w-5"/></Button>
            {/* Future: Edit order details <Button variant="ghost" size="sm"><PencilIcon className="h-5 w-5"/></Button> */}
            {(order.status === OrderStatus.PROCESSING || order.status === OrderStatus.PENDING) &&
              <Button variant="ghost" size="sm" onClick={() => handleStatusChange(OrderStatus.SHIPPED)} className="text-blue-400 hover:text-blue-300">
                <PaperAirplaneIcon className="h-5 w-5 mr-1" /> Mark Shipped
              </Button>
            }
          </div>
        )}
      />

      {isModalOpen && selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          size="lg"
          title={`Order Details: ${selectedOrder.id}`}
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>Close</Button>
              <Button onClick={handleSaveStatus} disabled={editingStatus === selectedOrder.status}>Save Status Changes</Button>
            </>
          }
        >
          <div className="space-y-4 text-sm text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> <span className="font-semibold text-lg">${selectedOrder.totalAmount.toFixed(2)}</span></p>
              <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
              {selectedOrder.trackingNumber && <p><strong>Tracking #:</strong> {selectedOrder.trackingNumber}</p>}
            </div>
            
            <div className="mt-4">
              <label htmlFor="orderStatus" className="block font-medium text-gray-300 mb-1">Order Status:</label>
              <select 
                id="orderStatus"
                value={editingStatus} 
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.values(OrderStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <h4 className="font-semibold text-gray-200 mt-4 pt-2 border-t border-gray-700">Items:</h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {selectedOrder.items.map((item: OrderItem, index: number) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-750 rounded-md">
                  <div>
                    <p className="font-medium">{item.stickerName} (ID: {item.stickerId})</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} @ ${item.pricePerUnit.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold">${(item.quantity * item.pricePerUnit).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderManagementPage;
