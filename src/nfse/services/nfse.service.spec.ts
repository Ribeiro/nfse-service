import { Test, TestingModule } from '@nestjs/testing';
import { NfseService } from './nfse.service';
import { FocusNfseService } from '../focus/focus-nfse.service';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result.dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';

describe('NfseService', () => {
  let service: NfseService;

  const mockFocusNfseService = {
    issue: jest.fn(),
    query: jest.fn(),
    cancel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NfseService,
        { provide: FocusNfseService, useValue: mockFocusNfseService },
      ],
    }).compile();

    service = module.get<NfseService>(NfseService);
    jest.clearAllMocks();
  });

  describe('issue', () => {
    it('should delegate issue call to provider', async () => {
      const dto: EmitirNfseDto = {} as EmitirNfseDto;
      const ref = 'ref001';
      const expected: EmitirNfseResponseDto = {
        success: true,
        data: {
          cnpj_prestador: '12345678000100',
          ref,
          status: 'processando_autorizacao',
        },
      };

      mockFocusNfseService.issue.mockResolvedValue(expected);

      const result = await service.issue(dto, ref);

      expect(result).toEqual(expected);
      expect(mockFocusNfseService.issue).toHaveBeenCalledWith(dto, ref);
    });
  });

  describe('query', () => {
    it('should delegate query call to provider', async () => {
      const ref = 'ref002';
      const expected: ConsultarNfseResultDto = {
        success: true,
        data: {
          cnpj_prestador: '12345678000100',
          ref,
          numero_rps: 'RPS-001',
          serie_rps: 'A1',
          status: 'autorizado',
        },
      };

      mockFocusNfseService.query.mockResolvedValue(expected);

      const result = await service.query(ref);

      expect(result).toEqual(expected);
      expect(mockFocusNfseService.query).toHaveBeenCalledWith(ref);
    });
  });

  describe('cancel', () => {
    it('should delegate cancel call to provider', async () => {
      const ref = 'ref003';
      const justificativa = 'Duplicidade';
      const expected: CancelarNfseResultDto = {
        success: true,
        data: {
          status: 'cancelado',
        },
      };

      mockFocusNfseService.cancel.mockResolvedValue(expected);

      const result = await service.cancel(ref, justificativa);

      expect(result).toEqual(expected);
      expect(mockFocusNfseService.cancel).toHaveBeenCalledWith(
        ref,
        justificativa,
      );
    });
  });
});
