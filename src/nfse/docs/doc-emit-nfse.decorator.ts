import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';

export function DocEmitNfse() {
  return applyDecorators(
    ApiOperation({ summary: 'Issue a new service invoice (NFS-e)' }),
    ApiParam({ name: 'ref', description: 'Unique reference for this request' }),
    ApiBody({
      description: 'Payload to issue the NFS-e',
      type: EmitirNfseDto,
    }),
    ApiResponse({
      status: 201,
      description: 'NFS-e successfully issued',
      type: EmitirNfseResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to issue the NFS-e',
      type: NfseErrorDto,
    }),
  );
}
