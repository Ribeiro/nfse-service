import { IsString, Length } from 'class-validator';

export class CancelarNfseDto {
  @IsString()
  @Length(15, 255, {
    message: 'A justificativa deve conter entre 15 e 255 caracteres.',
  })
  justificativa: string;
}
