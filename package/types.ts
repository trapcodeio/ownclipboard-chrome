export interface Clip {
  favorite?: boolean;
  content: string;
  html_formatted?: string;
  last_copied: string;
  created_at: string;
}

export type EventsController = Record<string, (ctx: { clip: Clip }) => any>;
