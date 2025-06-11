
import React from 'react';
import { DesignElement } from '../../types';

interface StickerCanvasProps {
  elements: DesignElement[];
  width: number;
  height: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void; // For adding elements on click
}

const StickerCanvas: React.FC<StickerCanvasProps> = ({
  elements,
  width,
  height,
  selectedElementId,
  onSelectElement,
  onClick
}) => {
  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent canvas click from deselecting
    onSelectElement(id);
  };

  return (
    <div 
      className="relative shadow-2xl rounded-lg overflow-hidden border-4 border-gray-600 bg-white" // Added bg-white for canvas
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        id="sticker-canvas-svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onClick={onClick}
        className="cursor-auto" // Default cursor
      >
        <rect id="sticker-canvas-svg-bg" x="0" y="0" width={width} height={height} fill="rgba(255,255,255,0.8)" /> 
        {elements.map((el) => {
          const isSelected = el.id === selectedElementId;
          const commonProps = {
            onClick: (e: React.MouseEvent) => handleElementClick(e, el.id),
            style: { cursor: 'move' },
            transform: `rotate(${el.rotation || 0} ${el.x + el.width / 2} ${el.y + el.height / 2})`,
            opacity: el.opacity,
          };

          let elementRender: React.ReactNode = null;

          switch (el.type) {
            case 'text':
              elementRender = (
                <text
                  {...commonProps}
                  x={el.x}
                  y={el.y + (el.fontSize || 20)} // Adjust y for text baseline
                  fontFamily={el.fontFamily}
                  fontSize={el.fontSize}
                  fill={el.fill}
                  fontWeight={el.fontWeight}
                  fontStyle={el.fontStyle}
                  textAnchor={el.textAlign === 'center' ? 'middle' : el.textAlign === 'right' ? 'end' : 'start'}
                  dominantBaseline="middle"
                >
                  {el.text}
                </text>
              );
              break;
            case 'shape':
              if (el.shapeType === 'rectangle') {
                elementRender = (
                  <rect
                    {...commonProps}
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill={el.fill}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                  />
                );
              } else if (el.shapeType === 'circle') {
                elementRender = (
                  <circle
                    {...commonProps}
                    cx={el.x + el.width / 2}
                    cy={el.y + el.height / 2}
                    r={Math.min(el.width, el.height) / 2}
                    fill={el.fill}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                  />
                );
              }
              // Add more shapes like triangle, star here with SVG paths
              break;
            case 'image':
            case 'clipart':
              elementRender = (
                <image
                  {...commonProps}
                  href={el.src}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  preserveAspectRatio="xMidYMid meet"
                />
              );
              break;
          }
          
          // Simplified selection outline
          const outlinePadding = 5;
          const outlineRect = isSelected && (
             <rect
                x={el.x - outlinePadding}
                y={el.y - outlinePadding}
                width={el.width + (outlinePadding * 2)}
                height={el.height + (outlinePadding*2)}
                fill="none"
                stroke="rgb(99 102 241)" // indigo-500
                strokeWidth="2"
                strokeDasharray="4 4"
              />
          );


          return (
            <g key={el.id}>
              {elementRender}
              {outlineRect}
            </g>
          );
        })}
      </svg>
      {/* Placeholder for more advanced canvas interactions or library */}
       <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-gray-800 bg-opacity-50 px-2 py-1 rounded">
        Simplified SVG Canvas
      </div>
    </div>
  );
};

export default StickerCanvas;
