import mongoose from "mongoose";

const connectDB=async ()=>{
    try{
        mongoose.connection.on('connected',()=> console.log("Database Connected"));
        mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

        await mongoose.connect(`${process.env.MONGODB_URL}/blog`, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            socketTimeoutMS: 45000, // 45 second socket timeout
            maxPoolSize: 10, // Maximum connection pool size
            minPoolSize: 2,  // Minimum connection pool size
        });
        
    } catch(error){
        console.error('Database connection failed:', error.message);
        throw error; // Re-throw to handle in calling code
    }
}

export default connectDB;