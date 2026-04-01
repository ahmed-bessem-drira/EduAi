import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || '3001';
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.setGlobalPrefix('api');

  const server = await app.listen(port);
  server.setTimeout(300000); // 5 minutes timeout for Render Free Plan
  console.log(`EduAI Backend running on port ${port}`);
  console.log(`🌐 CORS enabled for: ${frontendUrl}`); // Dev watch trigger
}


bootstrap();
