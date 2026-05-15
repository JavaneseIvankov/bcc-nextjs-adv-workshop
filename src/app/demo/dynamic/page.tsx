import { Suspense } from "react";
import { headers } from "next/headers";
import { DemoShowcase } from "../_components/demo-showcase";
import { formatTimestamp } from "../demo-data";

export default function DynamicDemoPage() {
  return (
    <DemoShowcase
      strategy="Dynamic Server Component"
      title="Request-time server output driven by headers()"
      summary="This route reads a Request Time API inside a nested server component. The outer shell stays consistent, and the request-scoped panel streams in after the server resolves it."
      metrics={[
        { label: "Render Source", value: "Nested server component triggered by headers()." },
        { label: "Route Shell", value: "Static outer shell with request-time content streamed into it." },
        { label: "Why Suspense", value: "Required by Cache Components so request-time work does not block the full page." },
        { label: "Request APIs", value: "headers() is used inside the dynamic panel below." },
      ]}
      notes={[
        "Refresh this route and confirm the rendered timestamp changes when the panel resolves.",
        "The dynamic panel reads headers(), which is the Request Time API forcing request-scoped work.",
        "Compare the shell against /demo/static. The structure stays the same while the data path changes.",
      ]}
      interactiveSlot={
        <Suspense fallback={<DynamicRequestPanelFallback />}>
          <DynamicRequestPanel />
        </Suspense>
      }
    />
  );
}

async function DynamicRequestPanel() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "unknown";
  const userAgent = requestHeaders.get("user-agent") ?? "unknown";
  const renderedAt = formatTimestamp(new Date());

  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <RequestMetric label="Rendered At" value={renderedAt} />
      <RequestMetric label="Host Header" value={host} />
      <RequestMetric label="User Agent" value={userAgent.slice(0, 80)} />
    </div>
  );
}

function DynamicRequestPanelFallback() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <RequestMetric label="Rendered At" value="Resolving request-time data..." muted />
      <RequestMetric label="Host Header" value="Waiting for headers()" muted />
      <RequestMetric label="User Agent" value="Streaming dynamic section..." muted />
    </div>
  );
}

function RequestMetric({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="border bg-muted/20 p-5">
      <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
        {label}
      </p>
      <p className={muted ? "mt-3 text-sm text-muted-foreground" : "mt-3 text-sm leading-relaxed"}>
        {value}
      </p>
    </div>
  );
}
