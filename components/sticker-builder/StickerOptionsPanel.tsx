
import React from 'react';
import { StickerFinalDetails, StickerCustomizationConfig } from '../../types';

interface StickerOptionsPanelProps {
  details: StickerFinalDetails;
  config: StickerCustomizationConfig['stickerProductOptions'];
  onUpdateDetails: React.Dispatch<React.SetStateAction<StickerFinalDetails>>;
}

const InputGroup: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {children}
  </div>
);

const StickerOptionsPanel: React.FC<StickerOptionsPanelProps> = ({ details, config, onUpdateDetails }) => {
  
  const handleDetailChange = (key: keyof StickerFinalDetails, value: any) => {
    onUpdateDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleSizeChange = (selectedSizeName: string) => {
    const selectedSize = config.sizes.find(s => s.name === selectedSizeName);
    if (selectedSize) {
      onUpdateDetails(prev => ({ 
        ...prev, 
        size: { 
            name: selectedSize.name, 
            widthCM: selectedSize.widthCM, 
            heightCM: selectedSize.heightCM 
        } 
      }));
    }
  };


  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Sticker Options</h3>
      
      <InputGroup label="Size">
        <select
          value={details.size.name}
          onChange={(e) => handleSizeChange(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
        >
          {config.sizes.map(size => (
            <option key={size.name} value={size.name}>
              {size.name} ({size.widthCM}x{size.heightCM} cm)
            </option>
          ))}
        </select>
      </InputGroup>

      {/* If current size is 'Custom', show width/height inputs */}
      {details.size.name === 'Custom' && (
        <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-gray-700">
            <InputGroup label="Width (cm)">
                <input type="number" value={details.size.widthCM} min="1" max="50" step="0.5"
                onChange={e => onUpdateDetails(prev => ({...prev, size: {...prev.size, widthCM: parseFloat(e.target.value)} }))}
                className="w-full bg-gray-600 border-gray-500 rounded p-1.5 text-sm" />
            </InputGroup>
            <InputGroup label="Height (cm)">
                 <input type="number" value={details.size.heightCM} min="1" max="50" step="0.5"
                 onChange={e => onUpdateDetails(prev => ({...prev, size: {...prev.size, heightCM: parseFloat(e.target.value)} }))}
                 className="w-full bg-gray-600 border-gray-500 rounded p-1.5 text-sm" />
            </InputGroup>
        </div>
      )}

      <InputGroup label="Shape">
        <select
          value={details.shape}
          onChange={(e) => handleDetailChange('shape', e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
        >
          {config.shapes.map(shape => (
            <option key={shape.value} value={shape.value}>{shape.name}</option>
          ))}
        </select>
      </InputGroup>

      <InputGroup label="Material">
        <select
          value={details.material}
          onChange={(e) => handleDetailChange('material', e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
        >
          {config.materials.map(mat => (
            <option key={mat.value} value={mat.value}>{mat.name} - {mat.description}</option>
          ))}
        </select>
      </InputGroup>

      <InputGroup label="Quantity">
        <input
          type="number"
          value={details.quantity}
          onChange={(e) => handleDetailChange('quantity', parseInt(e.target.value, 10))}
          min="1"
          max="1000" // Example max
          step="1" // Or common pack sizes like 10, 25, 50
          className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
        />
      </InputGroup>
      
      <div className="pt-3 border-t border-gray-700">
        <p className="text-gray-300">Estimated Price: <span className="text-xl font-bold text-pink-400">${details.estimatedPrice.toFixed(2)}</span></p>
        <p className="text-xs text-gray-500">Price updates based on options and design complexity.</p>
      </div>
    </div>
  );
};

export default StickerOptionsPanel;
