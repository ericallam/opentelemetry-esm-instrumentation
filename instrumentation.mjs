import {
  InstrumentationBase,
  InstrumentationNodeModuleDefinition,
  safeExecuteInTheMiddle,
} from "@opentelemetry/instrumentation";

export class DemoOpenAIInstrumentation extends InstrumentationBase {
  constructor() {
    super(
      "@opentelemetry-esm-instrumentation/simple-openai-instrumentation",
      "0.0.1",
      {}
    );
  }

  init() {
    const module = new InstrumentationNodeModuleDefinition(
      "openai",
      [">=3.1.0 <5"],
      this.patch.bind(this),
      this.unpatch.bind(this)
    );

    return module;
  }

  patch(moduleExports, moduleVersion) {
    this._diag.debug(`Patching openai@${moduleVersion}`);

    return moduleExports;
  }

  unpatch(moduleExports, moduleVersion) {
    this._diag.debug(`Unpatching openai@${moduleVersion}`);
  }
}
