import React, { useState, useMemo } from 'react';
import Table from '../components/ui/Table';
import { Sticker, TableColumn, StickerStatus } from '../types';
import { MOCK_STICKERS } from '../constants';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { EyeIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, MinusCircleIcon, SparklesIcon as AddStickerIcon, ClockIcon } from '../components/icons/HeroIcons';

const StickerManagementPage: React.FC = () => {
  const [stickers, setStickers] = useState<Sticker[]>(MOCK_STICKERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StickerStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');

  const [formData, setFormData] = useState<Partial<Sticker>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else if (name === 'tags') {
      setFormData(prev => ({ ...prev, [name]: value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (mode: 'view' | 'edit' | 'add', sticker?: Sticker) => {
    setModalMode(mode);
    setSelectedSticker(sticker || null);
    if ((mode === 'edit' || mode === 'view') && sticker) {
      setFormData({...sticker, tags: sticker.tags }); // Store tags as string[]
    } else if (mode === 'add') {
      setFormData({
        name: '',
        imageUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, // Placeholder
        artistId: MOCK_STICKERS[0]?.artistId || 'a1', 
        artistName: MOCK_STICKERS[0]?.artistName || 'Artist Name',
        category: '',
        tags: [], // Initialize tags as empty array
        price: 0,
        description: '',
        status: StickerStatus.PENDING,
      });
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSticker(null);
    setFormData({});
  };

  const handleSaveSticker = () => {
    const processedDataForSave = {
      ...formData,
      tags: formData.tags || [], // Ensure tags is string[]
    };

    if (modalMode === 'add') {
      const newSticker: Sticker = {
        id: `s${Date.now()}`,
        submissionDate: new Date().toISOString().split('T')[0],
        sales: 0,
        ...processedDataForSave,
        name: processedDataForSave.name || 'New Sticker',
        imageUrl: processedDataForSave.imageUrl || `https://picsum.photos/seed/${Date.now()}/200/200`,
        artistId: processedDataForSave.artistId || 'a1',
        artistName: processedDataForSave.artistName || 'Default Artist',
        category: processedDataForSave.category || 'General',
        price: processedDataForSave.price || 0,
        description: processedDataForSave.description || '',
        status: processedDataForSave.status || StickerStatus.PENDING,
        // tags property is already correctly set from processedDataForSave
      };
      setStickers(prev => [newSticker, ...prev]);
    } else if (modalMode === 'edit' && selectedSticker) {
      setStickers(prev => prev.map(s => s.id === selectedSticker.id ? { ...s, ...processedDataForSave } as Sticker : s));
    }
    closeModal();
  };
  
  const handleDeleteSticker = (stickerId: string) => {
     if (window.confirm('Are you sure you want to delete this sticker?')) {
        setStickers(prev => prev.filter(s => s.id !== stickerId));
    }
  };

  const updateStickerStatus = (stickerId: string, status: StickerStatus) => {
    setStickers(prevStickers =>
      prevStickers.map(sticker =>
        sticker.id === stickerId ? { ...sticker, status, approvedDate: status === StickerStatus.APPROVED ? new Date().toISOString().split('T')[0] : sticker.approvedDate } : sticker
      )
    );
  };

  const filteredStickers = useMemo(() => {
    return stickers.filter(sticker =>
      (sticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       sticker.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       sticker.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (sticker.tags && sticker.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))) && // Added check for sticker.tags existence
      (filterStatus === 'all' || sticker.status === filterStatus)
    );
  }, [stickers, searchTerm, filterStatus]);

  const columns: TableColumn<Sticker>[] = [
    { key: 'imageUrl', header: 'Image', render: (sticker) => <img src={sticker.imageUrl} alt={sticker.name} className="w-12 h-12 rounded-md object-cover" /> },
    { key: 'name', header: 'Name' },
    { key: 'artistName', header: 'Artist' },
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Price', render: (sticker) => `$${sticker.price.toFixed(2)}` },
    { key: 'status', header: 'Status', render: (sticker) => {
      let icon, colorClass;
      switch(sticker.status) {
        case StickerStatus.APPROVED: icon = <CheckCircleIcon className="h-5 w-5"/>; colorClass = 'text-green-400'; break;
        case StickerStatus.PENDING:  icon = <ClockIcon className="h-5 w-5"/>; colorClass = 'text-yellow-400'; break;
        case StickerStatus.REJECTED: icon = <XCircleIcon className="h-5 w-5"/>; colorClass = 'text-red-400'; break;
        default: icon = <MinusCircleIcon className="h-5 w-5"/>; colorClass = 'text-gray-400';
      }
      return <span className={`flex items-center space-x-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
        {icon}
        <span>{sticker.status}</span>
      </span>;
    }},
    { key: 'submissionDate', header: 'Submitted', render: (sticker) => new Date(sticker.submissionDate).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-100">Sticker Management</h2>
        <Button onClick={() => openModal('add')} leftIcon={<AddStickerIcon className="h-5 w-5" />}>Add Sticker</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search stickers by name, artist, category, tags..."
          className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as StickerStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          {Object.values(StickerStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <Table<Sticker>
        columns={columns}
        data={filteredStickers}
        renderActions={(sticker) => (
          <div className="space-x-1 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => openModal('view', sticker)} title="View"><EyeIcon className="h-5 w-5"/></Button>
            <Button variant="ghost" size="sm" onClick={() => openModal('edit', sticker)} title="Edit"><PencilIcon className="h-5 w-5"/></Button>
            {sticker.status === StickerStatus.PENDING && (
              <>
                <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300" onClick={() => updateStickerStatus(sticker.id, StickerStatus.APPROVED)} title="Approve"><CheckCircleIcon className="h-5 w-5"/></Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => updateStickerStatus(sticker.id, StickerStatus.REJECTED)} title="Reject"><XCircleIcon className="h-5 w-5"/></Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteSticker(sticker.id)} title="Delete"><TrashIcon className="h-5 w-5"/></Button>
          </div>
        )}
      />

       {isModalOpen && (selectedSticker || modalMode === 'add') && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          size="lg"
          title={
            modalMode === 'view' ? `View Sticker: ${selectedSticker?.name}` :
            modalMode === 'edit' ? `Edit Sticker: ${selectedSticker?.name}` : 'Add New Sticker'
          }
          footer={
            modalMode !== 'view' ? (
              <>
                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button onClick={handleSaveSticker}>
                  {modalMode === 'add' ? 'Create Sticker' : 'Save Changes'}
                </Button>
              </>
            ) : <Button onClick={closeModal}>Close</Button>
          }
        >
          {modalMode === 'view' && selectedSticker ? (
            <div className="space-y-3 text-sm text-gray-300">
              <img src={selectedSticker.imageUrl} alt={selectedSticker.name} className="w-full h-auto max-h-64 object-contain rounded-md mb-4"/>
              <p><strong>ID:</strong> {selectedSticker.id}</p>
              <p><strong>Name:</strong> {selectedSticker.name}</p>
              <p><strong>Artist:</strong> {selectedSticker.artistName} (ID: {selectedSticker.artistId})</p>
              <p><strong>Category:</strong> {selectedSticker.category}</p>
              <p><strong>Price:</strong> ${selectedSticker.price.toFixed(2)}</p>
              <p><strong>Description:</strong> {selectedSticker.description}</p>
              <p><strong>Tags:</strong> {(selectedSticker.tags || []).join(', ')}</p>
              <p><strong>Status:</strong> {selectedSticker.status}</p>
              <p><strong>Submitted:</strong> {new Date(selectedSticker.submissionDate).toLocaleDateString()}</p>
              {selectedSticker.approvedDate && <p><strong>Approved:</strong> {new Date(selectedSticker.approvedDate).toLocaleDateString()}</p>}
              <p><strong>Sales:</strong> {selectedSticker.sales}</p>
            </div>
          ) : (
             <form className="space-y-4 text-sm">
                <div>
                  <label htmlFor="name" className="block font-medium text-gray-300">Name</label>
                  <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
                </div>
                 <div>
                  <label htmlFor="imageUrl" className="block font-medium text-gray-300">Image URL</label>
                  <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
                </div>
                <div>
                  <label htmlFor="artistName" className="block font-medium text-gray-300">Artist Name</label>
                  <input type="text" name="artistName" id="artistName" value={formData.artistName || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
                </div>
                 <div>
                  <label htmlFor="category" className="block font-medium text-gray-300">Category</label>
                  <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
                </div>
                 <div>
                  <label htmlFor="price" className="block font-medium text-gray-300">Price</label>
                  <input type="number" step="0.01" name="price" id="price" value={formData.price || 0} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
                </div>
                <div>
                  <label htmlFor="description" className="block font-medium text-gray-300">Description</label>
                  <textarea name="description" id="description" rows={3} value={formData.description || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
                </div>
                 <div>
                  <label htmlFor="tags" className="block font-medium text-gray-300">Tags (comma-separated)</label>
                  <input type="text" name="tags" id="tags" value={(formData.tags || []).join(', ')} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
                </div>
                {modalMode === 'edit' && (
                  <div>
                    <label htmlFor="status" className="block font-medium text-gray-300">Status</label>
                    <select name="status" id="status" value={formData.status || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200">
                      {Object.values(StickerStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default StickerManagementPage;