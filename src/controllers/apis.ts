import { HttpRequestMethod } from '../data/httpRequestMethods';

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

export const implementedMethods: HttpRequestMethod[] = ['GET'];

export const allowedOrigin = '*';

export const apisCache = {
  clear: () => {},
};
