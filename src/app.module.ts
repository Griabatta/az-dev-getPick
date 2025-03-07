import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageProxyService } from './image-proxy.service';

@Module({
  imports: [HttpModule],
  providers: [ImageProxyService],
  exports: [ImageProxyService]
})
export class ImageProxyModule {}