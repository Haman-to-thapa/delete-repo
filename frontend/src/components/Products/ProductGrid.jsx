import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-gray-200 rounded-lg p-4">
          <div className="h-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
)

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <ProductSkeleton />
  }

  if (error) {
    return <p className="text-red-500 text-center">Error loading products: {error}</p>
  }

  if (!products || products.length === 0) {
    return <p className="text-gray-500 text-center">No products found</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid