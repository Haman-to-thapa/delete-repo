import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full aspect-square mb-4">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
          )}
          <img
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <h3 className="text-sm mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-500 font-medium text-sm">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard; 