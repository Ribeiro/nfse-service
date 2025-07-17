import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';
import { NfseService } from '../services/nfse.service';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result.dto';
import { CancelarNfseDto } from '../dto/cancelar-nfse.dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';
import { ApiTags } from '@nestjs/swagger';
import { DocEmitNfse } from '../docs/doc-emit-nfse.decorator';
import { DocConsultNfse } from '../docs/doc-consult-nfse.decorator';
import { DocCancelNfse } from '../docs/doc-cancel-nfse.decorator';

@ApiTags('NFS-e')
@Controller('nfse')
export class NfseController {
  constructor(private readonly nfseService: NfseService) {}

  @Post('issue/:ref')
  @DocEmitNfse()
  async emitir(
    @Param('ref') ref: string,
    @Body() dto: EmitirNfseDto,
  ): Promise<EmitirNfseResponseDto | NfseErrorDto> {
    return this.nfseService.issue(dto, ref);
  }

  @Get('query/:ref')
  @DocConsultNfse()
  async consultar(@Param('ref') ref: string): Promise<ConsultarNfseResultDto> {
    return this.nfseService.query(ref);
  }

  @Post('cancel/:ref')
  @DocCancelNfse()
  async cancelar(
    @Param('ref') ref: string,
    @Body() dto: CancelarNfseDto,
  ): Promise<CancelarNfseResultDto> {
    return this.nfseService.cancel(ref, dto.justificativa);
  }
}
