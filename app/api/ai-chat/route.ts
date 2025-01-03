import { OpenAIStream } from '@/types/chatStream'; 
import { ChatBody } from '@/types/types';

export const runtime = 'edge';

export async function GET(req: Request): Promise<Response> {
  try {
    const { inputMessage, model } = (await req.json()) as ChatBody;

    
    const stream = await OpenAIStream(inputMessage, model, process.env.OPENAI_API_KEY);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
export async function POST(req: Request): Promise<Response> {
  try {
    const { inputMessage, model } = (await req.json()) as ChatBody;
 
    const stream = await OpenAIStream(inputMessage, model, process.env.OPENAI_API_KEY);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
