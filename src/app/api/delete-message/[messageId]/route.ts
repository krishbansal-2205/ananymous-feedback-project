import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/userModel';
import { User } from 'next-auth';

export async function DELETE(
   request: Request,
   { params }: { params: { messageId: string } }
) {
   const messageId = params.messageId;
   await dbConnect();
   const session = await auth();
   const user = session?.user as User;

   if (!session || !user) {
      return Response.json(
         { success: false, message: 'Unauthorized' },
         { status: 401 }
      );
   }

   try {
      const updatedResult = await UserModel.updateOne(
         { _id: user._id },
         { $pull: { messages: { _id: messageId } } }
      );
      if (updatedResult.modifiedCount === 0) {
         return Response.json(
            {
               success: false,
               message: 'Message not found',
            },
            { status: 404 }
         );
      }

      return Response.json(
         { success: true, message: 'Message deleted successfully' },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error deleting message', error);
      return Response.json(
         { success: false, message: 'Error deleting message' },
         { status: 500 }
      );
   }
}
