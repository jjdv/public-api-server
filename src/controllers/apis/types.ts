export interface ApiOriginal {
  API: string;
  Description: string;
  Link: string;
  Category: string;
  Cors: 'yes' | 'no' | 'unknown';
}

export interface Response {
  items: Array<Api>;
}

export interface Api {
  title: string;
  description: string;
  link: string;
  category: string;
  cors?: boolean;
}

export interface ApiOriginalResponse {
  count: number;
  entries: ApiOriginal[] | null;
}

export interface ApiQuery {
  title?: string;
  cors?: string;
}

export interface ApiExtended extends Api {
  titleLow: string;
}

export type ApiFilter = (api: ApiExtended) => boolean;
