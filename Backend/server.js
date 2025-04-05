import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import subscribeRoute from './routes/subscriberRoute.js'
import adminRoutes from './routes/adminRoutes.js'
import productAdminRoutes from './routes/productAdminRoutes.js'
import adminOrderRoutes from './routes/adminOrderRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

dotenv.config()

const PORT = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

// API Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api', subscribeRoute)

// Admin Routes
app.use('/api/admin/users', adminRoutes)
app.use('/api/admin/products', productAdminRoutes)
app.use('/api/admin/orders', adminOrderRoutes)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  
  // Handle client-side routing for admin panel
  app.get('/admin*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
  
  // Handle all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
