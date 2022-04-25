import httpRequestMethods, {
  HttpRequestMethod,
} from '../data/httpRequestMethods';
import areArrayValuesEqual from '../lib/areArrayValuesEqual';
import request from './request';
import getSanitizedImplementedMethods from './getSanitizedImplementedMethods';

const requestMethods = {
  GET: request.get,
  HEAD: request.head,
  POST: request.post,
  PUT: request.put,
  PATCH: request.patch,
  DELETE: request.delete,
  OPTIONS: request.options,
};

const testNotImplementedMethods = (
  endpoint: string,
  implementedMethods: HttpRequestMethod[],
) => {
  const sanitizedImplementedMethods =
    getSanitizedImplementedMethods(implementedMethods);
  const notImplementedMethods = httpRequestMethods.filter(
    method => !sanitizedImplementedMethods.includes(method),
  );

  notImplementedMethods.forEach(method => {
    it(`for not implemented methods ${method} returns status 405 and allowed methods`, async () => {
      const response = await requestMethods[method](endpoint);

      expect(response.status).toBe(405);

      const headerAccessControlAllowMethods =
        response.headers['access-control-allow-methods'];
      const responseAllowedMethods: string[] = headerAccessControlAllowMethods
        ? (headerAccessControlAllowMethods as string).split(/,\s*/)
        : [];
      const doesAllowedMethodsMatch = areArrayValuesEqual(
        sanitizedImplementedMethods,
        responseAllowedMethods,
      );
      expect(doesAllowedMethodsMatch).toBe(true);
    });
  });
};

export default testNotImplementedMethods;
