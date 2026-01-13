import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";


export const adminLogin=async (req,res)=>{
    try{
        const {email,password}=req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Trim spaces and compare
        const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
        const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();
        
        console.log('Login attempt:', { 
            receivedEmail: email, 
            expectedEmail: adminEmail,
            emailMatch: email === adminEmail,
            passwordMatch: password === adminPassword
        });

        if(email !== adminEmail || password !== adminPassword){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        const token=jwt.sign({email},process.env.JWT_SECRET, { expiresIn: '7d' });
        
        return res.status(200).json({
            success:true,
            token
        });

    }
    catch(error){
        console.error('Login error:', error);
        res.status(500).json({success:false,message:error.message});
    }
}

export const getAllBlogsAdmin=async (req,res)=>{
    try{
       const blogs=await Blog.find({}).sort({createdAt:-1});
       res.json({success:true,
        blogs
       })
    }
    catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const getAllComments=async (req,res)=>{
    try{
        const comments=await Comment.find({}).populate("blog").sort({createdAt:-1});
        res.json({
            success:true,
            comments
        })

    }
    catch(error){
       res.json({
        success:false,
        message:error.message
       })
    }
}

export const getDashboard=async (req,res)=>{
    try{
         // Add timeout for database queries
         const queryPromises = [
           Blog.find({}).sort({createdAt:-1}).limit(5),
           Blog.countDocuments(),
           Comment.countDocuments(),
           Blog.countDocuments({isPublished:false})
         ];

         const timeoutPromise = new Promise((_, reject) => 
           setTimeout(() => reject(new Error('Database query timeout')), 25000)
         );

         const [recentBlogs, blogs, comments, drafts] = await Promise.race([
           Promise.all(queryPromises),
           timeoutPromise
         ]);

         const dashboardData ={
            blogs,comments,drafts,recentBlogs
         }
         res.json({
            success:true,
            dashboardData
         })
    }
    catch(error){
         console.error('Dashboard error:', error);
         res.status(500).json({
            success:false,
            message:error.message || 'Failed to fetch dashboard data'
         })
    }
}

export const deleteCommentById=async (req,res)=>{
    try{
        const {id}=req.body;
        await Comment.findByIdAndDelete(id);
        res.json({
            success:true,
            message:"Comment deleted Successfully"
        })
    }
    catch(error){
      res.json({
        success:false,
        message:error.message
      })
    }
}

export const approveCommentById=async (req,res)=>{
    try{
      const {id}=req.body;
      await Comment.findByIdAndUpdate(id,{isApproved:true});
      res.json({success:true,
        message:"Comment approved successfully"
      })
    }
    catch(error){
        res.json({success:false,
            message:error.message
        })
    }
}