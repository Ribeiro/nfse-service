import { Test, TestingModule } from '@nestjs/testing';
import { NfseController } from './nfse.controller';
import { NfseService } from '../services/nfse.service';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result.dto';
import { CancelarNfseDto } from '../dto/cancelar-nfse.dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';

describe('NfseController', () => {
  let controller: NfseController;

  const mockService = {
    issue: jest.fn(),
    query: jest.fn(),
    cancel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NfseController],
      providers: [{ provide: NfseService, useValue: mockService }],
    }).compile();

    controller = module.get<NfseController>(NfseController);
  });

  describe('issue()', () => {
    it('should return a successful NFS-e response', async () => {
      const ref = 'ref001';
      const dto: EmitirNfseDto = {
        data_emissao: '2025-09-30',
        natureza_operacao: '1',
        prestador: {
          cnpj: '12345678000100',
          inscricao_municipal: '123456',
          codigo_municipio: '3550308',
        },
        tomador: {
          cpf: '98765432100',
          razao_social: 'Cliente Teste',
          email: 'cliente@teste.com',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '100',
            bairro: 'Centro',
            codigo_municipio: '3550308',
            uf: 'SP',
            cep: '01234567',
          },
        },
        servico: {
          discriminacao: 'Consultoria em TI',
          codigo_tributario_municipio: '101',
          item_lista_servico: '17.09',
          valor_servicos: '100.00',
          valor_deducoes: '0.00',
          valor_pis: '0.00',
          valor_cofins: '0.00',
          valor_inss: '0.00',
          valor_ir: '0.00',
          valor_csll: '0.00',
          valor_iss: '5.00',
          valor_iss_retido: '0.00',
          outras_retencoes: '0.00',
          base_calculo: '100.00',
          aliquota: '0.05',
          desconto_incondicionado: '0.00',
          desconto_condicionado: '0.00',
          percentual_total_tributos: '0.00',
          fonte_total_tributos: 'IBPT',
          iss_retido: 'false',
          codigo_cnae: '6201500',
          codigo_municipio: '3550308',
        },
      };

      const expected: EmitirNfseResponseDto = {
        success: true,
        data: {
          cnpj_prestador: '12345678000100',
          ref: 'ref001',
          status: 'processando_autorizacao',
        },
      };

      mockService.issue.mockResolvedValue(expected);

      const result = await controller.emitir(ref, dto);
      expect(result).toEqual(expected);
      expect(mockService.issue).toHaveBeenCalledWith(dto, ref);
    });

    it('should return an error response', async () => {
      const ref = 'ref002';
      const dto: EmitirNfseDto = {
        data_emissao: '2025-09-30',
        natureza_operacao: '',
        prestador: {
          cnpj: '',
          inscricao_municipal: '',
          codigo_municipio: '',
        },
        tomador: {
          cpf: '',
          razao_social: '',
          email: '',
          endereco: {
            logradouro: '',
            numero: '',
            bairro: '',
            codigo_municipio: '',
            uf: '',
            cep: '',
          },
        },
        servico: {
          discriminacao: '',
          codigo_tributario_municipio: '',
          item_lista_servico: '',
          valor_servicos: '0.00',
          valor_deducoes: '0.00',
          valor_pis: '0.00',
          valor_cofins: '0.00',
          valor_inss: '0.00',
          valor_ir: '0.00',
          valor_csll: '0.00',
          valor_iss: '0.00',
          valor_iss_retido: '0.00',
          outras_retencoes: '0.00',
          base_calculo: '0.00',
          aliquota: '0.00',
          desconto_incondicionado: '0.00',
          desconto_condicionado: '0.00',
          percentual_total_tributos: '0.00',
          fonte_total_tributos: '',
          iss_retido: 'false',
          codigo_cnae: '',
          codigo_municipio: '',
        },
      };

      const error: EmitirNfseResponseDto = {
        success: false,
        error: {
          codigo: 'EMIT_FAILED',
          mensagem: 'Failed to issue',
        },
      };

      mockService.issue.mockResolvedValue(error);

      const result = await controller.emitir(ref, dto);
      expect(result).toEqual(error);
      expect(mockService.issue).toHaveBeenCalledWith(dto, ref);
    });
  });

  describe('query()', () => {
    it('should return NFS-e query result', async () => {
      const ref = 'ref003';

      const expected: ConsultarNfseResultDto = {
        success: true,
        data: {
          cnpj_prestador: '12345678000100',
          ref: 'ref003',
          numero_rps: 'RPS-001',
          serie_rps: 'A1',
          status: 'autorizado',
        },
      };

      mockService.query.mockResolvedValue(expected);

      const result = await controller.consultar(ref);
      expect(result).toEqual(expected);
      expect(mockService.query).toHaveBeenCalledWith(ref);
    });
  });

  describe('cancel()', () => {
    it('should return successful cancellation result', async () => {
      const ref = 'ref004';
      const dto: CancelarNfseDto = { justificativa: 'Duplicate issue' };

      const expected: CancelarNfseResultDto = {
        success: true,
        data: {
          status: 'cancelado',
        },
      };

      mockService.cancel.mockResolvedValue(expected);

      const result = await controller.cancelar(ref, dto);
      expect(result).toEqual(expected);
      expect(mockService.cancel).toHaveBeenCalledWith(ref, dto.justificativa);
    });
  });
});
