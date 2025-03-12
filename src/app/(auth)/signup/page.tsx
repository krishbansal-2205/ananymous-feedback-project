'use client';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignupSchema } from '@/schemas/signupSchema';
import { Loader2 } from 'lucide-react';

function page() {
   const [username, setUsername] = useState('');
   const [usernameMessage, setUsernameMessage] = useState('');
   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const debounced = useDebounceCallback(setUsername, 300);
   const router = useRouter();

   const form = useForm<z.infer<typeof SignupSchema>>({
      resolver: zodResolver(SignupSchema),
      defaultValues: {
         username: '',
         email: '',
         password: '',
      },
   });

   useEffect(() => {
      const checkUsernameUnique = async () => {
         if (username.length > 0) {
            setIsCheckingUsername(true);
            try {
               const response = await axios.get('/api/check-username-unique', {
                  params: { username },
               });
               setUsernameMessage(response.data.message);
            } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>;
               setUsernameMessage(
                  axiosError.response?.data.message || 'Error checking username'
               );
            } finally {
               setIsCheckingUsername(false);
            }
         }
      };
      checkUsernameUnique();
   }, [username]);

   const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
      setIsSubmitting(true);
      try {
         const response = await axios.post<ApiResponse>('/api/signup', data);
         toast('Success', { description: response.data.message });
         router.replace(`/verify/${username}`);
         setIsSubmitting(false);
      } catch (error) {
         console.error('Error signing up', error);
         toast('Error signing up', {
            description : (error as AxiosError<ApiResponse>).response?.data
               .message,
         });
         setIsSubmitting(false);
      }
   };

   return (
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
         <div className='w-full max-w-md p-8 space-y-0 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
               <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                  Join AMA
               </h1>
               <p className='mb-4'>Sign up to start your anonymous adventure</p>
            </div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
               >
                  <FormField
                     control={form.control}
                     name='username'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Username</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder='username'
                                 {...field}
                                 onChange={(e) => {
                                    field.onChange(e);
                                    debounced(e.target.value);
                                 }}
                              />
                           </FormControl>
                           {isCheckingUsername && (
                              <Loader2 className='animate-spin' />
                           )}
                           {!isCheckingUsername && usernameMessage && (
                              <p
                                 className={`text-sm ${
                                    usernameMessage === 'Username is available'
                                       ? 'text-green-500'
                                       : 'text-red-500'
                                 }`}
                              >
                                 {usernameMessage}
                              </p>
                           )}
                           {/* <FormDescription>
                              This is your public display name.
                           </FormDescription> */}
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name='email'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input placeholder='email' {...field} />
                           </FormControl>
                           {/* <FormDescription>
                              This is your email.
                           </FormDescription> */}
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name='password'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input
                                 type='password'
                                 placeholder='password'
                                 {...field}
                              />
                           </FormControl>
                           {/* <FormDescription>
                              This is your password.
                           </FormDescription> */}
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type='submit' disabled={isSubmitting}>
                     {isSubmitting ? (
                        <>
                           <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                           Please wait
                        </>
                     ) : (
                        'Sign Up'
                     )}
                  </Button>
               </form>
            </Form>
            <div className='text-center mt-4'>
               <p>
                  Already a member?{' '}
                  <Link
                     href='/signin'
                     className='text-blue-600 hover:text-blue-800'
                  >
                     Sign in
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}

export default page;
