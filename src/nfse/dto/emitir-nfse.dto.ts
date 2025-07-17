import {
  IsString,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  ValidateNested,
  IsNumberString,
  IsOptional,
  IsBooleanString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PrestadorDto {
  @Matches(/^\d{14}$/, { message: 'CNPJ inválido' })
  cnpj: string;

  @IsString()
  inscricao_municipal: string;

  @IsString()
  codigo_municipio: string;
}

export class EnderecoDto {
  @IsString()
  logradouro: string;

  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  codigo_municipio: string;

  @IsString()
  @Length(2, 2)
  uf: string;

  @Matches(/^\d{8}$/, { message: 'CEP deve ter 8 dígitos numéricos' })
  cep: string;
}

export class TomadorDto {
  @Matches(/^\d{11}$/, { message: 'CPF inválido' })
  cpf: string;

  @IsString()
  razao_social: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;
}

export class ServicoDto {
  @IsString()
  discriminacao: string;

  @IsString()
  codigo_tributario_municipio: string;

  @IsString()
  item_lista_servico: string;

  @IsNumberString()
  valor_servicos: string;

  @IsNumberString()
  valor_deducoes: string;

  @IsNumberString()
  valor_pis: string;

  @IsNumberString()
  valor_cofins: string;

  @IsNumberString()
  valor_inss: string;

  @IsNumberString()
  valor_ir: string;

  @IsNumberString()
  valor_csll: string;

  @IsNumberString()
  valor_iss: string;

  @IsNumberString()
  valor_iss_retido: string;

  @IsNumberString()
  outras_retencoes: string;

  @IsNumberString()
  base_calculo: string;

  @IsNumberString()
  aliquota: string;

  @IsNumberString()
  desconto_incondicionado: string;

  @IsNumberString()
  desconto_condicionado: string;

  @IsNumberString()
  percentual_total_tributos: string;

  @IsString()
  fonte_total_tributos: string;

  @IsBooleanString()
  iss_retido: string;

  @IsString()
  codigo_cnae: string;

  @IsString()
  codigo_municipio: string;
}

export class EmitirNfseDto {
  @IsDateString()
  data_emissao: string;

  @IsString()
  @IsNotEmpty()
  natureza_operacao: string;

  @ValidateNested()
  @Type(() => PrestadorDto)
  prestador: PrestadorDto;

  @ValidateNested()
  @Type(() => TomadorDto)
  tomador: TomadorDto;

  @ValidateNested()
  @Type(() => ServicoDto)
  servico: ServicoDto;
}
