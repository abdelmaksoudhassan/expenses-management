import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Status } from 'src/database/enum/status.enum';
import { includes,toUpper } from 'lodash'
import { QueryDto } from 'src/database/dto/query.dto';
@Injectable()
export class StatusValidationPipe implements PipeTransform {
  readonly statusList = [Status.approved,Status.pending,Status.rejected]
  transform(value: QueryDto, metadata: ArgumentMetadata) {
    const status = toUpper(value.status)
    if(!includes(this.statusList,status)){
      throw new BadRequestException(`invalid ${status}`)
    }
    return value
  }
}