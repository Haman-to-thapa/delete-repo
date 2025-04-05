import React from 'react'
import { Link } from 'react-router-dom'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { FiPhoneCall } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className='border-t py-12'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] gap-8 px-4 lg:px-0'>

        <div>
          <h3 className='text-lg text-gray-800 mb-4 '>Newletter</h3>
          <p className='text-gray-500 mb-4'>Be ther first to hear about new produts, exclusive events, and online offers</p>
          <p className='font-medium text-sm text-gray-600 mb-6'>sign up and get 10% off your first order.</p>

          {/* Newsletter form */}

          <form className='flex'>
            <input type="text"
              placeholder='Enter Your Email'
              className=' w-full text-sm border-t border-l border-b border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
            />
            <button type="submit" className='bg-black text-white px-6 py3 text-sm rounded-r-md hover:bg-gray-800 transition-all'>Subscribe</button>
          </form>
        </div>

        {/* Shop Link  */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>
            Shop
          </h3>
          <ul className='space-y-2'>
            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>Men's Top Wear</Link>
            </li>

            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>Women's Top Wear</Link>
            </li>

            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>Men's Bottom Wear</Link>
            </li>

            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>Women's Bottom Wear</Link>
            </li>
          </ul>
        </div>

        {/* Support LInk */}

        <div>
          <h3 className='text-lg text-gray-800 mb-4'>
            Support
          </h3>
          <ul className='space-y-2'>
            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>Contact Us</Link>
            </li>

            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>About us</Link>
            </li>

            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>FA@s</Link>
            </li>

            <li>
              <Link to="#" className='font-medium text-sm 
              hover:text-gray-600'>Features</Link>
            </li>
          </ul>
        </div>

        {/* follow us  */}
        <div>
          <h3 className=' text-lg text-gray-800 mb-4'> Follow Us</h3>
          <div className='flex items-center space-x-4 mb-6'>
            <a href="https://www.facebook.com" target='_blank' rel='nooopner noreferrer'
              className='hover:text-gray-500'
            > <TbBrandMeta
                className='h-6 w-6 hover:text-gray-800' />
            </a>

            <a href="https://www.instagram.com" target='_blank' rel='nooopner noreferrer'
              className='hover:text-gray-500'
            > <IoLogoInstagram
                className='h-6 w-6 hover:text-gray-800' />
            </a>

            <a href="https://www.twitter.com" target='_blank' rel='nooopner noreferrer'
              className='hover:text-gray-500'
            > <RiTwitterXLine
                className='h-6 w-6 hover:text-gray-800' />
            </a>
          </div>

          <p className='text-gray-500'>Call Us</p>
          <p> <FiPhoneCall className='h-6 w-6 hover:text-gray-700 mr-2' />
            + 123 456 789</p>
        </div>

      </div>

      {/* Footer bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-gray-200 pt-6" >
        <p
          className='text-gray-500 text-sm tracking-tighter text-center'
        >@ 2023 , CompileTab. Al Right Reserved By me</p>
      </div>

    </footer>
  )
}

export default Footer