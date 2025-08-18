export interface TlsMaterial {
  ca?: string | string[];
  cert?: string;
  key?: string;
  pfx?: Buffer;
  passphrase?: string;
  servername?: string;
}

export interface CertificateProvider {
  loadTlsMaterial(): Promise<TlsMaterial>;
}
