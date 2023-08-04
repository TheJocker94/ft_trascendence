import { Injectable } from '@nestjs/common';
import { CreateSocketTestDto } from './dto/create-socket-test.dto';
import { UpdateSocketTestDto } from './dto/update-socket-test.dto';

@Injectable()
export class SocketTestService {
  create(createSocketTestDto: CreateSocketTestDto) {
    return 'This action adds a new socketTest';
  }

  findAll() {
    return `This action returns all socketTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} socketTest`;
  }

  update(id: number, updateSocketTestDto: UpdateSocketTestDto) {
    return `This action updates a #${id} socketTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} socketTest`;
  }
}
