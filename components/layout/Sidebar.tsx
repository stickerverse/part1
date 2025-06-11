
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChartPieIcon, UsersIcon, SparklesIcon as StickerIcon, UserGroupIcon as ArtistIcon, ShoppingCartIcon, CogIcon, CommandLineIcon, PaintBrushIcon } from '../icons/HeroIcons'; // Added PaintBrushIcon

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isPrimaryAction?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isPrimaryAction = false }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out
         ${isActive 
           ? (isPrimaryAction ? 'bg-pink-600 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg') 
           : (isPrimaryAction ? 'bg-pink-500 text-pink-100 hover:bg-pink-600 hover:text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200')
         }`
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-5 flex flex-col">
      <div className="text-2xl font-bold text-white mb-8 flex items-center space-x-2">
        <StickerIcon className="h-8 w-8 text-indigo-400" />
        <span>StickerVerse</span>
      </div>
      
      {/* Customer-facing primary action */}
      <div className="mb-6">
        <NavItem 
          to="/sticker-builder" 
          icon={<PaintBrushIcon className="h-6 w-6" />} 
          label="Create Your Sticker!"
          isPrimaryAction={true} 
        />
      </div>

      <nav className="flex-grow space-y-1">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-2 px-1">Admin Tools</div>
        <NavItem to="/overview" icon={<ChartPieIcon className="h-6 w-6" />} label="Overview" />
        <NavItem to="/users" icon={<UsersIcon className="h-6 w-6" />} label="Users" />
        <NavItem to="/stickers" icon={<StickerIcon className="h-6 w-6" />} label="Stickers" />
        <NavItem to="/artists" icon={<ArtistIcon className="h-6 w-6" />} label="Artists" />
        <NavItem to="/orders" icon={<ShoppingCartIcon className="h-6 w-6" />} label="Orders" />
        <NavItem to="/ai-tools" icon={<CommandLineIcon className="h-6 w-6" />} label="AI Tools" />
      </nav>
      <div className="mt-auto">
        <NavItem to="/settings" icon={<CogIcon className="h-6 w-6" />} label="Settings" />
      </div>
    </div>
  );
};

export default Sidebar;
