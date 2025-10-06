import React from 'react'

const StatsCard = ({ title, value, Icon, className = "" }) => {
  return (
     <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-md font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && <Icon className="h-12 w-12 text-blue-600" />}
      </div>
    </div>
  )
}

export default StatsCard