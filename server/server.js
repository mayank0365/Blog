import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import imagekit from './configs/imagekit.js';

const app=express();

// Database connection with error handling
let isConnected = false;
const initDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

//middleware
app.use(cors())
app.use(express.json())

// Initialize DB before handling requests
app.use(async (req, res, next) => {
  try {
    await initDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({ success: false, message: 'Service temporarily unavailable' });
  }
});

//Routes
app.get('/',(req,res)=>res.send("API is working"))
app.use('/api/admin',adminRouter)
app.use('/api/blog',blogRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Only listen in local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}

export default app 