import { Story } from '@/app/api/story/route';
import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser'; 


const createPrompt = (inputMessage: any, history: any | undefined, context: any | undefined) => {
  const data = (inputMessage: any) => {
    return endent`
      Your name is লেখনী। তুমি বাংলায় অনেক এক্সপার্ট, আর তুমি সবসময় বাংলায় উত্তর দিবে। 
      তোমার সাথে পূর্বে যেসব কথা হয়েছেঃ ${history}.
     
      তোমার প্রশ্নটি হলঃ
      ${inputMessage}

      ${ 
      context ? 
      `তোমার প্রশ্নটি সম্পর্কে আমার কাছে কিছু গল্প রয়েছে। এখান থেকে তুমি সেগুলো পড়তে পারো, এবং সে অনুযায়ী উত্তর দিতে পারোঃ  ${context}, 
       এখানে যে গল্পটি সম্পর্কে জিজ্ঞাসা করা হয়েছে সেটার json কে অবশ্যই $$"{json}"$$ এর মধ্যে পাঠাবে, json এর সামনে ও পিছে অবশ্যই $$ সাইন দিবে। আর শুরুতে তোমার মতামত দিবে` : ''
      }
 
    `;
  };

  if (inputMessage) {
    return data(inputMessage);
  }
};

export async function OpenAIStream(
  inputMessage: any,
  model: any,
  history?: any | undefined,
  context?: any | undefined,
) {
 

  const prompt = createPrompt(inputMessage, history, context);
  const system = { role: 'system', content: prompt };

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
