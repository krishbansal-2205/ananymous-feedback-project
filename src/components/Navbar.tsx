'use client';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

function Navbar() {
   const { data: session } = useSession();
   const user: User = session?.user as User;

   return (
      <nav className='p-4 md:p-6 shadow-md'>
         <div className='container mx-auto flex flex-col md:flex-row items-center justify-between'>
            <a className='text-xl font-bold mb-4 md:mb-0' href='/'>
               AMA App
            </a>
            {session ? (
               <>
                  <span className='mx-4 text-lg'>Welcome, {user.username}</span>
                  <div >
                  <Button
                     className='w-full md:mx-auto'
                     onClick={() => signOut()}
                  >
                     Logout
                  </Button>
                  </div>
               </>
            ) : (
               <Link href='/signin'>
                  <Button className='w-full md:mx-auto '>Login</Button>
               </Link>
            )}
         </div>
      </nav>
   );
}

export default Navbar;
