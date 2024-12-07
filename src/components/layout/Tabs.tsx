import { clsx } from 'clsx';
import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Desktop Tabs */}
      <nav className="hidden md:flex border-b border-gray-200 -mb-px">
        <div className="flex space-x-4 md:space-x-6 lg:space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={clsx(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300',
                {
                  'border-blue-500 text-blue-600': activeTab === tab.id,
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                    activeTab !== tab.id,
                }
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Tabs Dropdown */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex justify-between items-center px-4 py-3 border-b border-gray-200 text-left"
        >
          <span className="text-sm font-medium">
            {tabs.find(tab => tab.id === activeTab)?.label || 'Select a tab'}
          </span>
          <svg 
            className={`w-5 h-5 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div className="absolute z-10 w-full bg-white shadow-lg border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={clsx(
                  'w-full text-left px-4 py-3 text-sm transition-colors duration-300',
                  {
                    'bg-blue-50 text-blue-600': activeTab === tab.id,
                    'text-gray-700 hover:bg-gray-100': activeTab !== tab.id,
                  }
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}