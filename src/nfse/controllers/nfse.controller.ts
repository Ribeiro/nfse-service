import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';
import { NfseService } from '../services/nfse.service';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result..dto';
import { CancelarNfseDto } from '../dto/cancelar-nfse.dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';

@Controller('nfse')
export class NfseController {
  constructor(private readonly nfseService: NfseService) {}

  @Post('emitir/:ref')
  async emitir(
    @Param('ref') ref: string,
    @Body() dto: EmitirNfseDto,
  ): Promise<EmitirNfseResponseDto | NfseErrorDto> {
    return this.nfseService.emitirNfse(dto, ref);
  }

  @Get('consultar/:ref')
  async consultar(@Param('ref') ref: string): Promise<ConsultarNfseResultDto> {
    return this.nfseService.consultar(ref);
  }

  @Post('cancelar/:ref')
  async cancelar(
    @Param('ref') ref: string,
    @Body() dto: CancelarNfseDto,
  ): Promise<CancelarNfseResultDto> {
    return this.nfseService.cancelar(ref, dto.justificativa);
  }
}
