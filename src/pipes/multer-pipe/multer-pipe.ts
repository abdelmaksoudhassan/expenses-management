import { ArgumentMetadata, Injectable, PayloadTooLargeException, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';

@Injectable()
export class MulterPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if(value.size > 1024*1024){
      throw new PayloadTooLargeException()
    }
    if(value.mimetype != ('image/png' || 'image/jpeg' || 'image/jpg')){
      throw new UnsupportedMediaTypeException()
    }
    return value;
  }
}