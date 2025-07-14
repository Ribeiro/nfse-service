export interface CancelamentoSucessoResponse {
  status: 'cancelado';
}

export interface CancelamentoErroInternoResponse {
  codigo: string;
  mensagem: string;
}

export interface CancelamentoErroDetalhado {
  codigo: string;
  mensagem: string;
  correcao?: string;
}

export interface CancelamentoErroComListaResponse {
  status: 'erro_cancelamento';
  erros: CancelamentoErroDetalhado[];
}

export type CancelamentoApiResponse =
  | CancelamentoSucessoResponse
  | CancelamentoErroComListaResponse
  | CancelamentoErroInternoResponse;
