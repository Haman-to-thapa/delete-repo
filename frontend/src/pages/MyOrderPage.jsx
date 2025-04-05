import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserOrders } from '../redux/slice/orderSlice'

const MyOrderPage = () => {

  // const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchUserOrders());

  }, [dispatch])
  // useEffect(() => {

  //   //simulate fetching orders

  //   setTimeout(() => {
  //     const mockOrder = [
  //       {
  //         _id: "12345",
  //         createdAt: new Date(),
  //         shippingAddress: { city: "New York", country: "USA" },
  //         orderItmes: [
  //           {
  //             name: "product 1",
  //             image: "https://picsum.photos/500/500?random=1"
  //           },
  //         ],
  //         totalPrice: 100,
  //         isPaid: true,
  //       },
  //       {
  //         _id: "23456",
  //         createdAt: new Date(),
  //         shippingAddress: { city: "New York", country: "USA" },
  //         orderItmes: [
  //           {
  //             name: "product 2",
  //             image: "https://picsum.photos/500/500?random=2"
  //           },
  //         ],
  //         totalPrice: 100,
  //         isPaid: true,
  //       }
  //     ]

  //     setOrders(mockOrder)

  //   }, 1000)

  // }, [])

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Errror : {error}</p>
  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-xl md:text-2xl font-bold mb-6'>My Orders</h2>

      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className='min-w-full text-left text-gray-500'>
          <thead className='bg-gray-100 text-sm uppercase text-gray-700'>
            <tr>
              <th className='py-2 px-4 sm:px-3'>Image</th>
              <th className='py-2 px-4 sm:px-3' >Order Id</th>
              <th className='py-2 px-4 sm:px-3'>Created</th>
              <th className='py-2 px-4 sm:px-3'>Shipping Address</th>
              <th className='py-2 px-4 sm:px-3'>Items</th>
              <th className='py-2 px-4 sm:px-3'>Prices</th>
              <th className='py-2 px-4 sm:px-3'>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              orders.length > 0 ?
                (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => handleRowClick(order._id)}
                      className='border-b hover:border-gray-500 cursor-pointer'>
                      <td className="py-2 px-2 sm:py-4 sm:px-4">
                        <img
                          src={order.orderItmes?.[0]?.image || "/placeholder.png"} // ✅ Safe access
                          alt={order.orderItmes?.[0]?.name || "No Image"} // ✅ Safe access
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                        />
                      </td>

                      <td className='py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-normal'>
                        #{order._id}
                      </td>
                      <td className='py-2 px-2 sm:py-4 sm:px-4'>
                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </td>

                      <td className='py-2 px-2 sm:px-4 sm:py-4'>
                        {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
                      </td>

                      <td className='py-2 px-2 sm:py-4 sm:px-4'>
                        {order.orderItmes}
                      </td>

                      <td className='py-2 px-2 sm:py-4 sm:px-4'>
                        ${order.totalPrice}
                      </td>
                      <td className={`text-center font-semibold  ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {order.isPaid ? " Paid" : "Pending"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className='py-4 px-4 text-center text-gray-500'>
                      You have no order
                    </td>
                  </tr>
                )
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default MyOrderPage