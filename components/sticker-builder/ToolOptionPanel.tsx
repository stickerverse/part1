
import React from 'react';
import { DesignElement, StickerCustomizationConfig, ActiveTool } from '../../types';
import { EyeDropperIcon } from '../icons/HeroIcons';

interface ToolOptionPanelProps {
  element: DesignElement | null;
  activeTool: ActiveTool; // To show relevant default options if no element selected but tool is active
  config: StickerCustomizationConfig;
  onUpdate: (updates: Partial<DesignElement>) => void;
}

const InputGroup: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={`mb-3 ${className}`}>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    {children}
  </div>
);

const NumberInput: React.FC<{ value: number; onChange: (val: number) => void; min?: number; max?: number; step?: number; }> = ({ value, onChange, ...props }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-1.5 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
    {...props}
  />
);

const ColorInput: React.FC<{ value: string; onChange: (val: string) => void; availableColors: string[] }> = ({ value, onChange, availableColors }) => (
  <div className="flex items-center space-x-2">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-gray-700"
    />
    <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow bg-gray-700 border-gray-600 rounded-md shadow-sm p-1.5 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500 appearance-none"
    >
        {availableColors.map(color => (
            <option key={color} value={color} style={{ backgroundColor: color }} className="text-white">
                {color}
            </option>
        ))}
    </select>
  </div>
);


const ToolOptionPanel: React.FC<ToolOptionPanelProps> = ({ element, activeTool, config, onUpdate }) => {
  if (!element && (activeTool !== 'text' && activeTool !== 'shape')) {
     return <div className="p-4 text-sm text-gray-500">Select an element or tool.</div>;
  }
  
  // Use element properties if an element is selected, otherwise use defaults for active tool
  const currentProps = element || { // Defaults for when tool is active but no element yet
    type: activeTool,
    text: "New Text",
    fontFamily: config.availableFonts[0].value,
    fontSize: 20,
    fill: activeTool === 'text' ? config.defaultTextColor : config.defaultShapeFill,
    shapeType: 'rectangle',
    width: 100,
    height: 50,
    opacity: 1,
    rotation: 0,
  } as Partial<DesignElement>;


  const handleUpdate = (key: keyof DesignElement, value: any) => {
    onUpdate({ [key]: value });
  };

  const renderTextOptions = () => (
    <>
      <InputGroup label="Content">
        <textarea
          value={currentProps.text || ''}
          onChange={(e) => handleUpdate('text', e.target.value)}
          rows={2}
          className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-1.5 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
        />
      </InputGroup>
      <InputGroup label="Font Family">
        <select
          value={currentProps.fontFamily}
          onChange={(e) => handleUpdate('fontFamily', e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-1.5 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
        >
          {config.availableFonts.map(font => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
          ))}
        </select>
      </InputGroup>
      <div className="grid grid-cols-2 gap-x-3">
        <InputGroup label="Font Size">
          <NumberInput value={currentProps.fontSize || 20} onChange={(val) => handleUpdate('fontSize', val)} min={8} max={144}/>
        </InputGroup>
        <InputGroup label="Color">
          <ColorInput value={currentProps.fill || config.defaultTextColor} onChange={(val) => handleUpdate('fill', val)} availableColors={config.availableColors} />
        </InputGroup>
      </div>
       <div className="grid grid-cols-3 gap-x-2">
            <InputGroup label="Weight">
                 <select value={currentProps.fontWeight || 'normal'} onChange={(e) => handleUpdate('fontWeight', e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-1.5 text-sm">
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                </select>
            </InputGroup>
            <InputGroup label="Style">
                <select value={currentProps.fontStyle || 'normal'} onChange={(e) => handleUpdate('fontStyle', e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-1.5 text-sm">
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                </select>
            </InputGroup>
            <InputGroup label="Align">
                 <select value={currentProps.textAlign || 'left'} onChange={(e) => handleUpdate('textAlign', e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-1.5 text-sm">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </InputGroup>
        </div>
    </>
  );

  const renderShapeOptions = () => (
    <>
      <InputGroup label="Shape Type">
        <select
          value={currentProps.shapeType || 'rectangle'}
          onChange={(e) => handleUpdate('shapeType', e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-1.5 text-gray-200 text-sm focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          {/* Add more shapes here */}
        </select>
      </InputGroup>
      <InputGroup label="Fill Color">
        <ColorInput value={currentProps.fill || config.defaultShapeFill} onChange={(val) => handleUpdate('fill', val)} availableColors={config.availableColors} />
      </InputGroup>
       <InputGroup label="Stroke Color">
        <ColorInput value={currentProps.stroke || '#000000'} onChange={(val) => handleUpdate('stroke', val)} availableColors={config.availableColors} />
      </InputGroup>
      <InputGroup label="Stroke Width">
        <NumberInput value={currentProps.strokeWidth || 0} onChange={(val) => handleUpdate('strokeWidth', val)} min={0} max={20}/>
      </InputGroup>
    </>
  );

  const renderImageOptions = () => (
    <>
      {/* For images/clipart, options might include opacity, or specific image adjustments if supported */}
      <p className="text-sm text-gray-400">Image: {element?.src?.substring(0,30)}...</p>
    </>
  );

  const renderGenericOptions = () => (
    // Options applicable to most elements
    <>
      <div className="grid grid-cols-2 gap-x-3">
        <InputGroup label="Width (px)">
          <NumberInput value={currentProps.width || 100} onChange={(val) => handleUpdate('width', val)} min={10}/>
        </InputGroup>
        <InputGroup label="Height (px)">
          <NumberInput value={currentProps.height || 100} onChange={(val) => handleUpdate('height', val)} min={10}/>
        </InputGroup>
      </div>
      <div className="grid grid-cols-2 gap-x-3">
        <InputGroup label="Rotation (°)">
          <NumberInput value={currentProps.rotation || 0} onChange={(val) => handleUpdate('rotation', val)} min={0} max={360} step={1}/>
        </InputGroup>
        <InputGroup label="Opacity (%)">
          <NumberInput value={(currentProps.opacity ?? 1) * 100} onChange={(val) => handleUpdate('opacity', val / 100)} min={0} max={100} step={1}/>
        </InputGroup>
      </div>
       <div className="grid grid-cols-2 gap-x-3">
        <InputGroup label="X Position">
          <NumberInput value={currentProps.x || 0} onChange={(val) => handleUpdate('x', val)} />
        </InputGroup>
        <InputGroup label="Y Position">
          <NumberInput value={currentProps.y || 0} onChange={(val) => handleUpdate('y', val)} />
        </InputGroup>
      </div>
    </>
  );
  
  let specificOptions = null;
  const toolOrElementType = element ? element.type : activeTool;

  switch (toolOrElementType) {
    case 'text':
      specificOptions = renderTextOptions();
      break;
    case 'shape':
      specificOptions = renderShapeOptions();
      break;
    case 'image':
    case 'clipart':
      specificOptions = renderImageOptions();
      break;
  }

  return (
    <div className="p-4 space-y-3">
      {specificOptions}
      {(toolOrElementType === 'shape' || toolOrElementType === 'image' || toolOrElementType === 'clipart' || toolOrElementType === 'text') && renderGenericOptions()}
    </div>
  );
};

export default ToolOptionPanel;
