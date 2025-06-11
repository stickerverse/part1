
import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons/HeroIcons';

const categories = [
  "Fashionable", "Sports", "Movies", "Superhero", "Music", "Music group", 
  "Hobbies", "Summer", "Animals", "Patterns", "Culture", "Occupations", 
  "Games", "Anime", "Quotes", "Funny", "Cute", "Artistic", "Abstract", "Food"
];

interface MarketplaceFiltersProps {
  onFilterChange: (filters: { category?: string; sort?: string }) => void;
  currentFilters: { category?: string; sort?: string };
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: string) => {
    const newCategory = currentFilters.category === category ? undefined : category;
    onFilterChange({ ...currentFilters, category: newCategory });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...currentFilters, sort: e.target.value });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust as needed
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };


  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button 
            onClick={() => handleCategoryClick('All')}
            className={`px-4 py-2 rounded-md text-sm font-medium mr-3
                        ${(!currentFilters.category || currentFilters.category === 'All') 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            All stickers
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters (2) {/* Placeholder count */}
          </button>
        </div>
        <div className="relative">
          <select 
            value={currentFilters.sort || 'relevance'}
            onChange={handleSortChange}
            className="appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      <div className="relative flex items-center">
        <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 z-10 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-md -ml-3 text-gray-600 hover:text-indigo-600"
            aria-label="Scroll left"
        >
            <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div ref={scrollContainerRef} className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.slice(0, showAllCategories ? categories.length : 10).map(cat => (
            <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors
                            ${currentFilters.category === cat 
                                ? 'bg-indigo-500 text-white font-semibold' 
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
            >
                {cat}
            </button>
            ))}
            {!showAllCategories && categories.length > 10 && (
            <button 
                onClick={() => setShowAllCategories(true)}
                className="px-3.5 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
                More...
            </button>
            )}
        </div>
        <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 z-10 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-md -mr-3 text-gray-600 hover:text-indigo-600"
            aria-label="Scroll right"
        >
            <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
