
import React from 'react';
import Card from '../components/ui/Card';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-100">Settings</h2>
      
      <Card title="General Settings">
        <p className="text-gray-400">General application settings will be available here.</p>
        {/* Example Setting Item */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-300">Site Name</label>
          <input 
            type="text" 
            name="siteName" 
            id="siteName" 
            defaultValue="StickerVerse" 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-gray-200 sm:text-sm"
          />
        </div>
      </Card>

      <Card title="API Keys & Integrations">
        <p className="text-gray-400">Manage API keys and third-party integrations.</p>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-300">Gemini API Key: <span className="text-green-400">Configured via environment variable.</span></p>
        </div>
      </Card>
      
      <Card title="Admin Account">
        <p className="text-gray-400">Manage your administrator account.</p>
         <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Change Password</button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
