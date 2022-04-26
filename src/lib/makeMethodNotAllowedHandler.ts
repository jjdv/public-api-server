import { RequestHandler } from 'express';
import { HttpRequestMethod } from '../data/httpRequestMethods';

export default function makeMethodNotAllowedHandler(
  sanitizedImplementationMethods: HttpRequestMethod[],
): RequestHandler {
  const sanitizedImplementationMethodsStr =
    sanitizedImplementationMethods.join(', ');

  return (req, res) => {
    res.set('Allow', sanitizedImplementationMethodsStr);
    res.sendStatus(405);
  };
}
