import { NestFactory } from '@nestjs/core';
import { ImageProxyModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(ImageProxyModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
