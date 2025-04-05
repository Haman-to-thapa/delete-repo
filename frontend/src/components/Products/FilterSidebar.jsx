import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
const FilterSidebar = () => {

  //example = url http//localhost742/a=1&b=3 is called useSearchParma
  const [searchParms, setSearchParam] = useSearchParams();

  const navigate = useNavigate()

  const [filter, setFilter] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  })



  const [priceRange, setPriceRange] = useState([0, 100])


  // decode of all default value of filter method 
  const categories = ["Top Wear", "Bottom Wear"];

  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ]

  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ]

  const genders = ["Men", "Female"]


  useEffect(() => {
    const params = Object.fromEntries([...searchParms])

    setFilter({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,

    })
    setPriceRange([0, params.maxPrice || 100]);
  }, [])



  const handleFiterChange = (e) => {

    // add to all filter to add  method and value also 
    const { name, value, checked, type } = e.target;

    let newFilters = { ...filter };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value]
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value)
      }
    } else {
      newFilters[name] = value;
    }

    setFilter(newFilters)
    updateURLParams(newFilters)

  };



  const updateURLParams = (newFilters) => {
    const param = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        // param.append(newFilters[key])
        newFilters[key].forEach(value => param.append(key, value))
      } else if (newFilters[key]) {
        param.append(key, newFilters[key]);
      }
    })
    setSearchParam(param)
    navigate(`?${param.toString()}`)
  }

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filter, minPrice: 0, maxPrice: newPrice }
    setFilter(filter);
    updateURLParams(newFilters);
  }



  return (
    <div
      className=' mb-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

      {/* Categories Filter */}
      <div className="mb-6">
        <label className='block text-gray-600 font-medium mb-2'>
          Category
        </label>
        {categories.map((category) => (
          <div key={category} className='flex  items-center mb-2'>
            <input
              type="radio"
              value={category}
              onChange={handleFiterChange}
              name='category'
              checked={filter.category === category}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className="mb-6">
        <label
          className='block text-gray-600  font-medium mb-2'
        >Gender</label>
        {
          genders.map((gander) => (
            <div key={gander} className='flex items-center mb-2'>
              <input
                type="radio"
                name="gender"
                value={gander}
                onChange={handleFiterChange}
                checked={filter.gender === gander}
                className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
              <span>{gander}</span>
            </div>
          ))
        }
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {
            colors.map((color) => (
              <button

                key={color}
                onClick={handleFiterChange}
                value={color}
                name='color'
                className={`w-8 h-8 cursor-pointer border-gray-300 rounded-full transition hover:scale-105 ${filter.color ? "ring2 ring-blue-500" : ""}`}
                style={{ backgroundColor: color.toLowerCase() }}
              >
              </button>
            ))
          }
        </div>
      </div>

      {/* Size Filter  */}

      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2 focus:ring-blue-400 border-gray-300">Size</label>
        {
          sizes.map((size) => (
            <div key={size} className='flex items-center mb-1'>
              <input
                type="checkbox"
                name="size"
                value={size}
                checked={filter.size.includes(size)}
                onChange={handleFiterChange}
                className="mr-2 h-4 w-4 text-blue-500" />
              <span className='text-gray-700'>{size}</span>
            </div>
          ))
        }
      </div>

      {/*  Material Filter*/}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-600 ">
          Material
        </label>
        {materials.map((material) => (
          <div key={material} className='flex items-center mb-1 gap-1'>
            <input
              type="checkbox"
              name="material"
              value={material}
              checked={filter.material.includes(material)}
              onChange={handleFiterChange}
              className="mr-2 h-4 w-4 text-blue-500" />
            <span className='text-gray-700'>{material}</span>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block font-medium text-gray-600 mb-2">Brand</label>
        {
          brands.map((brand) => (
            <div key={brand} className='flex items-center mb-1'>
              <input type="checkbox" name="brand"
                value={brand}
                onChange={handleFiterChange}
                checked={filter.brand.includes(brand)}
                className="h-4 w-4 mr-2 text-blue-500" />
              <span className='text-gray-700'>{brand}</span>
            </div>
          ))
        }
      </div>

      {/* Price Range Filter */}
      <div className="mb-8 ">
        <label className="block text-gray-600 font-medium mb-2">Price Range</label>
        <input type="range"
          name="priceRange"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer' />
        <div className="flex justify-between text-gray-600 mt-2">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

    </div >
  )
}

export default FilterSidebar