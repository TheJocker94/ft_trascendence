import { Test, TestingModule } from '@nestjs/testing';
import { SocketTestService } from './socket-test.service';

describe('SocketTestService', () => {
  let service: SocketTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketTestService],
    }).compile();

    service = module.get<SocketTestService>(SocketTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
