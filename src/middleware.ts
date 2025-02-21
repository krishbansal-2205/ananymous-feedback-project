import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/dashboard/:path*', '/signin', '/signup', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest,res:NextResponse) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if (
        token &&
        (url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}
// import { auth } from "@/auth"
// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export default auth(async (req:NextRequest) => {
//     const token=await getToken({req});
//     const url=req.nextUrl;
//     if(token && (url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup') || url.pathname.startsWith('/verify'))){
//         return NextResponse.redirect(new URL('/dashboard',req.url))
//     }

//     return NextResponse.redirect(new URL('/',req.url))
// })

// export const config = {
//   matcher: ['/', '/signin','/dashboard'],
// }
