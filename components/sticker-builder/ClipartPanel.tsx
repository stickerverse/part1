
import React, { useState } from 'react';
import { ClipartItem, StickerCustomizationConfig } from '../../types';

interface ClipartPanelProps {
  categories: StickerCustomizationConfig['clipartCategories'];
  onSelectClipart: (clipart: ClipartItem) => void;
}

const ClipartPanel: React.FC<ClipartPanelProps> = ({ categories, onSelectClipart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.name || 'All');

  const filteredClipart = categories
    .reduce<ClipartItem[]>((acc, category) => {
      if (selectedCategory === 'All' || category.name === selectedCategory) {
        return acc.concat(category.items);
      }
      return acc;
    }, [])
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="p-3 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-200 mb-3">Add Clipart</h3>
      <input
        type="text"
        placeholder="Search clipart..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-3 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:ring-pink-500 focus:border-pink-500 text-sm"
      />
      <div className="mb-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:ring-pink-500 focus:border-pink-500 text-sm"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="flex-grow overflow-y-auto grid grid-cols-3 gap-2 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {filteredClipart.length === 0 && (
          <p className="col-span-3 text-center text-gray-500 text-sm py-4">No clipart found.</p>
        )}
        {filteredClipart.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectClipart(item)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md flex flex-col items-center justify-center aspect-square transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
            title={item.name}
          >
            <img src={item.src} alt={item.name} className="w-12 h-12 object-contain" />
            <span className="text-xs text-gray-400 mt-1 truncate w-full text-center">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClipartPanel;
