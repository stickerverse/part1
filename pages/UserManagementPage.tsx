import React, { useState, useMemo } from 'react';
import Table from '../components/ui/Table';
import { User, TableColumn, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PencilIcon, TrashIcon, EyeIcon, UserPlusIcon } from '../components/icons/HeroIcons';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  
  // Form state for add/edit modal
  const [formData, setFormData] = useState<Partial<User>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode: 'view' | 'edit' | 'add', user?: User) => {
    setModalMode(mode);
    setSelectedUser(user || null);
    if (mode === 'edit' && user) {
      setFormData(user);
    } else if (mode === 'add') {
      setFormData({ name: '', email: '', role: UserRole.CUSTOMER, status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleSaveUser = () => {
    if (modalMode === 'add') {
      const newUser: User = {
        id: `u${Date.now()}`, // Simple ID generation
        name: formData.name || 'New User',
        email: formData.email || '',
        role: formData.role || UserRole.CUSTOMER,
        status: formData.status || 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
      };
      setUsers(prev => [newUser, ...prev]);
    } else if (modalMode === 'edit' && selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    }
    closeModal();
  };

  const handleDeleteUser = (userId: string) => {
    // Add confirmation step in a real app
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };


  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const columns: TableColumn<User>[] = [
    { key: 'avatarUrl', header: '', render: (user) => <img src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/40/40`} alt={user.name} className="w-10 h-10 rounded-full object-cover" /> },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'joinedDate', header: 'Joined Date', render: (user) => new Date(user.joinedDate).toLocaleDateString() },
    { key: 'status', header: 'Status', render: (user) => (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
        user.status === 'Active' ? 'bg-green-500 text-green-100' :
        user.status === 'Banned' ? 'bg-red-500 text-red-100' :
        'bg-yellow-500 text-yellow-100' // Pending
      }`}>{user.status}</span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-100">User Management</h2>
        <Button onClick={() => openModal('add')} leftIcon={<UserPlusIcon className="h-5 w-5" />}>
            Add User
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search users by name or email..."
        className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table<User>
        columns={columns}
        data={filteredUsers}
        renderActions={(user) => (
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={() => openModal('view', user)}><EyeIcon className="h-5 w-5"/></Button>
            <Button variant="ghost" size="sm" onClick={() => openModal('edit', user)}><PencilIcon className="h-5 w-5"/></Button>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteUser(user.id)}><TrashIcon className="h-5 w-5"/></Button>
          </div>
        )}
      />

      {isModalOpen && (selectedUser || modalMode === 'add') && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            modalMode === 'view' ? 'View User Details' :
            modalMode === 'edit' ? 'Edit User' : 'Add New User'
          }
          footer={
            modalMode !== 'view' ? (
              <>
                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button onClick={handleSaveUser}>
                  {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </Button>
              </>
            ) : <Button onClick={closeModal}>Close</Button>
          }
        >
          {modalMode === 'view' && selectedUser ? (
            <div className="space-y-3 text-sm">
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <img src={selectedUser.avatarUrl || `https://picsum.photos/seed/${selectedUser.id}/100/100`} alt={selectedUser.name} className="w-24 h-24 rounded-full mx-auto mt-4"/>
            </div>
          ) : (
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-200" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-200" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role</label>
                <select name="role" id="role" value={formData.role || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-200">
                  {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                <select name="status" id="status" value={formData.status || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 text-gray-200">
                  <option value="Active">Active</option>
                  <option value="Banned">Banned</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;