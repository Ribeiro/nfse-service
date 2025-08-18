import { Injectable, Logger } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unsafe-assignment,
                  @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-unsafe-member-access */
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  type SecretsManagerClientConfig,
} from '@aws-sdk/client-secrets-manager';
import {
  CertificateProvider,
  TlsMaterial,
} from '../contracts/certificate-provider';

type FocusTlsSecret = {
  caBundle?: string;
  clientCert?: string;
  clientKey?: string;
  pfxBase64?: string;
  passphrase?: string;
};

function isUint8Array(val: unknown): val is Uint8Array {
  return typeof val === 'object' && val instanceof Uint8Array;
}

function normalizeSecret(input: unknown): FocusTlsSecret {
  const o =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const pick = (k: keyof FocusTlsSecret): string | undefined => {
    const v = o[k as string];
    return typeof v === 'string' && v.length > 0 ? v : undefined;
  };

  return {
    caBundle: pick('caBundle'),
    clientCert: pick('clientCert'),
    clientKey: pick('clientKey'),
    pfxBase64: pick('pfxBase64'),
    passphrase: pick('passphrase'),
  };
}

@Injectable()
export class AwsSecretsManagerCertificateProvider
  implements CertificateProvider
{
  private readonly client: SecretsManagerClient;
  private readonly secretId: string;
  private readonly logger = new Logger(
    AwsSecretsManagerCertificateProvider.name,
  );

  constructor() {
    const smConfig: SecretsManagerClientConfig = {
      region: process.env.AWS_REGION,
    };

    this.client = new SecretsManagerClient(smConfig);

    this.secretId = process.env.FOCUS_TLS_SECRET_ID ?? 'focus-tls';
  }

  async loadTlsMaterial(): Promise<TlsMaterial> {
    try {
      const cmd = new GetSecretValueCommand({ SecretId: this.secretId });
      const outUnknown: unknown = await this.client.send(cmd);

      const out =
        typeof outUnknown === 'object' && outUnknown !== null
          ? (outUnknown as Record<string, unknown>)
          : {};

      const secretString =
        typeof out['SecretString'] === 'string' &&
        out['SecretString'].length > 0
          ? out['SecretString']
          : undefined;

      const secretBinaryRaw = out['SecretBinary'];
      const secretBinary = isUint8Array(secretBinaryRaw)
        ? secretBinaryRaw
        : undefined;

      const payloadStr =
        secretString ??
        (secretBinary ? Buffer.from(secretBinary).toString('utf8') : '{}');

      const parsedJson = this.parseSecretJson(payloadStr);
      const parsed: FocusTlsSecret = normalizeSecret(parsedJson);

      const pfx = parsed.pfxBase64
        ? Buffer.from(parsed.pfxBase64, 'base64')
        : undefined;

      const tls: TlsMaterial = {
        ca: parsed.caBundle,
        cert: parsed.clientCert,
        key: parsed.clientKey,
        pfx,
        passphrase: parsed.passphrase,
        servername: 'api.focusnfe.com.br',
      };

      return tls;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Unknown error';
      this.logger.error(
        `Failed to load TLS material from AWS Secrets Manager: ${msg}`,
      );
      throw new Error('Failed to load TLS material');
    }
  }

  private parseSecretJson(payloadStr: string): unknown {
    try {
      return JSON.parse(payloadStr) as unknown;
    } catch (parseErr: unknown) {
      const msg =
        parseErr instanceof Error
          ? parseErr.message
          : typeof parseErr === 'string'
            ? parseErr
            : 'Unknown parsing error';
      this.logger.error(`Failed to parse TLS secret JSON: ${msg}`);
      throw new Error('Invalid TLS secret JSON');
    }
  }
}
