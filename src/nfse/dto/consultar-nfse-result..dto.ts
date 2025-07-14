import { ConsultarNfseResponseDto } from './consultar-nfse-response.dto';
import { NfseErrorDto } from './nfse-error.dto';

export class ConsultarNfseResultDto {
  success: boolean;
  data?: ConsultarNfseResponseDto;
  error?: NfseErrorDto;
}
