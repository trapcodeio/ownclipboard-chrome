import type { Paginated } from "xpress-mongo/src/types/pagination";

export interface Clip {
  code?: string;
  favorite?: boolean;
  content: string;
  html_formatted?: string;
  last_copied: string;
  created_at: string;
}

export type PaginatedClip = Paginated<Clip> & { date: string };

export type EventsController = Record<string, (ctx: { clip: Clip }) => any>;
