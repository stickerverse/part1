
import React, { useState } from 'react';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '../icons/HeroIcons';

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-700 h-16 flex items-center justify-between px-6">
      <div>
        {/* Placeholder for breadcrumbs or page title if needed */}
        <h1 className="text-xl font-semibold text-gray-200">Admin Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white relative">
          <BellIcon className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
        </button>
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            <UserCircleIcon className="h-8 w-8" />
            <span className="hidden md:block">Admin User</span>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
              <a href="#/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</a>
              <a href="#/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</a>
              <hr className="border-gray-700 my-1"/>
              <a href="#/logout" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
