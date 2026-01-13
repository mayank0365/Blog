import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import mongoose from 'mongoose';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';

const app = express();

// Configure CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB once at startup (with connection pooling)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URL, {
    bufferCommands: false,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

//Routes
app.get('/', (req, res) => res.json({ success: true, message: "API is working" }))
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

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