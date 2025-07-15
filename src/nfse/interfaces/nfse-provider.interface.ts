import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result..dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';
import { EmitirNfseDto } from './../dto/emitir-nfse.dto';

export interface INfseProvider {
  emitirNfse(
    dados: EmitirNfseDto,
    ref: string,
  ): Promise<EmitirNfseResponseDto | NfseErrorDto>;
  consultar(ref: string): Promise<ConsultarNfseResultDto>;
  cancelar(ref: string, justificativa: string): Promise<CancelarNfseResultDto>;
}
