import type { Tracer } from "@opentelemetry/api";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function doWork(tracer: Tracer) {
  await tracer.startActiveSpan("doOpenAI", async (span) => {
    await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, how are you?",
        },
      ],
    });

    span.end();
  });
}
