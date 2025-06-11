import React, { useState, useMemo } from 'react';
import Table from '../components/ui/Table';
import { Artist, TableColumn } from '../types';
import { MOCK_ARTISTS } from '../constants';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { EyeIcon, PencilIcon, CheckCircleIcon, UserPlusIcon, XCircleIcon } from '../components/icons/HeroIcons';

const ArtistManagementPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');

  const [formData, setFormData] = useState<Partial<Artist>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode: 'view' | 'edit' | 'add', artist?: Artist) => {
    setModalMode(mode);
    setSelectedArtist(artist || null);
    if ((mode === 'edit' || mode === 'view') && artist) {
      setFormData(artist);
    } else if (mode === 'add') {
      setFormData({ 
        name: '', 
        email: '', 
        bio: '', 
        status: 'Pending Verification', 
        totalSales: 0, 
        stickerCount: 0 
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtist(null);
    setFormData({});
  };

  const handleSaveArtist = () => {
    if (modalMode === 'add') {
      const newArtist: Artist = {
        id: `a${Date.now()}`,
        userId: `u-new-${Date.now()}`, // Link to a new mock user or manage this properly
        joinedDate: new Date().toISOString().split('T')[0],
        ...formData,
        name: formData.name || 'New Artist',
        email: formData.email || '',
        bio: formData.bio || '',
        status: formData.status || 'Pending Verification',
        totalSales: formData.totalSales || 0,
        stickerCount: formData.stickerCount || 0,
      } as Artist; // Type assertion needed due to partial nature of formData
      setArtists(prev => [newArtist, ...prev]);
    } else if (modalMode === 'edit' && selectedArtist) {
      setArtists(prev => prev.map(a => a.id === selectedArtist.id ? { ...a, ...formData } as Artist : a));
    }
    closeModal();
  };
  
  const updateArtistStatus = (artistId: string, status: Artist['status']) => {
    setArtists(prevArtists =>
      prevArtists.map(artist =>
        artist.id === artistId ? { ...artist, status } : artist
      )
    );
  };

  const filteredArtists = useMemo(() => {
    return artists.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [artists, searchTerm]);

  const columns: TableColumn<Artist>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'stickerCount', header: 'Stickers' },
    { key: 'totalSales', header: 'Total Sales', render: (artist) => `$${artist.totalSales.toFixed(2)}` },
    { key: 'status', header: 'Status', render: (artist) => (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
        artist.status === 'Verified' ? 'bg-green-500 text-green-100' :
        artist.status === 'Pending Verification' ? 'bg-yellow-500 text-yellow-100' :
        'bg-red-500 text-red-100' // Suspended
      }`}>{artist.status}</span>
    )},
    { key: 'joinedDate', header: 'Joined', render: (artist) => new Date(artist.joinedDate).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-100">Artist Management</h2>
        <Button onClick={() => openModal('add')} leftIcon={<UserPlusIcon className="h-5 w-5" />}>
            Add Artist
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search artists by name or email..."
        className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table<Artist>
        columns={columns}
        data={filteredArtists}
        renderActions={(artist) => (
          <div className="space-x-1 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => openModal('view', artist)} title="View"><EyeIcon className="h-5 w-5"/></Button>
            <Button variant="ghost" size="sm" onClick={() => openModal('edit', artist)} title="Edit"><PencilIcon className="h-5 w-5"/></Button>
            {artist.status === 'Pending Verification' && (
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300" onClick={() => updateArtistStatus(artist.id, 'Verified')} title="Verify"><CheckCircleIcon className="h-5 w-5"/></Button>
            )}
            {artist.status === 'Verified' && (
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => updateArtistStatus(artist.id, 'Suspended')} title="Suspend"><XCircleIcon className="h-5 w-5"/></Button>
            )}
             {artist.status === 'Suspended' && (
              <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300" onClick={() => updateArtistStatus(artist.id, 'Verified')} title="Unsuspend"><CheckCircleIcon className="h-5 w-5"/></Button>
            )}
          </div>
        )}
      />

      {isModalOpen && (selectedArtist || modalMode === 'add') && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          size="md"
          title={
            modalMode === 'view' ? `Artist: ${selectedArtist?.name}` :
            modalMode === 'edit' ? `Edit Artist: ${selectedArtist?.name}` : 'Add New Artist'
          }
          footer={
             modalMode !== 'view' ? (
              <>
                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button onClick={handleSaveArtist}>
                  {modalMode === 'add' ? 'Create Artist' : 'Save Changes'}
                </Button>
              </>
            ) : <Button onClick={closeModal}>Close</Button>
          }
        >
          {modalMode === 'view' && selectedArtist ? (
            <div className="space-y-3 text-sm text-gray-300">
              <p><strong>ID:</strong> {selectedArtist.id}</p>
              <p><strong>User ID:</strong> {selectedArtist.userId}</p>
              <p><strong>Name:</strong> {selectedArtist.name}</p>
              <p><strong>Email:</strong> {selectedArtist.email}</p>
              <p><strong>Bio:</strong> {selectedArtist.bio}</p>
              <p><strong>Portfolio:</strong> <a href={selectedArtist.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{selectedArtist.portfolioUrl || 'N/A'}</a></p>
              <p><strong>Stickers:</strong> {selectedArtist.stickerCount}</p>
              <p><strong>Total Sales:</strong> ${selectedArtist.totalSales.toFixed(2)}</p>
              <p><strong>Status:</strong> {selectedArtist.status}</p>
              <p><strong>Joined:</strong> {new Date(selectedArtist.joinedDate).toLocaleDateString()}</p>
            </div>
          ) : (
            <form className="space-y-4 text-sm">
              <div>
                <label htmlFor="name" className="block font-medium text-gray-300">Name</label>
                <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium text-gray-300">Email</label>
                <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
              </div>
              <div>
                <label htmlFor="bio" className="block font-medium text-gray-300">Bio</label>
                <textarea name="bio" id="bio" rows={3} value={formData.bio || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
              </div>
              <div>
                <label htmlFor="portfolioUrl" className="block font-medium text-gray-300">Portfolio URL</label>
                <input type="text" name="portfolioUrl" id="portfolioUrl" value={formData.portfolioUrl || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200" />
              </div>
               <div>
                <label htmlFor="status" className="block font-medium text-gray-300">Status</label>
                <select name="status" id="status" value={formData.status || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200">
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ArtistManagementPage;