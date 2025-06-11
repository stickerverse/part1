
import React, { useState } from 'react';
import { Sticker } from '../../types';
import { HeartIcon, ShoppingCartIcon, InformationCircleIcon } from '../icons/HeroIcons';

interface StickerCardProps {
  sticker: Sticker;
}

const StickerCard: React.FC<StickerCardProps> = ({ sticker }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const discountPercentage = 25; // Example discount
  const originalPrice = sticker.price / (1 - discountPercentage / 100);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col group relative border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-[100/90] overflow-hidden"> {/* Adjusted aspect ratio for better fit */}
        <img 
          src={sticker.imageUrl} 
          alt={sticker.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-70 rounded-full text-gray-600 hover:text-pink-500 hover:bg-opacity-100 transition-colors"
          aria-label="Favorite"
        >
          <HeartIcon className={`h-5 w-5 ${isFavorited ? 'text-pink-500' : ''}`} isFilled={isFavorited} />
        </button>
        <div className="absolute bottom-2 left-2 p-1 bg-black bg-opacity-30 rounded-full text-white cursor-pointer" title={sticker.description}>
            <InformationCircleIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
          {sticker.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          By <a href={`#/artist/${sticker.artistId}`} className="hover:underline text-indigo-500">{sticker.artistName}</a>
        </p>
        
        <div className="mt-2 mb-1 flex-grow"></div> {/* Spacer */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-gray-900">US${sticker.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500 line-through">
              US${originalPrice.toFixed(2)} (-{discountPercentage}%)
            </p>
          </div>
          <button 
            className="p-2 rounded-full text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors"
            aria-label="Add to cart"
            onClick={() => console.log(`Added ${sticker.name} to cart`)}
            >
            <ShoppingCartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickerCard;
