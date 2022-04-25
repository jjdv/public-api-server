import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const responseTransformer = (response: AxiosResponse) => response.data;

export default function makeHttpService(config?: AxiosRequestConfig) {
  const httpInstance = axios.create(config);
  httpInstance.interceptors.response.use(responseTransformer);

  return httpInstance;
}
