
import React, { useState } from 'react';
import { DesignElement, StickerFinalDetails, StickerCustomizationConfig, ActiveTool, ClipartItem } from '../../types';
import Button from '../ui/Button';
import { TrashIcon, DocumentDuplicateIcon, ArrowUpIcon, ArrowDownIcon } from '../icons/HeroIcons'; // Re-use ArrowUp/Down for layers
import ToolOptionPanel from './ToolOptionPanel';
import StickerOptionsPanel from './StickerOptionsPanel';
import ClipartPanel from './ClipartPanel';

interface PropertiesSidebarProps {
  selectedElement: DesignElement | null;
  stickerDetails: StickerFinalDetails;
  activeTool: ActiveTool;
  config: StickerCustomizationConfig;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onUpdateStickerDetails: React.Dispatch<React.SetStateAction<StickerFinalDetails>>;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onAddClipart: (clipart: ClipartItem) => void;
  setActiveTool: (tool: ActiveTool) => void; // To change tool, e.g., after picking clipart
}

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  selectedElement,
  stickerDetails,
  activeTool,
  config,
  onUpdateElement,
  onUpdateStickerDetails,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onAddClipart,
  setActiveTool,
}) => {
  const [activeTab, setActiveTab] = useState<'element' | 'sticker' | 'clipart' | 'upload'>('element');

  React.useEffect(() => {
    if (activeTool === 'clipart') setActiveTab('clipart');
    else if (activeTool === 'upload') setActiveTab('upload');
    else if (selectedElement) setActiveTab('element');
    else setActiveTab('sticker');
  }, [activeTool, selectedElement]);


  const renderElementActions = () => {
    if (!selectedElement) return null;
    return (
      <div className="p-3 border-b border-gray-700">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Actions for "{selectedElement.type}"</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" onClick={() => onDuplicateElement(selectedElement.id)} leftIcon={<DocumentDuplicateIcon className="h-4 w-4"/>}>Duplicate</Button>
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => onDeleteElement(selectedElement.id)} leftIcon={<TrashIcon className="h-4 w-4"/>}>Delete</Button>
          <Button variant="ghost" size="sm" onClick={() => onBringForward(selectedElement.id)} leftIcon={<ArrowUpIcon className="h-4 w-4"/>}>Forward</Button>
          <Button variant="ghost" size="sm" onClick={() => onSendBackward(selectedElement.id)} leftIcon={<ArrowDownIcon className="h-4 w-4"/>}>Backward</Button>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col overflow-y-auto shadow-lg">
      <div className="p-1 bg-gray-750 border-b border-gray-700">
        <div className="flex space-x-1">
          <Button 
            variant={activeTab === 'element' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('element')}
            className={`flex-1 ${activeTab === 'element' ? 'bg-pink-500' : ''}`}
            disabled={!selectedElement && activeTool !== 'text' && activeTool !== 'shape'}
          >
            Element
          </Button>
          <Button 
            variant={activeTab === 'clipart' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => { setActiveTab('clipart'); setActiveTool('clipart');}}
            className={`flex-1 ${activeTab === 'clipart' ? 'bg-pink-500' : ''}`}
          >
            Clipart
          </Button>
          <Button 
            variant={activeTab === 'sticker' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('sticker')}
            className={`flex-1 ${activeTab === 'sticker' ? 'bg-pink-500' : ''}`}
          >
            Sticker
          </Button>
        </div>
      </div>

      {activeTab === 'element' && (
        <>
          {renderElementActions()}
          { (selectedElement || activeTool === 'text' || activeTool === 'shape') &&
            <ToolOptionPanel
              element={selectedElement}
              activeTool={activeTool}
              config={config}
              onUpdate={(updates) => {
                if (selectedElement) onUpdateElement(selectedElement.id, updates);
                // If no element selected but tool active (e.g. text tool before first text added),
                // this panel could show default creation options. For now, it updates selected.
              }}
            />
          }
          {!selectedElement && activeTool !== 'text' && activeTool !== 'shape' && (
             <div className="p-4 text-center text-gray-500 text-sm">Select an element on the canvas to edit its properties, or choose a tool to add a new one.</div>
          )}
        </>
      )}

      {activeTab === 'clipart' && (
        <ClipartPanel 
          categories={config.clipartCategories} 
          onSelectClipart={(clipart) => {
            onAddClipart(clipart);
            setActiveTab('element'); // Switch to element tab to edit the newly added clipart
          }}
        />
      )}
      
      {activeTab === 'upload' && ( // Placeholder for upload UI
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Upload Image</h3>
           <input type="file" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
          <p className="text-xs text-gray-500 mt-2">Max file size: 5MB. Supported types: PNG, JPG.</p>
        </div>
      )}


      {activeTab === 'sticker' && (
        <StickerOptionsPanel
          details={stickerDetails}
          config={config.stickerProductOptions}
          onUpdateDetails={onUpdateStickerDetails}
        />
      )}
      
      {/* Conceptual Layers Panel - very simplified */}
      {/* <div className="mt-auto p-3 border-t border-gray-700">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Layers (Conceptual)</h4>
        <div className="text-xs text-gray-500">Layer management UI would go here.</div>
      </div> */}
    </aside>
  );
};

export default PropertiesSidebar;
