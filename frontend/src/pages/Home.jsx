import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSecion from '../components/Products/GenderCollectionSecion'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeatureSection from '../components/Products/FeatureSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slice/productsSlice'
import axios from 'axios'

// const placeholderProducts = [
//   {
//     _id: 2,
//     name: "Product 2",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=6" }]
//   },
//   {
//     _id: 3,
//     name: "Product 3",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=7" }]
//   },
//   {
//     _id: 4,
//     name: "Product 4",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=8" }]
//   },
//   {
//     _id: 5,
//     name: "Product 5",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=9" }]
//   },
//   {
//     _id: 6,
//     name: "Product 6",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=10" }]
//   },
//   {
//     _id: 7,
//     name: "Product 7",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=11" }]
//   },
//   {
//     _id: 8,
//     name: "Product 8",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=12" }]
//   },
//   {
//     _id: 9,
//     name: "Product 9",
//     price: 100,
//     images: [{ url: "https://picsum.photos/500/500?random=13" }]
//   }
// ]

const Home = () => {
  const dispatch = useDispatch()
  const { products, loading, error, } = useSelector((state) => state.products);

  const [bestSellerProducts, setBestSellerProduct] = useState(null);



  useEffect(() => {
    // Fetch Products for a specific collection
    dispatch(fetchProductsByFilters({
      gender: "Women",
      category: "Bottom Wear",
      limit: 8,
    }))
    // Fetch best seller produt
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error)
      }
    }
    fetchBestSeller();
  }, [dispatch])




  return (
    <div>
      <Hero />
      <GenderCollectionSecion />
      <NewArrivals />

      {/* Best Seller */}
      <div className="container mx-auto">
        <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
        {bestSellerProducts ? (
          <ProductDetails productId={bestSellerProducts._id} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading best seller product...</p>
          </div>
        )}
      </div>
      <div className="container mx-auto">
        <h2 className=' text-3xl text-center font-bold mb-4'>
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeatureSection />
    </div>
  )
}

export default Home