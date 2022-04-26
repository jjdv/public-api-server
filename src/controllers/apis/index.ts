import { RequestHandler } from 'express';
import { AxiosError } from 'axios';

import { HttpRequestMethod } from '../../data/httpRequestMethods';
import http from '../../services/http';
import makeCache from '../../lib/makeCache';
import {
  ApiOriginal,
  ApiOriginalResponse,
  Api,
  ApiExtended,
  ApiQuery,
  ApiFilter,
} from './types';
import { Controller } from '../Controller';

export const implementedMethods: HttpRequestMethod[] = ['GET'];

export const allowedOrigin = '*';

const APIS_CACHE_KEY_PREFIX = 'APIS_';
const TTL_SEC = 60 * 60; // 1 hour
const CACHE_KEY_APIS = 'APIS';
const CACHE_KEY_APIS_EXTENDED = 'APIS_EXTENDED';

export const apisCache = makeCache(APIS_CACHE_KEY_PREFIX, TTL_SEC);

function getCors(corsOriginal: string): boolean | undefined {
  switch (corsOriginal) {
    case 'yes':
      return true;
    case 'no':
      return false;
    case 'unknown':
      return undefined;
    default:
      throw new Error(`Invalid original cors value: "${corsOriginal}"!`);
  }
}

function mapApis(apisOriginal: ApiOriginal[]): Api[] {
  if (!Array.isArray(apisOriginal))
    throw new Error(`Provided original apis is not an array!`);

  return apisOriginal.map(api => {
    if (typeof api !== 'object')
      throw new Error(`Provided original api element is not an object!`);

    return {
      title: api.API,
      description: api.Description,
      link: api.Link,
      category: api.Category,
      cors: getCors(api.Cors),
    };
  });
}

function getCorsSearched(cors: string): boolean | undefined {
  switch (cors) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
}

function makeApiFilter({ title, cors }: ApiQuery): ApiFilter {
  const queryType = `${title ? 'title' : ''}-${cors ? 'cors' : ''}`;
  const titleLow = title?.toLowerCase();

  switch (queryType) {
    case 'title-cors': {
      const corsSearched = getCorsSearched(cors as string);
      return (api: ApiExtended) =>
        api.cors === corsSearched && api.titleLow.includes(titleLow as string);
    }
    case '-cors': {
      const corsSearched = getCorsSearched(cors as string);
      return (api: ApiExtended) => api.cors === corsSearched;
    }
    default:
      return (api: ApiExtended) => api.titleLow.includes(titleLow as string);
  }
}

function filterApis(apis: ApiExtended[], apiQuery: ApiQuery): ApiExtended[] {
  const apiFilter = makeApiFilter(apiQuery);

  return apis.filter(apiFilter);
}

async function getApisFromEndpoint(): Promise<ApiOriginal[]> {
  try {
    const response: ApiOriginalResponse = await http.get(
      'https://api.publicapis.org/entries',
    );

    if (
      typeof response !== 'object' ||
      (response.entries && !Array.isArray(response.entries))
    )
      throw new Error(`Invalid data format received from original api!`);

    return response.entries ? response.entries : [];
  } catch (error) {
    throw new Error(
      `Error received from the endpoint: "${(error as AxiosError).message}"`,
    );
  }
}

const isNoQuery = ({ title, cors }: ApiQuery) => !title && !cors;

const mapApisExtendedToApis = (apisExtended: ApiExtended[]): Api[] =>
  apisExtended.map(api => ({
    title: api.title,
    description: api.description,
    link: api.link,
    category: api.category,
    cors: api.cors,
  }));

async function getApis(apiQuery: ApiQuery): Promise<Api[] | ApiExtended[]> {
  let cachedApis: Api[] = apisCache.get(CACHE_KEY_APIS);
  if (!cachedApis) {
    const apisOriginal = await getApisFromEndpoint();

    cachedApis = mapApis(apisOriginal);
    apisCache.set(CACHE_KEY_APIS, cachedApis);

    const newApisExtended = cachedApis.map(api => ({
      titleLow: api.title.toLowerCase(),
      ...api,
    }));
    apisCache.set(CACHE_KEY_APIS_EXTENDED, newApisExtended);
  }

  if (isNoQuery(apiQuery)) return cachedApis;

  const filteredApis = filterApis(
    apisCache.get(CACHE_KEY_APIS_EXTENDED),
    apiQuery,
  );
  return mapApisExtendedToApis(filteredApis);
}

const allowedCorsQueryValues = ['true', 'false', 'undefined'];

const getApiQueryErrorMsg = ({ cors }: ApiQuery): string =>
  typeof cors !== 'undefined' && !allowedCorsQueryValues.includes(cors)
    ? 'Query parameter "cors" must be "true", "false" or "undefined"!'
    : '';

const getController: RequestHandler = async (req, res) => {
  const apiQueryErrorMsg = getApiQueryErrorMsg(req.query);
  if (apiQueryErrorMsg) {
    res.status(400);
    res.send(apiQueryErrorMsg);
    return;
  }

  try {
    const apis = await getApis(req.query);
    res.json(apis);
  } catch (error) {
    throw new Error(
      `Error received from the endpoint: "${(error as AxiosError).message}"`,
    );
  }
};

const apisController: Controller = {
  allowOrigin: '*',
  methods: implementedMethods,
  handlers: {
    GET: getController,
  },
};

export default apisController;
