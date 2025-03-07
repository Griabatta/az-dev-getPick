import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, from } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { volRangeMap } from './vol-range';

@Injectable()
export class ImageProxyService {
  constructor(private readonly httpService: HttpService) {}

  private async checkImageExists(url: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.head(url)
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }

  private getBasketNumber(vol: number): string {
    const hosts = volRangeMap.mediabasket_route_map[0].hosts;
    const host = hosts.find(h => vol >= h.vol_range_from && vol <= h.vol_range_to);
    
    if (!host) {
      throw new Error(`Не найдена корзина для vol=${vol}`);
    }

    const basketNum = host.host.split('-')[1].split('.')[0];
    return basketNum;
  }

  findImage(nmid: string): Observable<string> {
    return from(this.findImageFromNmid(nmid));
  }

  private async findImageFromNmid(nmid: string): Promise<string> {
    try {
      const vol = nmid.length >= 9 ? nmid.slice(0, 4) : nmid.slice(0, 3);
      const part = nmid.length >= 9 ? nmid.slice(0, 6) : nmid.slice(0, 5);
      
      const basket = this.getBasketNumber(parseInt(vol));
      

      const imageUrl = `https://basket-${basket}.wbbasket.ru/vol${vol}/part${part}/${nmid}/images/big/1.webp`;
      console.log(imageUrl);  
      if (await this.checkImageExists(imageUrl)) {
        return imageUrl;
      }

      throw new HttpException('Изображение не найдено', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException(
        error.message || 'Ошибка при поиске изображения',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
