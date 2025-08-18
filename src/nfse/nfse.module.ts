import { Module } from '@nestjs/common';
import { NfseController } from '../nfse/controllers/nfse.controller';
import { NfseService } from '../nfse/services/nfse.service';
import { FocusNfseService } from './focus/focus-nfse.service';
import { HttpModule } from '../common/http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [NfseController],
  providers: [NfseService, FocusNfseService],
})
export class NfseModule {}
