import React from 'react';

const LoadingSkeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variants = {
    default: 'h-4 w-full',
    card: 'h-64 w-full',
    circle: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2'
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

const ProductCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
    <LoadingSkeleton variant="card" />
    <LoadingSkeleton variant="title" />
    <LoadingSkeleton variant="text" />
    <div className="flex justify-between items-center">
      <LoadingSkeleton variant="button" />
      <LoadingSkeleton variant="circle" />
    </div>
  </div>
);

const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

const CartSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
        <LoadingSkeleton variant="card" className="w-20 h-20" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="title" />
          <LoadingSkeleton variant="text" />
          <div className="flex justify-between">
            <LoadingSkeleton variant="button" />
            <LoadingSkeleton variant="text" className="w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export { LoadingSkeleton, ProductCardSkeleton, WishlistSkeleton, CartSkeleton };