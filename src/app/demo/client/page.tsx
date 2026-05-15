"use client";

import { ClientDemoPanel } from "../_components/client-demo-panel";
import { DemoShowcase } from "../_components/demo-showcase";

export default function ClientDemoPage() {
  return (
    <DemoShowcase
      strategy="Client Component"
      title="Prerendered markup with browser-side hydration"
      summary="This route is a Client Component. Next.js still prerenders the shell, then React hydrates it in the browser so state, effects, and event handlers can take over."
      metrics={[
        { label: "Render Source", value: "Client Component page with browser hydration." },
        { label: "Initial HTML", value: "Prerendered by Next.js before the browser attaches handlers." },
        { label: "State Model", value: "Counter state lives only in the browser after hydration." },
        { label: "Request APIs", value: "Not used. No server-only request reads inside this route." },
      ]}
      notes={[
        "Load the page and wait for the hydration timestamp to appear after mount.",
        "Click the counter to prove the interactive state is owned by the browser.",
        "This route matches the other demos visually, but its runtime behavior is client-driven.",
      ]}
      interactiveSlot={<ClientDemoPanel />}
    />
  );
}
