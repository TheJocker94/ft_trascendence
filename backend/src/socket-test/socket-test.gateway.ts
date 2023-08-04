import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { SocketTestService } from './socket-test.service';
import { CreateSocketTestDto } from './dto/create-socket-test.dto';
import { UpdateSocketTestDto } from './dto/update-socket-test.dto';

@WebSocketGateway()
export class SocketTestGateway {
  constructor(private readonly socketTestService: SocketTestService) {}

  @SubscribeMessage('createSocketTest')
  create(@MessageBody() createSocketTestDto: CreateSocketTestDto) {
    return this.socketTestService.create(createSocketTestDto);
  }

  @SubscribeMessage('findAllSocketTest')
  findAll() {
    return this.socketTestService.findAll();
  }

  @SubscribeMessage('findOneSocketTest')
  findOne(@MessageBody() id: number) {
    return this.socketTestService.findOne(id);
  }

  @SubscribeMessage('updateSocketTest')
  update(@MessageBody() updateSocketTestDto: UpdateSocketTestDto) {
    return this.socketTestService.update(updateSocketTestDto.id, updateSocketTestDto);
  }

  @SubscribeMessage('removeSocketTest')
  remove(@MessageBody() id: number) {
    return this.socketTestService.remove(id);
  }
}
