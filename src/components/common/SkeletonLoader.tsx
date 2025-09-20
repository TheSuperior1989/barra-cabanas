import React from 'react'

interface SkeletonLoaderProps {
  rows?: number
  className?: string
  type?: 'table' | 'card' | 'list'
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  rows = 5, 
  className = '',
  type = 'table'
}) => {
  const renderTableSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderCardSkeleton = () => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderListSkeleton = () => (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  )

  switch (type) {
    case 'card':
      return renderCardSkeleton()
    case 'list':
      return renderListSkeleton()
    default:
      return renderTableSkeleton()
  }
}

export default SkeletonLoader
