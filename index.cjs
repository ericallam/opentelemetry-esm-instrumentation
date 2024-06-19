const { DiagConsoleLogger, DiagLogLevel, diag } = require("@opentelemetry/api");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const {
  ConsoleSpanExporter,
  NodeTracerProvider,
  SimpleSpanProcessor,
} = require("@opentelemetry/sdk-trace-node");
const { DemoOpenAIInstrumentation } = require("./instrumentation.cjs");

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceProvider = new NodeTracerProvider();
const spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());

traceProvider.addSpanProcessor(spanProcessor);
traceProvider.register();

registerInstrumentations({
  instrumentations: [new DemoOpenAIInstrumentation()],
});

const tracer = traceProvider.getTracer("opentelemetry-esm-instrumentation");

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function doWork() {
  return tracer.startActiveSpan("doOpenAI", function (span) {
    return openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Hello, how are you?",
          },
        ],
      })
      .then(function () {
        span.end();
      });
  });
}

doWork().catch(function (err) {
  console.error(err);
});
