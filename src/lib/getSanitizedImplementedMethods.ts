import { HttpRequestMethod } from '../data/httpRequestMethods';

const getSanitizedImplementedMethods = (
  implementedMethods: HttpRequestMethod[],
): HttpRequestMethod[] => {
  const sanitizedImplementationMethods = [...implementedMethods];

  if (
    implementedMethods.includes('GET') &&
    !implementedMethods.includes('HEAD')
  )
    sanitizedImplementationMethods.push('HEAD');

  if (!implementedMethods.includes('OPTIONS'))
    sanitizedImplementationMethods.push('OPTIONS');

  return sanitizedImplementationMethods;
};

export default getSanitizedImplementedMethods;
