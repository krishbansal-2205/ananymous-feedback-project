import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from './lib/dbConnect';
import UserModel from './model/userModel';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials: any): Promise<any> => {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        email: credentials.email,
                    });
                    if (!user) {
                        throw new Error(' No user found');
                    }

                    if (!user.isVerified) {
                        throw new Error(' User is not verified');
                    }

                    const isMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!isMatch) {
                        throw new Error(' Password is incorrect');
                    }

                    return user;
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.isVerified = user.isVerified;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            const jwt_token = token as JWT;
            if (token) {
                session.user._id = jwt_token._id;
                session.user.isAcceptingMessages =
                    jwt_token.isAcceptingMessages;
                session.user.isVerified = jwt_token.isVerified;
                session.user.username = jwt_token.username;
            }
            return session;
        },
    },
});
