import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(request:Request){
    await dbConnect();
    const session=await auth();
    const user:User=session?.user as User;

    if(!session || !user){
        return Response.json(
            {success:false,message:'Unauthorized'},
            {status:401}
        );
    }

    const userId=new mongoose.Types.ObjectId(user._id);
    try {
        const user=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        if(!user || user.length===0){
            return Response.json(
                {success:false,message:'User not found'},
                {status:401}
            );
        }

        return Response.json(
            {success:true,messages:user[0].messages},
            {status:200}
        )
    } catch (error) {
        console.error('Error getting messages',error);
        return Response.json(
            {success:false,message:'Error getting messages'},
            {status:500}
        );
    }
}