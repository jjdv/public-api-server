import http from '../services/http';
import request from '../tests/request';
import testOptionsMethod from '../tests/testOptionsMethod';
import testNotImplementedMethods from '../tests/testNotImplementedMethods';
import {
  implementedMethods,
  allowedOrigin,
  ApiOriginal,
  apisCache,
} from './apis';

jest.mock('../services/http');
const mockedHttp = http as jest.Mocked<typeof http>;

const apiCorsYes: ApiOriginal = {
  API: 'RandomCat',
  Description: 'Api 1',
  Link: 'example.com/link1',
  Category: 'category 1',
  Cors: 'yes',
};

const apiCorsNo: ApiOriginal = {
  API: 'Fast cars',
  Description: 'Api 2',
  Link: 'example.com/link2',
  Category: 'category 2',
  Cors: 'no',
};

const apiCorsUnknown1: ApiOriginal = {
  API: 'Vacation',
  Description: 'Api 3',
  Link: 'example.com/link3',
  Category: 'category 3',
  Cors: 'unknown',
};

const apiCorsUnknown2: ApiOriginal = {
  API: 'Other',
  Description: 'Api 4',
  Link: 'example.com/link4',
  Category: 'category 1',
  Cors: 'unknown',
};

const mockedApis: ApiOriginal[] = [
  apiCorsYes,
  apiCorsNo,
  apiCorsUnknown1,
  apiCorsUnknown2,
];

const mockedResponse = {
  count: 3,
  entries: mockedApis,
};

function getCors(corsOriginal: string): boolean | undefined {
  if (corsOriginal === 'unknown') return undefined;

  return corsOriginal === 'yes';
}

const appApis = mockedApis.map(api => ({
  title: api.API,
  description: api.Description,
  link: api.Link,
  category: api.Category,
  cors: getCors(api.Cors),
}));

describe('/apis', () => {
  it('uses cashed data for subsequent requests', async () => {
    mockedHttp.get.mockReset();
    apisCache.clear();
    mockedHttp.get.mockResolvedValue(mockedResponse);
    await request.get('/apis');
    await request.get('/apis?title=ca&cors=undefined');

    expect(mockedHttp.get).toHaveBeenCalledTimes(1);
  });

  it('GET returns Response with Apis and status code 200', async () => {
    mockedHttp.get.mockResolvedValue(mockedResponse);
    const response = await request.get('/apis');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(appApis);
  });

  it('returns filtered data by title', async () => {
    mockedHttp.get.mockResolvedValue(mockedResponse);
    const response = await request.get('/apis?title=ca');

    expect(response.body).toEqual(appApis.slice(0, 3));
  });

  it('returns filtered data by cors', async () => {
    mockedHttp.get.mockResolvedValue(mockedResponse);
    const response = await request.get('/apis?cors=true');

    expect(response.body).toEqual(appApis.slice(0, 1));
  });

  it('returns filtered data by title and cors', async () => {
    mockedHttp.get.mockResolvedValue(mockedResponse);
    const response = await request.get('/apis?title=ca&cors=undefined');

    expect(response.body).toEqual(appApis.slice(2, 3));
  });

  it('uses cashed data for subsequent requests', async () => {
    mockedHttp.get.mockReset();
    apisCache.clear();
    mockedHttp.get.mockResolvedValue(mockedResponse);
    await request.get('/apis');
    await request.get('/apis?title=ca&cors=undefined');

    expect(mockedHttp.get).toHaveBeenCalledTimes(1);
  });

  testOptionsMethod('/apis', allowedOrigin, implementedMethods);

  testNotImplementedMethods('/apis', implementedMethods);
});
