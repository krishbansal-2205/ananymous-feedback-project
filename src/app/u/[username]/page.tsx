'use client';
import { Button } from '@/components/ui/button';
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MessageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function page() {
   const { username } = useParams();
   const { object, submit, isLoading, stop } = useObject({
      api: '/api/suggest-messages',
      schema: z.array(MessageSchema),
   });

   const form = useForm<z.infer<typeof MessageSchema>>({
      resolver: zodResolver(MessageSchema),
      defaultValues: {
         content: '',
      },
   });

   const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
      try {
         const response = await axios.post('/api/send-message', {
            username,
            content: data.content,
         });
         toast(response.data.message);
         form.reset();
      } catch (error) {
         console.error('Error sending message', error);
         toast('Error sending message', {
            description: (error as AxiosError<ApiResponse>).response?.data
               .message,
         });
      }
   };

   const handleMessageClick = (message: string) => {
      form.setValue('content', message);
   };

   return (
      <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
         <h1 className='text-4xl text-center font-bold mb-8'>
            Public Profile Link
         </h1>
         <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>
               Send Anonymous Message to @{username}
            </h2>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
               >
                  <FormField
                     name='content'
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           {/* <FormLabel>Message</FormLabel> */}
                           <Textarea
                              {...field}
                              placeholder='Write your anonymous message here'
                              className='resize-none'
                           />
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className='flex justify-center items-center'>
                     <Button type='submit'>Send it</Button>
                  </div>
               </form>
            </Form>
            <Button
               onClick={() => submit('')}
               disabled={isLoading}
               className='mt-12 mb-4'
            >
               Suggest Messages
            </Button>
            <h2 className='text-base font-medium mb-2'>
               Click on any message below to select it
            </h2>
            {/* {isLoading && (
               <div>
                  <div>Loading...</div>
                  <Button onClick={() => stop()}>Stop</Button>
               </div>
            )} */}

            <Card>
               <CardHeader>
                  <h3 className='text-xl font-semibold'>Messages</h3>
               </CardHeader>
               <CardContent className='flex flex-col space-y-4'>
                  {object?.map((message, index) => (
                     <Button
                        key={index}
                        variant='outline'
                        className='mb-2'
                        onClick={() => handleMessageClick(message?.content as string)}
                     >
                        {message?.content}
                     </Button>
                  ))}
               </CardContent>
            </Card>
         </div>
      </div>
   );
}

export default page;
