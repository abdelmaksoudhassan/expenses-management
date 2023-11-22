import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {includes,toUpper} from 'lodash'
import { Title } from 'src/database/enum/title.enum';

@Injectable()
export class TitleValidationPipe implements PipeTransform {
  readonly titles = [Title.manager,Title.employee]
  transform(value: any, metadata: ArgumentMetadata) {
    const title = toUpper(value.title)
    if(!includes(this.titles,title)){
      throw new BadRequestException(`${title} is invalid person title`)
    }
    return value;
  }
}
