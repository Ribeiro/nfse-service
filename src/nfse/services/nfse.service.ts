import { Injectable } from '@nestjs/common';
import { INfseProvider } from '../interfaces/nfse-provider.interface';
import { FocusNfseService } from '../focus/focus-nfse.service';
import { EmitirNfseDto, EmitirNfseResponseDto } from '../dto/emitir-nfse.dto';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result..dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';

@Injectable()
export class NfseService implements INfseProvider {
  constructor(private readonly provider: FocusNfseService) {}

  async emitirNfse(
    dados: EmitirNfseDto,
    ref: string,
  ): Promise<EmitirNfseResponseDto> {
    return this.provider.emitirNfse(dados, ref);
  }

  async consultar(ref: string): Promise<ConsultarNfseResultDto> {
    return this.provider.consultar(ref);
  }

  async cancelar(
    ref: string,
    justificativa: string,
  ): Promise<CancelarNfseResultDto> {
    return this.provider.cancelar(ref, justificativa);
  }
}
