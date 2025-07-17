import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result.dto';

export function DocConsultNfse() {
  return applyDecorators(
    ApiOperation({ summary: 'Consult a previously issued NFS-e by reference' }),
    ApiParam({ name: 'ref', description: 'Reference used during issuance' }),
    ApiResponse({
      status: 200,
      description: 'NFS-e successfully found',
      type: ConsultarNfseResultDto,
    }),
  );
}
