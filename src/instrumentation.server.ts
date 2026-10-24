import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { NodeSDK } from "@opentelemetry/sdk-node";

// Loaded before the app, so `$app/env` isn't available yet. Traces go to HyperDX alongside the evlog drain.
const endpoint = process.env.HYPERDX_OTLP_ENDPOINT;

if (endpoint) {
  const sdk = new NodeSDK({
    serviceName: "skycrypt-frontend",
    traceExporter: new OTLPTraceExporter({
      url: `${endpoint}/v1/traces`,
      headers: { authorization: process.env.HYPERDX_API_KEY ?? "" }
    }),
    instrumentations: [new UndiciInstrumentation()]
  });

  sdk.start();
  process.on("sveltekit:shutdown", () => sdk.shutdown());
}
