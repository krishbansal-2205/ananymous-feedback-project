import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/userModel';
import { User } from 'next-auth';

export async function POST(request: Request) {
   await dbConnect();
   const session = await auth();
   const user: User = session?.user as User;

   if (!session || !user) {
      return Response.json(
         { success: false, message: 'Unauthorized' },
         { status: 401 }
      );
   }

   const userId = user._id;
   const { acceptMessage } = await request.json();

   try {
      const updatedUser = await UserModel.findByIdAndUpdate(
         userId,
         { isAcceptingMessages: acceptMessage },
         { new: true }
      );

      if (!updatedUser) {
         return Response.json(
            { success: false, message: 'User not found' },
            { status: 401 }
         );
      }

      return Response.json(
         {
            success: true,
            message: 'Accept message status changed',
            updatedUser,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error changing accept message status', error);
      return Response.json(
         { success: false, message: 'Error changing accept message status' },
         { status: 500 }
      );
   }
}

export async function GET(request: Request) {
   await dbConnect();
   const session = await auth();
   const user: User = session?.user as User;

   if (!session || !user) {
      return Response.json(
         { success: false, message: 'Unauthorized' },
         { status: 401 }
      );
   }

   const userId = user._id;

   try {
      const foundUser = await UserModel.findById(userId);

      if (!foundUser) {
         return Response.json(
            { success: false, message: 'User not found' },
            { status: 401 }
         );
      }

      return Response.json(
         {
            success: true,
            message: 'Accept message status fetched',
            isAcceptingMessages: foundUser.isAcceptingMessages,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error getting accept message status', error);
      return Response.json(
         { success: false, message: 'Error getting accept message status' },
         { status: 500 }
      );
   }
}
