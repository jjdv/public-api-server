import { RequestHandler } from 'express';
import { HttpRequestMethod } from '../data/httpRequestMethods';

export interface Controller {
  allowOrigin: string;
  methods: HttpRequestMethod[];
  handlers: {
    [key: string]: RequestHandler;
  };
}

export interface Controllers {
  [key: string]: Controller;
}
