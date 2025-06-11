
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SparklesIcon, MagnifyingGlassIcon, HeartIcon, ShoppingCartIcon, ChevronDownIcon, TagIcon, XMarkIcon } from '../icons/HeroIcons';

const GlobalHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('Stickers');
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    if (paths.length === 0 && location.pathname === '/') return [{ name: 'Home', path: '/marketplace' }]; // Default for root after redirect
    if (paths.length === 0) return [];
    
    let currentPath = '';
    const breadcrumbs = paths.map((path, index) => {
      currentPath += `/${path}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      return { name, path: currentPath };
    });
    // Add Home as the first breadcrumb if not already the only one
    if (breadcrumbs.length > 0 && breadcrumbs[0].path.toLowerCase() !== '/marketplace') {
        return [{ name: 'Home', path: '/marketplace' }, ...breadcrumbs];
    }
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const mainCategories = [
    { name: 'Explore', path: '/marketplace/explore' },
    { name: 'Stickers', path: '/marketplace' },
    { name: 'Clothes', path: '/marketplace/clothes' },
    { name: 'Phone Cases', path: '/marketplace/phone-cases' },
    { name: 'Wall Art', path: '/marketplace/wall-art' },
    { name: 'Home & Living', path: '/marketplace/home-living' },
    { name: 'Kids & Babies', path: '/marketplace/kids-babies' },
    { name: 'Accessories', path: '/marketplace/accessories' },
  ];

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/marketplace" className="flex items-center space-x-2 text-2xl font-bold text-pink-500">
          <SparklesIcon className="h-8 w-8" />
          <span>StickerVerse</span>
        </NavLink>

        <div className="flex-1 max-w-xl mx-4">
          <div className="relative flex items-center">
            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3">
                <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <span className="absolute left-10 top-0 bottom-0 flex items-center text-sm text-gray-700 font-medium bg-gray-100 px-2 rounded-l-md border-r border-gray-300">
                {searchCategory}
                <button onClick={() => {/* TODO: Implement category change or removal */}} className="ml-1 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-3 w-3" />
                </button>
            </span>
            <input 
              type="text"
              placeholder="Search for anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-32 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 shadow-sm"
            />
            <button className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-3 bg-pink-500 text-white rounded-r-md hover:bg-pink-600">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex items-center space-x-5 text-sm font-medium">
          <NavLink to="/sticker-builder" className="hover:text-pink-500">Create</NavLink>
          <NavLink to="/sell-art" className="hover:text-pink-500">Sell Your Art</NavLink>
          {/* <NavLink to="/auth/signin" className="hover:text-pink-500">Sign In</NavLink> */}
          <button className="text-gray-600 hover:text-pink-500">
            <HeartIcon className="h-6 w-6" />
          </button>
          <button className="text-gray-600 hover:text-pink-500 relative">
            <ShoppingCartIcon className="h-6 w-6" />
            <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
          </button>
        </nav>
      </div>

      {/* Bottom Bar - Categories & Breadcrumbs */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between text-sm">
          <nav className="flex items-center space-x-5">
            {mainCategories.map(cat => (
              <NavLink 
                key={cat.name} 
                to={cat.path}
                className={({ isActive }) => 
                  `pb-1 hover:text-pink-600 ${isActive ? 'text-pink-600 border-b-2 border-pink-600 font-semibold' : 'text-gray-600'}`
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </nav>
           {breadcrumbs.length > 0 && (
            <div className="text-xs text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.path}>
                  <NavLink to={crumb.path} className="hover:text-pink-500 hover:underline">{crumb.name}</NavLink>
                  {index < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
