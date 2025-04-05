import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {

  const [searchParms, setSearchParam] = useSearchParams();


  // const handleSortChange = (e) => {
  //   const sortBy = e.target.value;

  //   searchParms.set("sortBy", sortBy);
  //   setSearchParam(searchParms)

  // }

  const handleSortChange = (e) => {
    const sortBy = e.target.value;

    searchParms.set('sortBy', sortBy);
    setSearchParam(searchParms)
  }

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        // value={searchParms.get('sortBy') || ""}

        value={searchParms.get("sortBy") || ''}
      >
        <option value="Default">Default</option>
        <option value="priceAsc">Pirce: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>


      </select>
    </div>
  )
}

export default SortOptions