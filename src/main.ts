import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

const contextName = 'Bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`Application started on port: ${port}`, contextName);
}

bootstrap().catch((err) => {
  Logger.error('Failed startting application', err, 'Bootstrap');
  process.exit(1);
});
