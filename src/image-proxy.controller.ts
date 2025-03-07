import { Controller, Get, Query, Redirect, HttpStatus, HttpException } from '@nestjs/common';
import { ImageProxyService } from './image-proxy.service';
import { firstValueFrom } from 'rxjs';

@Controller('getPic')
export class ImageProxyController {
  constructor(private readonly imageProxyService: ImageProxyService) {}

  @Get()
  @Redirect()
  async getImage(@Query('nmid') nmid: string) {
    if (!nmid) {
      throw new HttpException('Артикул (nmid) обязателен', HttpStatus.BAD_REQUEST);
    }

    const imageUrl = await firstValueFrom(this.imageProxyService.findImage(nmid));
    return { url: imageUrl, statusCode: 302 };
  }
}