export type Post = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  dateISO?: string;
  introImage?: string;
  readingTime?: number;
};

export type Page = {
  slug: string;
  title: string;
  description?: string;
};
