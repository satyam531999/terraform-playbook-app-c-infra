const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-proto");
const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");

const token = process.env.DT_API_TOKEN;
const otlpEndpoint = (process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "").replace(/\/$/, "");

function logTelemetryEvent(level, message, fields = {}) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      component: "opentelemetry",
      ...fields,
    })
  );
}

function buildExporterUrl(signalPath) {
  return `${otlpEndpoint}/${signalPath}`;
}

if (!token || !otlpEndpoint) {
  logTelemetryEvent("INFO", "OpenTelemetry export disabled", {
    hasToken: Boolean(token),
    hasEndpoint: Boolean(otlpEndpoint),
  });
} else {
  const headers = {
    Authorization: `Api-Token ${token}`,
  };

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: buildExporterUrl("v1/traces"),
      headers,
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: buildExporterUrl("v1/metrics"),
        headers,
      }),
      exportIntervalMillis: 30000,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk
    .start()
    .then(() => {
      logTelemetryEvent("INFO", "OpenTelemetry export enabled", {
        endpoint: otlpEndpoint,
      });
    })
    .catch((error) => {
      logTelemetryEvent("ERROR", "OpenTelemetry startup failed", {
        error: error.message,
      });
    });

  async function shutdown(signal) {
    try {
      await sdk.shutdown();
      logTelemetryEvent("INFO", "OpenTelemetry shutdown complete", { signal });
    } catch (error) {
      logTelemetryEvent("ERROR", "OpenTelemetry shutdown failed", {
        signal,
        error: error.message,
      });
    } finally {
      process.exit(0);
    }
  }

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
}