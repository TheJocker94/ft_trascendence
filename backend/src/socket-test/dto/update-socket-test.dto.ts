import { PartialType } from '@nestjs/mapped-types';
import { CreateSocketTestDto } from './create-socket-test.dto';

export class UpdateSocketTestDto extends PartialType(CreateSocketTestDto) {
  id: number;
}
