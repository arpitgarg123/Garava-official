import React from 'react'

const TabsNav = ({ tabs, activeTab, setActiveTab }) => {
  return (
   <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${active ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  )
}

export default TabsNav