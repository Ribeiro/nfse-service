import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INfseProvider } from '../interfaces/nfse-provider.interface';
import { EmitirNfseDto } from '../dto/emitir-nfse.dto';
import { HttpService } from '../../common/http/http.service';
import { AxiosError, AxiosResponse } from 'axios';
import { ConsultarNfseResultDto } from '../dto/consultar-nfse-result.dto';
import { NfseErrorDto } from '../dto/nfse-error.dto';
import { ConsultarNfseResponseDto } from '../dto/consultar-nfse-response.dto';
import { CancelarNfseResultDto } from '../dto/cancelar-nfse-result.dto';
import {
  CancelamentoErroComListaResponse,
  CancelamentoSucessoResponse,
} from '../dto/cancelar-nfse-response.dto';
import { NfseEnvioResponseDto } from '../dto/nfse-envio-response.dto';
import { isAxiosError } from 'axios';
import { EmitirNfseResponseDto } from '../dto/emitir-nfse-response.dto';

@Injectable()
export class FocusNfseService implements INfseProvider {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('FOCUS_BASE_URL');
    this.token = this.configService.getOrThrow<string>('FOCUS_TOKEN');
  }

  async issue(
    dados: EmitirNfseDto,
    ref: string,
  ): Promise<EmitirNfseResponseDto | NfseErrorDto> {
    try {
      const basicToken = Buffer.from(`${this.token}:`).toString('base64');
      const url = `${this.baseUrl}/${encodeURIComponent(ref)}`;

      const res = await this.httpService.post<
        AxiosResponse<NfseEnvioResponseDto>,
        EmitirNfseDto
      >(url, dados, {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Basic ${basicToken}`,
        },
      });

      return {
        success: true,
        data: res.data,
      };
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data as unknown;

        if (
          typeof data === 'object' &&
          data !== null &&
          'codigo' in data &&
          'mensagem' in data
        ) {
          return {
            success: false,
            error: data as NfseErrorDto,
          };
        }
      }

      return {
        success: false,
        error: {
          codigo: 'erro_desconhecido',
          mensagem:
            error instanceof Error && typeof error.message === 'string'
              ? error.message
              : 'Erro desconhecido',
        },
      };
    }
  }

  async query(ref: string): Promise<ConsultarNfseResultDto> {
    const basicToken = Buffer.from(`${this.token}:`).toString('base64');

    try {
      const res = await this.httpService.get<ConsultarNfseResponseDto>(
        `${this.baseUrl}/${encodeURIComponent(ref)}`,
        {
          headers: {
            Authorization: `Basic ${basicToken}`,
          },
        },
      );

      if (!res?.status) {
        return {
          success: false,
          error: {
            codigo: 'resposta_invalida',
            mensagem: 'Campo status ausente na resposta da nota fiscal.',
          },
        };
      }

      return { success: true, data: res };
    } catch (error: unknown) {
      let mensagem = 'Erro desconhecido';

      if (error instanceof AxiosError) {
        const data: unknown = error.response?.data;

        if (
          data &&
          typeof data === 'object' &&
          'codigo' in data &&
          'mensagem' in data
        ) {
          return {
            success: false,
            error: data as NfseErrorDto,
          };
        }

        return {
          success: false,
          error: { codigo: 'erro_desconhecido', mensagem: error.message },
        };
      }

      if (error instanceof Error) {
        mensagem = error.message;
      }

      return {
        success: false,
        error: { codigo: 'erro_desconhecido', mensagem },
      };
    }
  }

  async cancel(
    ref: string,
    justificativa: string,
  ): Promise<CancelarNfseResultDto> {
    const basicToken = Buffer.from(`${this.token}:`).toString('base64');

    try {
      const response: AxiosResponse = await this.httpService.delete(
        `${this.baseUrl}/${encodeURIComponent(ref)}`,
        {
          headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/json',
          },
          data: { justificativa },
        },
      );

      const data: unknown = response.data;

      if (this.isCancelamentoSucesso(data)) {
        return { success: true, data };
      }

      if (this.isCancelamentoErroComLista(data)) {
        const [firstError] = data.erros;
        return {
          success: false,
          error: {
            codigo: firstError.codigo,
            mensagem: firstError.mensagem,
            correcao: firstError.correcao,
          },
        };
      }

      if (this.isCancelamentoErroSimples(data)) {
        return {
          success: false,
          error: {
            codigo: data.codigo,
            mensagem: data.mensagem,
          },
        };
      }

      return {
        success: false,
        error: {
          codigo: 'resposta_invalida',
          mensagem: 'Resposta inesperada ao cancelar NFS-e.',
        },
      };
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data &&
        this.isCancelamentoErroSimples(error.response.data)
      ) {
        return {
          success: false,
          error: {
            codigo: error.response.data.codigo,
            mensagem: error.response.data.mensagem,
          },
        };
      }

      const mensagem =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return {
        success: false,
        error: {
          codigo: 'erro_desconhecido',
          mensagem,
        },
      };
    }
  }

  private isCancelamentoSucesso(
    data: unknown,
  ): data is CancelamentoSucessoResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'status' in data &&
      (data as Record<string, unknown>).status === 'cancelado'
    );
  }

  private isCancelamentoErroComLista(
    data: unknown,
  ): data is CancelamentoErroComListaResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'status' in data &&
      (data as Record<string, unknown>).status === 'erro_cancelamento' &&
      'erros' in data &&
      Array.isArray((data as Record<string, unknown>).erros)
    );
  }

  private isCancelamentoErroSimples(data: unknown): data is NfseErrorDto {
    return (
      typeof data === 'object' &&
      data !== null &&
      'codigo' in data &&
      'mensagem' in data &&
      typeof (data as Record<string, unknown>).codigo === 'string' &&
      typeof (data as Record<string, unknown>).mensagem === 'string'
    );
  }
}
