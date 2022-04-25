const httpRequestMethods = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
] as const;

export type HttpRequestMethod = typeof httpRequestMethods[number];

export default httpRequestMethods;
