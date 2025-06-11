
import React from 'react';
import { TableColumn } from '../../types';

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  renderActions?: (item: T) => React.ReactNode;
  className?: string;
}

const Table = <T extends { id: string | number },>(
  { columns, data, onRowClick, renderActions, className = '' }: TableProps<T>
): React.ReactNode => {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center py-8">No data available.</p>;
  }

  return (
    <div className={`overflow-x-auto bg-gray-850 shadow-md rounded-lg border border-gray-700 ${className}`}>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-750">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-gray-850 divide-y divide-gray-700">
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`hover:bg-gray-800 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={`${item.id}-${String(col.key)}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
              {renderActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
