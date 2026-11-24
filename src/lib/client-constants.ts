export const CHAT_ENDPOINT_PUBLIC =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/paseocompacto-chat";
export const OPEN_CHAT_EVENT = "pc:open-chat";

export function getVisitor(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let v = localStorage.getItem("pc_visitor");
    if (!v) {
      v =
        "pc-" +
        Math.random().toString(36).slice(2, 10) +
        "-" +
        Date.now().toString(36);
      localStorage.setItem("pc_visitor", v);
    }
    return v;
  } catch {
    return "anon";
  }
}

export function trackClick(
  source: string,
  extra?: {
    session_id?: string | null;
    article_slug?: string | null;
    article_title?: string | null;
    category?: string | null;
    target_url?: string | null;
  }
) {
  if (typeof window === "undefined") return;
  try {
    fetch(CHAT_ENDPOINT_PUBLIC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "track_click",
        source,
        session_id:
          extra?.session_id || localStorage.getItem("pc_chat_session") || null,
        visitor_id: getVisitor(),
        article_slug: extra?.article_slug || null,
        article_title: extra?.article_title || null,
        category: extra?.category || "amazon",
        target_url:
          extra?.target_url ||
          "https://www.amazon.com/s?k=Ingenuity+Kolcraft+Doona+Compact+Travel+Stroller&tag=paseocompacto-20",
        page_url: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}
