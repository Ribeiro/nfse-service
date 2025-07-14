import { IsString } from 'class-validator';

export class NfseErrorDto {
  @IsString()
  readonly codigo: string;
  @IsString()
  readonly mensagem: string;
}
