import { NfseEnvioResponseDto } from './nfse-envio-response.dto';
import { NfseErrorDto } from './nfse-error.dto';

export class EmitirNfseResponseDto {
  success: boolean;
  data?: NfseEnvioResponseDto;
  error?: NfseErrorDto | string;
}
