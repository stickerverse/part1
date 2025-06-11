
import React from 'react';
import GlobalHeader from './GlobalHeader';
// import GlobalFooter from './GlobalFooter'; // Future addition

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <GlobalHeader />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      {/* <GlobalFooter /> */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center text-sm">
        © {new Date().getFullYear()} StickerVerse. All rights reserved. (Placeholder Footer)
      </footer>
    </div>
  );
};

export default CustomerLayout;
