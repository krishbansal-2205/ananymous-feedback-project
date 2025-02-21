'use client';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { VerifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function VerifyAccount() {
   const { username } = useParams();
   const router = useRouter();

   const form = useForm<z.infer<typeof VerifySchema>>({
      resolver: zodResolver(VerifySchema),
      defaultValues: {
         verifyCode: '',
      },
   });

   const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
      try {
         const response = await axios.post('/api/verify-code', {
            username,
            verifyCode: data.verifyCode,
         });
         toast('Success', { description: response.data.message });
         router.replace('/signin');
      } catch (error) {
         console.error('Error verifying account', error);
         toast('Error verifying account', {
            description: (error as AxiosError<ApiResponse>).response?.data
               .message,
         });
      }
   };

   return (
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
         <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
               <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                  Verify Your Account
               </h1>
               <p className='mb-4'>
                  Enter the verification code sent to your email
               </p>
            </div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
               >
                  <FormField
                     name='verifyCode'
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Verification Code</FormLabel>
                           <Input {...field} />
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type='submit'>Verify</Button>
               </form>
            </Form>
         </div>
      </div>
   );
}

export default VerifyAccount;
