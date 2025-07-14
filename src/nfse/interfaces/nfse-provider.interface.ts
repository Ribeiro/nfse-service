import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result..dto';
import { EmitirNfseDto, EmitirNfseResponseDto } from './../dto/emitir-nfse.dto';

export interface INfseProvider {
  emitirNfse(dados: EmitirNfseDto, ref: string): Promise<EmitirNfseResponseDto>;
  consultar(ref: string): Promise<ConsultarNfseResultDto>;
  cancelar(ref: string, justificativa: string): Promise<CancelarNfseResultDto>;
}
