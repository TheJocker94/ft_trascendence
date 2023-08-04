import { Test, TestingModule } from '@nestjs/testing';
import { SocketTestGateway } from './socket-test.gateway';
import { SocketTestService } from './socket-test.service';

describe('SocketTestGateway', () => {
  let gateway: SocketTestGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketTestGateway, SocketTestService],
    }).compile();

    gateway = module.get<SocketTestGateway>(SocketTestGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
