import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, verifyCode} = await request.json();
        const decodedUsername = decodeURIComponent(username); //used to get undecoded username
        
        const user=await UserModel.findOne({username:decodedUsername});
        if(!user){
            return Response.json({ success: false, message: 'User not found' }, { status: 400 });
        }

        const isCodeValid=user.verifyCode===verifyCode;
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date();

        if(!isCodeValid || !isCodeNotExpired){
            return Response.json({ success: false, message: 'Invalid verification code' }, { status: 400 });
        }

        user.isVerified=true;
        await user.save();

        return Response.json({ success: true, message: 'User verified successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error verifying user', error);
        return Response.json({ success: false, message: 'Error verifying user' }, { status: 500 });
    }
}