/**
 * toolHistory.ts
 * Persists recent tool usage to localStorage so the Profile page can
 * display the last 5 tools the signed-in user has visited.
 *
 * Key: "pdf_tool_clicks"
 * Format: ClickHistoryItem[] (same shape the profile page already expects)
 */

export interface ClickHistoryItem {
 toolKey: string;
 title: string;
 url: string;
 category: string;
 /** Lucide icon name to render on the profile page */
 iconName: string;
 /** Hex colour of the tool category */
 categoryColor: string;
 timestamp: string;
}

const STORAGE_KEY = "pdf_tool_clicks";
const MAX_ITEMS = 5;

/**
 * Records a tool click into localStorage.
 * Deduplicates by toolKey (most-recent wins), keeps only the last 5.
 */
export function recordLocalToolClick(item: Omit<ClickHistoryItem, "timestamp">): void {
 if (typeof window === "undefined") return;
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 const existing: ClickHistoryItem[] = raw ? JSON.parse(raw) : [];

 // Remove any previous entry for the same tool so it bubbles to top
 const filtered = existing.filter((e) => e.toolKey !== item.toolKey);

 const next: ClickHistoryItem[] = [
 { ...item, timestamp: new Date().toISOString() },
 ...filtered,
 ].slice(0, MAX_ITEMS);

 localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
 } catch {
 // Silently ignore storage errors (private browsing, quota, etc.)
 }
}
