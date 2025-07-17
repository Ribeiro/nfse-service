import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CancelarNfseDto } from '../dto/cancelar-nfse.dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';

export function DocCancelNfse() {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel an issued NFS-e' }),
    ApiParam({ name: 'ref', description: 'Reference of the NFS-e to cancel' }),
    ApiBody({
      description: 'Cancellation justification',
      type: CancelarNfseDto,
    }),
    ApiResponse({
      status: 200,
      description: 'NFS-e successfully cancelled',
      type: CancelarNfseResultDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to cancel the NFS-e',
      type: NfseErrorDto,
    }),
  );
}
