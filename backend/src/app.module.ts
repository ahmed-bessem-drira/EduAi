import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AiModule } from './ai/ai.module';
import { UploadModule } from './upload/upload.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule.register({
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
      },
    }),
    AiModule,
    UploadModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
