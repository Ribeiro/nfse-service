import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CancelamentoErroDto {
  @ApiProperty({ example: 'CANCELAMENTO_INVALIDO' })
  codigo: string;

  @ApiProperty({ example: 'The invoice cannot be canceled after 30 days.' })
  mensagem: string;

  @ApiPropertyOptional({
    example: 'Contact city hall to request manual cancellation.',
  })
  correcao?: string;
}

export class CancelamentoSucessoDto {
  @ApiProperty({ example: 'cancelado' })
  status: 'cancelado';
}

export class CancelarNfseResultDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiPropertyOptional({ type: CancelamentoSucessoDto })
  data?: CancelamentoSucessoDto;

  @ApiPropertyOptional({ type: CancelamentoErroDto })
  error?: CancelamentoErroDto;
}
