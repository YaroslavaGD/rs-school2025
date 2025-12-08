export interface Everything {
  status: string;
  totalResults: number;
  articles: ArrayArticles;
}

export interface ISources {
  status: string;
  sources: ArraySources;
}

export type ArraySources = Array<Source>;
export type ArrayArticles = Array<Article>;

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
