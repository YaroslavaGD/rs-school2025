export interface DataNews extends Status {
    totalResults: number;
    articles: ArrayArticles;
}
export interface DataSources extends Status {
    sources: ArraySources;
}
export type Endpoint = keyof typeof EndpointValues;
export type ArraySources = Array<Source>;
export type ArrayArticles = Array<Article>;
export declare enum EndpointValues {
    sources = "sources",
    everything = "everything"
}
interface Status {
    status: string;
}
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
export type APIKey = {
    apiKey: string;
};
export type Options = {
    sources?: string;
    apiKey?: string;
} | undefined;
export type Callback = <T>(data?: T) => void;
export {};
//# sourceMappingURL=index.d.ts.map