import React from 'react';

type Tab = {
  id: string;
  label: string;
  icon: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
};

export const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex bg-gray-50 border-b border-gray-200 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`py-4 px-6 text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center ${
            activeTab === tab.id
              ? 'bg-white text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};