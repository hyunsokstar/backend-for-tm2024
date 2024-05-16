import { Test, TestingModule } from '@nestjs/testing';
import { DevRelayService } from './dev-relay.service';

describe('DevRelayService', () => {
  let service: DevRelayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevRelayService],
    }).compile();

    service = module.get<DevRelayService>(DevRelayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
