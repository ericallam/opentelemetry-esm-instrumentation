import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  ConsoleSpanExporter,
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { DemoOpenAIInstrumentation } from "./instrumentation.mjs";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceProvider = new NodeTracerProvider();
const spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());

traceProvider.addSpanProcessor(spanProcessor);
traceProvider.register();

registerInstrumentations({
  instrumentations: [new DemoOpenAIInstrumentation()],
});

const tracer = traceProvider.getTracer("opentelemetry-esm-instrumentation");

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function doWork() {
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

doWork().catch((err) => {
  console.error(err);
});
