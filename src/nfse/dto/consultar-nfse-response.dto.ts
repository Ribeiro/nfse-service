import { ErroAutorizacaoDto } from './consultar-nfse-erro-autorizacao.dto';

export class ConsultarNfseResponseDto {
  cnpj_prestador: string;
  ref: string;
  numero_rps: string;
  serie_rps: string;
  status:
    | 'autorizado'
    | 'cancelado'
    | 'erro_autorizacao'
    | 'processando_autorizacao';

  // Presente em status: autorizado, cancelado
  numero?: string;
  codigo_verificacao?: string;
  data_emissao?: string; // ISO string
  url?: string;
  caminho_xml_nota_fiscal?: string;

  // Presente em status: cancelado
  caminho_xml_cancelamento?: string;

  // Presente em status: erro_autorizacao
  erros?: ErroAutorizacaoDto[];
}
