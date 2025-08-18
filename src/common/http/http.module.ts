import { Module } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { rootCertificates as nodeRootCAs } from 'tls';

import { AXIOS_INSTANCE, CERT_PROVIDER, HTTP_BASE_URL } from './http.tokens';
import { HttpService } from './http.service';
import { CertificateProvider } from './contracts/certificate-provider';
import { AwsSecretsManagerCertificateProvider } from './certs/aws-secrets-manager.provider';

const isString = (v: unknown): v is string => typeof v === 'string';

@Module({
  providers: [
    {
      provide: HTTP_BASE_URL,
      useValue: process.env.FOCUS_BASE_URL ?? 'https://api.focusnfe.com.br',
    },

    { provide: CERT_PROVIDER, useClass: AwsSecretsManagerCertificateProvider },

    {
      provide: AXIOS_INSTANCE,
      useFactory: async (
        certProvider: CertificateProvider,
        baseURL: string,
      ): Promise<AxiosInstance> => {
        const tlsMaterial = await certProvider.loadTlsMaterial();

        // Narrowing seguro: garante string[]
        const baseCAs: string[] = Array.isArray(nodeRootCAs)
          ? nodeRootCAs.filter(isString)
          : [];

        // Começa com as CAs padrão
        let caList: Array<string | Buffer> = baseCAs.slice();

        // Anexa as CAs extras do provider (string | string[])
        if (typeof tlsMaterial.ca === 'string') {
          caList.push(tlsMaterial.ca);
        } else if (Array.isArray(tlsMaterial.ca)) {
          caList = caList.concat(tlsMaterial.ca.filter(isString));
        }

        const httpsAgent = new https.Agent({
          ca: caList,
          cert: tlsMaterial.cert,
          key: tlsMaterial.key,
          pfx: tlsMaterial.pfx,
          passphrase: tlsMaterial.passphrase,
          minVersion: 'TLSv1.2',
          keepAlive: true,
          rejectUnauthorized: true,
          servername: tlsMaterial.servername ?? 'api.focusnfe.com.br',
        });

        return axios.create({
          baseURL,
          timeout: Number(process.env.FOCUS_TIMEOUT_MS ?? 10000),
          httpsAgent,
          // dica: se usa proxy corporativo moderno, considere { proxy: false } e use HTTPS_PROXY/NO_PROXY
        });
      },
      inject: [CERT_PROVIDER, HTTP_BASE_URL],
    },

    HttpService,
  ],
  exports: [HttpService],
})
export class HttpModule {}
