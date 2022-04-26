import areArrayValuesEqual from '../lib/areArrayValuesEqual';
import request from './request';
import { HttpRequestMethod } from '../data/httpRequestMethods';
import getSanitizedImplementedMethods from '../lib/getSanitizedImplementedMethods';

const testOptionsMethod = (
  endpoint: string,
  allowedOrigin: string,
  allowedMethods: HttpRequestMethod[],
) => {
  const sanitizedAllowedMethods =
    getSanitizedImplementedMethods(allowedMethods);
  const allowedMethodsStr = sanitizedAllowedMethods.join(', ');

  it(`OPTIONS returns allowed origin ${allowedOrigin} and allowed methods ${allowedMethodsStr}`, async () => {
    const response = await request.options(endpoint);
    expect(response.status).toBe(204);

    const headerAllow = response.headers['access-control-allow-methods'];
    const responseAllowedMethods: string[] = headerAllow
      ? (headerAllow as string).split(/,\s*/)
      : [];
    const doesAllowedMethodsMatch = areArrayValuesEqual(
      sanitizedAllowedMethods,
      responseAllowedMethods,
    );
    expect(doesAllowedMethodsMatch).toBe(true);
  });
};

export default testOptionsMethod;
