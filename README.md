## OpenTelemetry + ESM + @traceloop/instrumentation-openai + openai

Reproduces the following error when trying to instrument openai using `@traceloop/instrumentation-openai` and the `--experimental-loader=@opentelemetry/instrumentation/hook.mjs` ESM hook from `@opentelemetry/instrumentation`, which is meant to have a bugfix released in [0.52.0](https://github.com/open-telemetry/opentelemetry-js/releases/tag/experimental%2Fv0.52.0) to allow ESM to work.

### Steps to reproduce

1. Create the .env file (see the .env.example file for values)
2. Make sure you are running on Node v20
3. Install node modules with `npm install`
4. Build with `npm run build`
5. Run with `npm run start`

You should see this error:

```
/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/@traceloop/instrumentation-openai/dist/index.js:44
            this._wrap(moduleExports.OpenAI.Completions.prototype, "create", this.patchOpenAI("completion"));
                                                        ^

TypeError: Cannot read properties of undefined (reading 'prototype')
    at OpenAIInstrumentation.patch (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/@traceloop/instrumentation-openai/dist/index.js:44:57)
    at OpenAIInstrumentation._onRequire (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/instrumentation.js:168:39)
    at hookFn (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/instrumentation.js:226:29)
    at callHookFn (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/import-in-the-middle/index.js:28:22)
    at Hook._iitmHook (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/import-in-the-middle/index.js:76:11)
    at /Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/import-in-the-middle/index.js:17:41
    at Array.forEach (<anonymous>)
    at addHook (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/import-in-the-middle/index.js:17:10)
    at new Hook (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/import-in-the-middle/index.js:84:3)
    at OpenAIInstrumentation.enable (/Users/eric/code/triggerdotdev/reproductions/opentelemetry-esm-instrumentation/node_modules/@opentelemetry/instrumentation/build/src/platform/node/instrumentation.js:238:29)
```
