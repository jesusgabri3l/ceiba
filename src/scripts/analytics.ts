// GoatCounter custom events. Pageviews are counted by the script tag in
// Layout.astro; this only sends named events. If the script is blocked
// (ad blockers) or running on localhost, events are silently dropped.
// GoatCounter events carry no extra data, so any detail goes in the name.

type GoatCounter = { count?: (vars: { path: string; title?: string; event: boolean }) => void };

export function track(name: string) {
  const send = () => ((window as any).goatcounter as GoatCounter | undefined)?.count?.({ path: name, title: name, event: true });
  if ((window as any).goatcounter?.count || document.readyState === 'complete') send();
  else window.addEventListener('load', send, { once: true });
}

// Fires each scroll depth threshold (percent of the page) once per visit.
export function trackScrollDepth(thresholds = [25, 50, 75, 100]) {
  const pending = new Set(thresholds);
  const check = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
    for (const t of pending) {
      if (pct >= t - 0.5) {
        pending.delete(t);
        track(`scroll-${t}`);
      }
    }
    if (!pending.size) window.removeEventListener('scroll', check);
  };
  window.addEventListener('scroll', check, { passive: true });
}
