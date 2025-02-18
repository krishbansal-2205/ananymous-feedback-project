import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'AMA <onboarding@resend.dev>',
            to: email,
            subject: 'AMA Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: 'Email sent successfully',
        };
    } catch (error) {
        console.error('Error sending email', error);
        return {
            success: false,
            message: 'Error sending email',
        };
    }
}
