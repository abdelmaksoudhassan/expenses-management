import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {includes,toUpper} from 'lodash'
import { PurchaseDto } from 'src/database/dto/purchase.dto';
import { PurchaseType } from 'src/database/enum/purchase-type.enum';

@Injectable()
export class PurchaseValidationPipe implements PipeTransform {
  readonly purchase = [PurchaseType.fuel,PurchaseType.tool]
  transform(value: PurchaseDto, metadata: ArgumentMetadata) {
    const purchase = toUpper(value.type)
    if(!includes(this.purchase,purchase)){
      throw new BadRequestException(`invalid ${purchase}`)
    }
    return value;
  }
}
