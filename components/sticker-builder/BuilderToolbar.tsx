
import React from 'react';
import Button from '../ui/Button'; // Assuming your Button component can act as an icon button
import { 
  ChatBubbleLeftEllipsisIcon, 
  Square3Stack3DIcon, 
  PhotoIcon, 
  SparklesIcon, 
  PaintBrushIcon,
  CursorArrowRaysIcon // Placeholder for select tool
} from '../icons/HeroIcons';
import { ActiveTool } from '../../types';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  toolName: ActiveTool;
  isActive: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, toolName, isActive, onClick }) => {
  return (
    <Button
      variant={isActive ? 'primary' : 'secondary'}
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-20 p-2 space-y-1 text-xs transition-all duration-150 ease-in-out
                  ${isActive ? 'bg-pink-500 text-white ring-2 ring-pink-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'}`}
      title={label}
    >
      <div className="w-6 h-6 mb-1">{icon}</div>
      <span className="truncate">{label}</span>
    </Button>
  );
};

interface BuilderToolbarProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  onAddText: () => void;
  onAddShape: () => void;
}

const BuilderToolbar: React.FC<BuilderToolbarProps> = ({ activeTool, onSelectTool, onAddText, onAddShape }) => {
  
  const handleToolClick = (tool: ActiveTool) => {
    onSelectTool(tool);
    // If it's an "adder" tool, also perform the add action.
    // The CustomStickerBuilderPage will handle setActiveTool to 'select' after adding.
    if (tool === 'text') onAddText();
    if (tool === 'shape') onAddShape();
    // Clipart and Upload will be handled by panels opening from PropertiesSidebar.
  };

  return (
    <aside className="w-24 bg-gray-800 p-3 space-y-3 flex flex-col items-center border-r border-gray-700 shadow-lg">
      <ToolButton
        icon={<PaintBrushIcon className="h-6 w-6" />} // Using PaintBrush for select/move
        label="Select"
        toolName="select"
        isActive={activeTool === 'select'}
        onClick={() => onSelectTool('select')}
      />
      <ToolButton
        icon={<ChatBubbleLeftEllipsisIcon className="h-6 w-6" />}
        label="Text"
        toolName="text"
        isActive={activeTool === 'text'}
        onClick={() => handleToolClick('text')}
      />
      <ToolButton
        icon={<Square3Stack3DIcon className="h-6 w-6" />}
        label="Shapes"
        toolName="shape"
        isActive={activeTool === 'shape'}
        onClick={() => handleToolClick('shape')}
      />
      <ToolButton
        icon={<SparklesIcon className="h-6 w-6" />}
        label="Clipart"
        toolName="clipart" // This tool primarily opens the clipart panel in properties
        isActive={activeTool === 'clipart'}
        onClick={() => onSelectTool('clipart')}
      />
      <ToolButton
        icon={<PhotoIcon className="h-6 w-6" />}
        label="Upload"
        toolName="upload" // This tool primarily opens the upload panel
        isActive={activeTool === 'upload'}
        onClick={() => onSelectTool('upload')}
      />
    </aside>
  );
};

export default BuilderToolbar;
