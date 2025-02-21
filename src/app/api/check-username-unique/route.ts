import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/userModel';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signupSchema';

const UsernameQuerySchema = z.object({
   username: usernameValidation,
});

export async function GET(request: Request) {
   //    if (request.method !== 'GET') {     // not required in latest nextjs version
   //       return Response.json(
   //          { success: false, message: 'Method not allowed' },
   //          { status: 405 }
   //       );
   //    }

   await dbConnect();

   try {
      const { searchParams } = new URL(request.url);
      const queryParams = { username: searchParams.get('username') };
      const result = UsernameQuerySchema.safeParse(queryParams);
      console.log(result);
      if (!result.success) {
         const errors = result.error.format().username?._errors || [];
         return Response.json(
            {
               success: false,
               message:
                  errors.length > 0 ? errors.join(', ') : 'Invalid username',
            },
            { status: 400 }
         );
      }

      const { username } = result.data;
      const existingVerifiedUser = await UserModel.findOne({
         username,
         isVerified: true,
      });
      if (existingVerifiedUser) {
         return Response.json(
            { success: false, message: 'Username is already taken' },
            { status: 400 }
         );
      }

      return Response.json(
         { success: true, message: 'Username is available' },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error checking username', error);
      return Response.json(
         { success: false, message: 'Error checking username' },
         { status: 500 }
      );
   }
}
