import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  ConsoleSpanExporter,
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("@opentelemetry/instrumentation/hook.mjs", pathToFileURL("./"));

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceProvider = new NodeTracerProvider();
const spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());

traceProvider.addSpanProcessor(spanProcessor);
traceProvider.register();

registerInstrumentations({
  instrumentations: [new OpenAIInstrumentation()],
});

const tracer = traceProvider.getTracer("opentelemetry-esm-instrumentation");

async function doWork() {
  // @ts-expect-error
  const workModule = await import("./index.mjs");

  await workModule.doWork(tracer);
}

doWork().catch(console.error);
