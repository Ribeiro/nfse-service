// src/http/http.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClient } from './contracts/http-client';
import { AXIOS_INSTANCE } from './http.tokens';

@Injectable()
export class HttpService implements HttpClient {
  constructor(@Inject(AXIOS_INSTANCE) private readonly client: AxiosInstance) {}

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.get(url, config);
    return res.data;
  }

  async post<T = unknown, B = unknown>(
    url: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.client.post(url, body, config);
    return res.data;
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.client.delete(url, config);
    return res.data;
  }
}
