import { Module } from '@nestjs/common';
import { NfseController } from '../nfse/controllers/nfse.controller';
import { NfseService } from '../nfse/services/nfse.service';
import { FocusNfseService } from './focus/focus-nfse.service';
import { HttpService } from '../common/http/http.service';

@Module({
  controllers: [NfseController],
  providers: [NfseService, FocusNfseService, HttpService],
})
export class NfseModule {}
