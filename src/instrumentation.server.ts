import dc from "node:diagnostics_channel";
import { SpanKind, SpanStatusCode, trace, type Span } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { NodeSDK } from "@opentelemetry/sdk-node";

// Loaded before the app, so `$app/env` isn't available yet. Traces go to HyperDX alongside the evlog drain.
const endpoint = process.env.HYPERDX_OTLP_ENDPOINT;

type QueryMessage = {
  database: string;
  query?: string;
  command?: string;
  count?: number;
  host?: string;
  port?: number;
  error?: Error & { code?: string; severity?: string };
};

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

  const tracer = trace.getTracer("postgres.js");
  const spans = new WeakMap<object, Span>();

  dc.tracingChannel<QueryMessage>("postgres:query").subscribe({
    start(x) {
      spans.set(
        x,
        tracer.startSpan(x.database, {
          kind: SpanKind.CLIENT,
          attributes: { "db.system.name": "postgresql", "db.namespace": x.database, "db.query.text": x.query }
        })
      );
    },
    error(x) {
      const span = spans.get(x);
      if (!span || !x.error) return;
      span.recordException(x.error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: x.error.message });
      span.setAttribute("error.type", x.error.code ?? x.error.name);
      if (x.error.severity && x.error.code) span.setAttribute("db.response.status_code", x.error.code);
    },
    asyncEnd(x) {
      const span = spans.get(x);
      if (!span) return;
      span.setAttributes({
        "db.query.text": x.query,
        "db.operation.name": x.command,
        "db.response.returned_rows": x.count,
        "server.address": x.host,
        "server.port": x.port
      });
      if (x.command) span.updateName(`${x.command} ${x.database}`);
      span.end();
    },
    end() {},
    asyncStart() {}
  });
}
