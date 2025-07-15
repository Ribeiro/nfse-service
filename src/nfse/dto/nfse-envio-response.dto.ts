export class NfseEnvioResponseDto {
  cnpj_prestador: string;
  ref: string;
  status: 'processando_autorizacao' | 'erro_autorizacao';
}
