
import React, { useState, useMemo } from 'react';
import { MOCK_STICKERS } from '../constants';
import { Sticker } from '../types';
import StickerCard from '../components/marketplace/StickerCard';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import { SparklesIcon } from '../components/icons/HeroIcons'; // For the "Sign up" banner
import Button from '../components/ui/Button'; // For the "Sign up" banner button

const StickerMarketplacePage: React.FC = () => {
  const [allStickers] = useState<Sticker[]>(MOCK_STICKERS.concat(MOCK_STICKERS).concat(MOCK_STICKERS)); // Triple data for more items
  const [filters, setFilters] = useState<{ category?: string; sort?: string }>({ sort: 'relevance' });

  const handleFilterChange = (newFilters: { category?: string; sort?: string }) => {
    setFilters(newFilters);
  };

  const filteredAndSortedStickers = useMemo(() => {
    let result = [...allStickers];

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      result = result.filter(sticker => sticker.category.toLowerCase() === filters.category?.toLowerCase() || sticker.tags.map(t=>t.toLowerCase()).includes(filters.category?.toLowerCase() || ""));
    }

    // Sort
    switch (filters.sort) {
      case 'popular':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'relevance': // Basic relevance: name match, then sales (example)
      default:
        result.sort((a,b) => b.sales - a.sales); // Default to popular for now
        break;
    }
    return result;
  }, [allStickers, filters]);

  return (
    <div className="bg-gray-50 min-h-screen"> {/* Changed main bg to gray-50 to match screenshot page area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Stickers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Personalize your laptop, water bottle, helmet, and more. Save up to 50% when you buy multiple small stickers. 
            Available in glossy, matte, and clear finishes in various sizes.
          </p>
        </div>

        <MarketplaceFilters onFilterChange={handleFilterChange} currentFilters={filters} />

        {/* Promotional Banner */}
        <div className="my-8 p-6 bg-purple-50 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-purple-700">Buy 10 and get <span className="text-purple-900 font-bold">40% off.</span></h2>
          <p className="text-purple-600 mt-1">Discount automatically applied at checkout.</p>
        </div>

        {/* Sticker Grid */}
        {filteredAndSortedStickers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredAndSortedStickers.map(sticker => (
              <StickerCard key={`${sticker.id}-${Math.random()}`} sticker={sticker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700">No stickers found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
        
        {/* Sign Up Banner - like in screenshot */}
        <div className="mt-16 mb-8 p-8 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-800">Sign up and get 25% off your first order.</h2>
                <p className="text-gray-700 mt-2 text-lg">And a ton of exclusive perks and discounts that will help you find what defines you.</p>
            </div>
            <div className="flex-shrink-0">
                 <Button 
                    variant="primary" 
                    size="lg" 
                    className="bg-pink-600 hover:bg-pink-700 text-white !px-10 !py-4 text-base"
                    onClick={() => alert("Redirect to registration page!")}
                >
                    Register
                </Button>
            </div>
            <div className="absolute -bottom-8 -right-5 opacity-50">
                <SparklesIcon className="h-24 w-24 text-pink-400 transform rotate-12" />
            </div>
             <div className="absolute -bottom-5 -left-5 opacity-60">
                <div className="text-6xl transform -rotate-12">😊</div>
            </div>
        </div>


        {/* TODO: Pagination controls */}
      </div>
    </div>
  );
};

export default StickerMarketplacePage;
