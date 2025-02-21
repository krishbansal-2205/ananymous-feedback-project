'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SigninSchema } from '@/schemas/signinSchema';

export default function SignInForm() {
   const router = useRouter();

   const form = useForm<z.infer<typeof SigninSchema>>({
      resolver: zodResolver(SigninSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   });

   const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
      const result = await signIn('credentials', {
         redirect: false,
         email: data.email,
         password: data.password,
      });

      if (result?.error) {
         if (result.error === 'CredentialsSignin') {
            toast('Login Failed', {
               description: 'Incorrect username or password',
            });
         } else {
            toast('Error', {
               description: result.error,
            });
         }
      }

      if (result?.url) {
         router.replace('/dashboard');
      }
   };

   return (
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
         <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
               <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                  Welcome Back to AMA
               </h1>
               <p className='mb-4'>
                  Sign in to continue your secret conversations
               </p>
            </div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
               >
                  <FormField
                     name='email'
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <Input {...field} />
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     name='password'
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <Input type='password' {...field} />
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button className='w-full' type='submit'>
                     Sign In
                  </Button>
               </form>
            </Form>
            <div className='text-center mt-4'>
               <p>
                  Not a member yet?{' '}
                  <Link
                     href='/signup'
                     className='text-blue-600 hover:text-blue-800'
                  >
                     Sign up
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
