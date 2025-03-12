import { MessageSchema } from '@/schemas/messageSchema';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';

export async function POST(request: Request) {
   try {
      const prompt =
         "Create a list of three open-ended and engaging questions. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Suggest some creative questions";

      const response = streamObject({
         model: google('gemini-1.5-flash-latest'),
         output:'array',
         schema:MessageSchema,
         prompt,
         onError({ error }) {
            console.error(error);
            throw error;
         },
      });

      return response.toTextStreamResponse();
   } catch (error) {
      console.error('Error generating response', error);
      return Response.json(
         { success: false, message: 'Error generating response' },
         { status: 500 }
      );
   }
}
