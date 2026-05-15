import { cacheLife } from "next/cache";

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export async function getStaticDemoSnapshot() {
  "use cache";
  cacheLife("hours");

  return {
    renderedAt: formatTimestamp(new Date()),
    renderFingerprint: crypto.randomUUID().slice(0, 8),
  };
}

export { formatTimestamp };
