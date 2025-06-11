
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-gray-850 shadow-lg rounded-xl p-6 border border-gray-700 ${className}`}>
      {title && <h3 className={`text-xl font-semibold text-gray-100 mb-4 ${titleClassName}`}>{title}</h3>}
      {children}
    </div>
  );
};

// Specific StatCard variant
import { StatCardData } from '../../types';
import { ArrowUpIcon, ArrowDownIcon } from '../icons/HeroIcons';

export const StatCard: React.FC<StatCardData> = ({ title, value, icon, percentageChange }) => {
  const isPositive = percentageChange !== undefined && percentageChange >= 0;
  return (
    <Card className="bg-gray-850 hover:bg-gray-800 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-indigo-500 bg-opacity-20 rounded-full text-indigo-400">
          {icon}
        </div>
      </div>
      {percentageChange !== undefined && (
        <div className={`mt-2 flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
          <span>{Math.abs(percentageChange)}%</span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </Card>
  );
};


export default Card;
