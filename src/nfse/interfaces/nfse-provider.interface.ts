import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result.dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';
import { EmitirNfseDto } from './../dto/emitir-nfse.dto';

export interface INfseProvider {
  issue(
    dados: EmitirNfseDto,
    ref: string,
  ): Promise<EmitirNfseResponseDto | NfseErrorDto>;
  query(ref: string): Promise<ConsultarNfseResultDto>;
  cancel(ref: string, justificativa: string): Promise<CancelarNfseResultDto>;
}
