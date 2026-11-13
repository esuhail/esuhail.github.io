// Live repo activity from the public GitHub API, fetched in the visitor's browser.
// Unauthenticated calls are limited to 60 an hour per visitor, so responses are
// cached for the session. If anything fails the hook returns null and the UI
// simply leaves the date out.

import { useEffect, useState } from "react";

async function getJson<T>(url: string): Promise<T> {
  const key = `gh:${url}`;
  try {
    const hit = sessionStorage.getItem(key);
    if (hit) return JSON.parse(hit) as T;
  } catch {
    /* storage unavailable: just skip the cache */
  }
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const data = (await res.json()) as T;
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  return data;
}

function useFetch<T>(url: string): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let alive = true;
    getJson<T>(url).then((d) => alive && setData(d)).catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);
  return data;
}

export function useLastPush(user: string, repo: string): string | null {
  return useFetch<{ pushed_at: string }>(`https://api.github.com/repos/${user}/${repo}`)?.pushed_at ?? null;
}

type PushEvent = { type: string; created_at: string; repo: { name: string } };

export function useLatestPush(user: string): { repo: string; url: string; at: string } | null {
  const events = useFetch<PushEvent[]>(`https://api.github.com/users/${user}/events/public?per_page=30`);
  const push = events?.find((e) => e.type === "PushEvent");
  if (!push) return null;
  return { repo: push.repo.name.split("/")[1], url: `https://github.com/${push.repo.name}`, at: push.created_at };
}

export function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [string, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, secs] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${unit}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
