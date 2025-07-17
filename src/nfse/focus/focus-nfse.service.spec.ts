import { Test, TestingModule } from '@nestjs/testing';
import { FocusNfseService } from './focus-nfse.service';
import { HttpService } from '../../common/http/http.service';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';

describe('FocusNfseService', () => {
  let service: FocusNfseService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'FOCUS_BASE_URL') return 'https://api.focusnfe.com.br';
      if (key === 'FOCUS_TOKEN') return 'mock-token';
      throw new Error(`Unexpected config key: ${key}`);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FocusNfseService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get(FocusNfseService);
    jest.clearAllMocks();
  });

  describe('issue', () => {
    it('should return success on valid emission', async () => {
      const ref = 'ref001';
      const dto = {} as EmitirNfseDto;
      const fakeResponse = {
        cnpj_prestador: '12345678000100',
        ref,
        status: 'processando_autorizacao',
      };

      mockHttpService.post.mockResolvedValue({ data: fakeResponse });

      const result = await service.issue(dto, ref);

      if ('success' in result && result.success === true) {
        expect(result.data?.ref).toBe(ref);
        expect(result.data?.status).toBe('processando_autorizacao');
      } else {
        fail('Expected success response');
      }
    });

    it('should return known API error', async () => {
      const error = {
        isAxiosError: true,
        response: {
          data: {
            codigo: 'ERRO_TESTE',
            mensagem: 'Erro de teste',
          },
        },
      } as AxiosError;

      mockHttpService.post.mockRejectedValue(error);

      const result = await service.issue({} as EmitirNfseDto, 'ref002');

      if ('success' in result && result.success === false) {
        if (typeof result.error === 'object' && result.error !== null) {
          expect(result.error.codigo).toBe('ERRO_TESTE');
          expect(result.error.mensagem).toBe('Erro de teste');
        } else {
          fail('Expected structured error');
        }
      } else {
        fail('Expected error response');
      }
    });

    it('should return unknown error', async () => {
      mockHttpService.post.mockRejectedValue(new Error('Erro desconhecido'));

      const result = await service.issue({} as EmitirNfseDto, 'ref999');

      if ('success' in result && result.success === false) {
        if (typeof result.error === 'object') {
          expect(result.error.codigo).toBe('erro_desconhecido');
          expect(result.error.mensagem).toBe('Erro desconhecido');
        } else {
          fail('Expected structured error');
        }
      } else {
        fail('Expected error response');
      }
    });
  });

  describe('query', () => {
    it('should return success on valid query', async () => {
      const ref = 'ref003';
      const fakeResponse = {
        status: 'autorizado',
        numero_rps: '001',
      };

      mockHttpService.get.mockResolvedValue(fakeResponse);

      const result = await service.query(ref);

      if (result.success) {
        expect(result.data).toEqual(fakeResponse);
      } else {
        fail('Expected query success');
      }
    });

    it('should return error when status is missing in response', async () => {
      mockHttpService.get.mockResolvedValue({});

      const result = await service.query('ref-sem-status');

      expect(result.success).toBe(false);
      if (result.error && typeof result.error === 'object') {
        expect(result.error.codigo).toBe('resposta_invalida');
      }
    });

    it('should return known API error on query', async () => {
      const error = {
        isAxiosError: true,
        response: {
          data: {
            codigo: 'Q_ERR',
            mensagem: 'Erro na consulta',
          },
        },
      } as AxiosError;

      mockHttpService.get.mockRejectedValue(error);

      const result = await service.query('refErro');

      expect(result.success).toBe(false);
      if (result.error && typeof result.error === 'object') {
        expect(result.error.codigo).toBe('erro_desconhecido');
        expect(result.error.mensagem).toBe('Erro desconhecido');
      }
    });
  });

  describe('cancel', () => {
    it('should return success on cancellation', async () => {
      const response = {
        data: {
          status: 'cancelado',
        },
      };

      mockHttpService.delete.mockResolvedValue(response);

      const result = await service.cancel('ref-cancel', 'justificativa');

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('cancelado');
    });

    it('should handle CancelamentoErroComLista', async () => {
      const response = {
        data: {
          status: 'erro_cancelamento',
          erros: [
            {
              codigo: 'E001',
              mensagem: 'Erro A',
              correcao: 'Corrija A',
            },
          ],
        },
      };

      mockHttpService.delete.mockResolvedValue(response);

      const result = await service.cancel('ref-cancel-erro', 'justificativa');

      expect(result.success).toBe(false);
      if (typeof result.error === 'object') {
        expect(result.error.codigo).toBe('E001');
        expect(result.error.mensagem).toBe('Erro A');
      }
    });

    it('should handle CancelamentoErroSimples', async () => {
      const response = {
        data: {
          codigo: 'C001',
          mensagem: 'Cancelamento inválido',
        },
      };

      mockHttpService.delete.mockResolvedValue(response);

      const result = await service.cancel(
        'ref-cancel-simples',
        'justificativa',
      );

      expect(result.success).toBe(false);
      if (typeof result.error === 'object') {
        expect(result.error.codigo).toBe('C001');
        expect(result.error.mensagem).toBe('Cancelamento inválido');
      }
    });

    it('should handle unknown cancel response', async () => {
      mockHttpService.delete.mockResolvedValue({ data: { foo: 'bar' } });

      const result = await service.cancel('ref-erro', 'justificativa');

      expect(result.success).toBe(false);
      if (typeof result.error === 'object') {
        expect(result.error.codigo).toBe('resposta_invalida');
      }
    });

    it('should handle cancel axios error', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            codigo: 'erro_desconhecido',
            mensagem: 'Erro desconhecido',
          },
        },
      } as AxiosError;

      mockHttpService.delete.mockRejectedValue(axiosError);

      const result = await service.cancel('ref-axios', 'justificativa');

      expect(result.success).toBe(false);
      if (typeof result.error === 'object') {
        expect(result.error.codigo).toBe('erro_desconhecido');
        expect(result.error.mensagem).toBe('Erro desconhecido');
      }
    });
  });
});
