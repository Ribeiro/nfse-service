import { Injectable } from '@nestjs/common';
import { INfseProvider } from '../interfaces/nfse-provider.interface';
import { FocusNfseService } from '../focus/focus-nfse.service';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result.dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';

@Injectable()
export class NfseService implements INfseProvider {
  constructor(private readonly provider: FocusNfseService) {}

  async issue(
    dados: EmitirNfseDto,
    ref: string,
  ): Promise<EmitirNfseResponseDto | NfseErrorDto> {
    return this.provider.issue(dados, ref);
  }

  async query(ref: string): Promise<ConsultarNfseResultDto> {
    return this.provider.query(ref);
  }

  async cancel(
    ref: string,
    justificativa: string,
  ): Promise<CancelarNfseResultDto> {
    return this.provider.cancel(ref, justificativa);
  }
}
