export interface CancelamentoErroDto {
  codigo: string;
  mensagem: string;
  correcao?: string;
}

export interface CancelamentoSucessoDto {
  status: 'cancelado';
}

export interface CancelarNfseResultDto {
  success: boolean;
  data?: CancelamentoSucessoDto;
  error?: CancelamentoErroDto;
}
