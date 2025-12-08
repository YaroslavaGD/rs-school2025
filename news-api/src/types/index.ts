export interface Everything {
  status: string;
  totalResults: number;
  articles: Array<Article>;
}

export interface ISources {
  status: string;
  sources: ArraySources;
}

export type ArraySources = Array<Source>;

type Article = {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

type Source = {
  id: string | null;
  name: string;
};
