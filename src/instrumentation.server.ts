import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { register } from "import-in-the-middle/register-hooks.mjs";

// Loaded before the app, so `$app/env` isn't available yet. Traces go to HyperDX alongside the evlog drain.
const endpoint = process.env.HYPERDX_OTLP_ENDPOINT;

if (endpoint) {
  register();

  const sdk = new NodeSDK({
    serviceName: "skycrypt-frontend",
    traceExporter: new OTLPTraceExporter({
      url: `${endpoint}/v1/traces`,
      headers: { authorization: process.env.HYPERDX_API_KEY ?? "" }
    }),
    instrumentations: [new HttpInstrumentation(), new UndiciInstrumentation()]
  });

  sdk.start();
  process.on("sveltekit:shutdown", () => sdk.shutdown());
}
