
import React, { useState, useCallback, useMemo } from 'react';
import Button from '../components/ui/Button';
import { DesignElement, StickerFinalDetails, ActiveTool, ClipartItem, StickerCustomizationConfig } from '../types';
import { STICKER_BUILDER_CONFIG } from '../constants';
import { 
  ArrowUturnLeftIcon, ArrowUturnRightIcon, EyeIcon, ShoppingCartIcon, 
  ChatBubbleLeftEllipsisIcon, Square3Stack3DIcon, PhotoIcon, SparklesIcon,
  RectangleStackIcon, TrashIcon, DocumentDuplicateIcon, ArrowsPointingOutIcon
} from '../components/icons/HeroIcons';
import StickerCanvas from '../components/sticker-builder/StickerCanvas';
import BuilderToolbar from '../components/sticker-builder/BuilderToolbar';
import PropertiesSidebar from '../components/sticker-builder/PropertiesSidebar';

const CustomStickerBuilderPage: React.FC = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [history, setHistory] = useState<DesignElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState<number>(0);

  const [stickerFinalDetails, setStickerFinalDetails] = useState<StickerFinalDetails>({
    size: { 
      widthCM: STICKER_BUILDER_CONFIG.stickerProductOptions.sizes[0].widthCM, 
      heightCM: STICKER_BUILDER_CONFIG.stickerProductOptions.sizes[0].heightCM,
      name: STICKER_BUILDER_CONFIG.stickerProductOptions.sizes[0].name,
    },
    shape: STICKER_BUILDER_CONFIG.stickerProductOptions.shapes[0].value,
    material: STICKER_BUILDER_CONFIG.stickerProductOptions.materials[0].value,
    quantity: 10,
    estimatedPrice: 5.00, // Placeholder
  });

  const selectedElement = useMemo(() => {
    return elements.find(el => el.id === selectedElementId) || null;
  }, [elements, selectedElementId]);

  const updateHistory = (newElements: DesignElement[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      setElements(history[historyStep - 1]);
      setSelectedElementId(null); 
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => prev + 1);
      setElements(history[historyStep + 1]);
      setSelectedElementId(null);
    }
  };
  
  const addElement = (type: 'text' | 'shape' | 'clipart', options?: Partial<DesignElement>) => {
    const newId = `el-${Date.now()}`;
    let newElement: DesignElement;

    const canvas = document.getElementById('sticker-canvas-main'); // Assuming this ID exists for centering
    const canvasCenterX = canvas ? canvas.clientWidth / 2 : STICKER_BUILDER_CONFIG.canvasDefaultWidth / 2;
    const canvasCenterY = canvas ? canvas.clientHeight / 2 : STICKER_BUILDER_CONFIG.canvasDefaultHeight / 2;


    switch (type) {
      case 'text':
        newElement = {
          id: newId,
          type: 'text',
          text: 'Hello!',
          fontFamily: STICKER_BUILDER_CONFIG.availableFonts[0].value,
          fontSize: 30,
          fill: STICKER_BUILDER_CONFIG.defaultTextColor,
          x: canvasCenterX - 50,
          y: canvasCenterY - 15,
          width: 100, // Approximate for text
          height: 30, // Approximate for text
          rotation: 0,
          opacity: 1,
          ...options,
        };
        break;
      case 'shape':
        newElement = {
          id: newId,
          type: 'shape',
          shapeType: 'rectangle',
          fill: STICKER_BUILDER_CONFIG.defaultShapeFill,
          x: canvasCenterX - 50,
          y: canvasCenterY - 25,
          width: 100,
          height: 50,
          rotation: 0,
          opacity: 1,
          ...options,
        };
        break;
      case 'clipart':
         if (!options?.src) {
            console.error("Clipart src is required");
            return;
          }
        newElement = {
          id: newId,
          type: 'clipart', // or 'image'
          src: options.src,
          x: canvasCenterX - 50,
          y: canvasCenterY - 50,
          width: 100, // Default, should be aspect ratio aware
          height: 100, // Default
          rotation: 0,
          fill: 'transparent', // Not applicable for images
          opacity: 1,
          ...options,
        };
        break;
      default:
        return;
    }
    const newElements = [...elements, newElement];
    setElements(newElements);
    updateHistory(newElements);
    setSelectedElementId(newId);
    setActiveTool('select'); // Switch to select tool after adding
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    const newElements = elements.map(el => (el.id === id ? { ...el, ...updates } : el));
    setElements(newElements);
    updateHistory(newElements);
  };
  
  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    updateHistory(newElements);
    setSelectedElementId(null);
  };

  const duplicateElement = (id: string) => {
    const originalElement = elements.find(el => el.id === id);
    if (originalElement) {
      const newId = `el-${Date.now()}`;
      const duplicatedElement: DesignElement = {
        ...originalElement,
        id: newId,
        x: originalElement.x + 20, // Offset duplicate
        y: originalElement.y + 20,
      };
      const newElements = [...elements, duplicatedElement];
      setElements(newElements);
      updateHistory(newElements);
      setSelectedElementId(newId);
    }
  };
  
  const bringForward = (id: string) => {
    const index = elements.findIndex(el => el.id === id);
    if (index < elements.length - 1) {
      const newElements = [...elements];
      const [element] = newElements.splice(index, 1);
      newElements.splice(index + 1, 0, element);
      setElements(newElements);
      updateHistory(newElements);
    }
  };

  const sendBackward = (id: string) => {
    const index = elements.findIndex(el => el.id === id);
    if (index > 0) {
      const newElements = [...elements];
      const [element] = newElements.splice(index, 1);
      newElements.splice(index - 1, 0, element);
      setElements(newElements);
      updateHistory(newElements);
    }
  };


  const handleToolSelect = (tool: ActiveTool) => {
    setActiveTool(tool);
    if (tool !== 'select' && tool !== 'text' && tool !== 'shape' && tool !== 'clipart' && tool !== 'upload') {
      // If a specific element tool is not active, deselect element
      // setSelectedElementId(null); 
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    // If not clicking on an existing element, and a tool like text/shape is active, add element
    // This is simplified. Proper click detection on elements is complex with raw SVG.
    if (activeTool === 'text') {
        // addElement('text', { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    } else if (activeTool === 'shape') {
        // addElement('shape', { x: e.nativeEvent.offsetX - 25, y: e.nativeEvent.offsetY - 25 }); // Adjust for shape size
    } else {
      // Deselect if clicking on canvas background
      if (!(e.target instanceof SVGElement) || e.target.id === 'sticker-canvas-svg-bg') {
         setSelectedElementId(null);
      }
    }
  };


  const handleAddToCart = () => {
    // Logic to save design, calculate final price, and add to cart
    console.log("Adding to cart:", { elements, stickerFinalDetails });
    alert(`Sticker design added to cart (conceptually)! Quantity: ${stickerFinalDetails.quantity}, Price: $${stickerFinalDetails.estimatedPrice.toFixed(2)}`);
    // This would involve API calls in a real app
  };
  
  const calculatePrice = useCallback(() => {
    let basePrice = 2.00; // Smallest, cheapest sticker base
    let complexityFactor = 1 + (elements.length * 0.1); // More elements, more complex
    
    const sizeOpt = STICKER_BUILDER_CONFIG.stickerProductOptions.sizes.find(s => s.name === stickerFinalDetails.size.name) || STICKER_BUILDER_CONFIG.stickerProductOptions.sizes[0];
    const materialOpt = STICKER_BUILDER_CONFIG.stickerProductOptions.materials.find(m => m.value === stickerFinalDetails.material) || STICKER_BUILDER_CONFIG.stickerProductOptions.materials[0];

    basePrice *= sizeOpt.priceFactor;
    basePrice *= materialOpt.priceFactor;
    
    let finalPrice = basePrice * complexityFactor * stickerFinalDetails.quantity;
    setStickerFinalDetails(prev => ({ ...prev, estimatedPrice: Math.max(0.50 * prev.quantity, finalPrice) })); // Min price per sticker
  }, [elements.length, stickerFinalDetails.size, stickerFinalDetails.material, stickerFinalDetails.quantity]);

  React.useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);


  return (
    <div className="flex flex-col h-full bg-gray-850 text-gray-100">
      {/* Top Action Bar */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-700 shadow-md">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-pink-400">Sticker Builder</h2>
          <Button variant="ghost" size="sm" onClick={handleUndo} disabled={historyStep === 0} title="Undo">
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRedo} disabled={historyStep === history.length - 1} title="Redo">
            <ArrowUturnRightIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => alert("Preview not implemented yet")} leftIcon={<EyeIcon className="h-5 w-5" />}>
            Preview
          </Button>
          <Button 
            onClick={handleAddToCart} 
            leftIcon={<ShoppingCartIcon className="h-5 w-5" />}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Add to Cart (${stickerFinalDetails.estimatedPrice.toFixed(2)})
          </Button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <BuilderToolbar 
            activeTool={activeTool} 
            onSelectTool={handleToolSelect}
            onAddText={() => addElement('text')}
            onAddShape={() => addElement('shape')}
        />

        {/* Center Canvas Area */}
        <main 
          id="sticker-canvas-main"
          className="flex-1 flex items-center justify-center p-4 bg-gray-700 overflow-hidden relative"
        >
          <StickerCanvas
            elements={elements}
            width={STICKER_BUILDER_CONFIG.canvasDefaultWidth}
            height={STICKER_BUILDER_CONFIG.canvasDefaultHeight}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onClick={handleCanvasClick}
          />
        </main>

        {/* Right Properties Sidebar */}
        <PropertiesSidebar
          selectedElement={selectedElement}
          stickerDetails={stickerFinalDetails}
          activeTool={activeTool}
          config={STICKER_BUILDER_CONFIG}
          onUpdateElement={updateElement}
          onUpdateStickerDetails={setStickerFinalDetails}
          onDeleteElement={deleteElement}
          onDuplicateElement={duplicateElement}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onAddClipart={(clipart: ClipartItem) => addElement('clipart', { src: clipart.src, width: 100, height: 100, shapeType: undefined, text: undefined }) } // Simplified
          setActiveTool={setActiveTool}
        />
      </div>
    </div>
  );
};

export default CustomStickerBuilderPage;
