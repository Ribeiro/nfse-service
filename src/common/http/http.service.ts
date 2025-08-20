/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AXIOS_INSTANCE } from './http.tokens';
import { Readable } from 'stream';

@Injectable()
export class HttpService {
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

  // =========================================================
  // 1) Baixar como ARRAYBUFFER (Axios monta o Buffer p/ você)
  //    -> mais simples; ótimo para XML pequeno/médio
  // =========================================================
  async getBuffer(url: string, config?: AxiosRequestConfig): Promise<Buffer> {
    const res = await this.client.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      maxBodyLength: 10 * 1024 * 1024, // 10MB
      timeout: 30_000,
      headers: { Accept: 'application/xml', ...(config?.headers ?? {}) },
      ...config,
    });

    const data: unknown = res.data;
    if (Buffer.isBuffer(data)) return data;
    return Buffer.from(new Uint8Array(data as ArrayBuffer));
  }

  // =========================================================
  // 2) Baixar como STREAM e acumular num Buffer manualmente
  //    -> exatamente o que você pediu
  // =========================================================
  async getStream(url: string, config?: AxiosRequestConfig): Promise<Readable> {
    const res = await this.client.get<Readable>(url, {
      responseType: 'stream',
      maxBodyLength: 10 * 1024 * 1024, // 10MB
      timeout: 30_000,
      headers: { Accept: 'application/xml', ...(config?.headers ?? {}) },
      ...config,
    });
    return res.data as unknown as Readable;
  }

  async downloadToBufferViaStream(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Buffer> {
    const stream = await this.getStream(url, config);

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      stream.on('data', (chunk: unknown) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as any));
      });
      stream.once('end', resolve);
      stream.once('error', reject);
    });

    return Buffer.concat(chunks);
  }
}
