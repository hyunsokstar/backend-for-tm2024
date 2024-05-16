import { Test, TestingModule } from '@nestjs/testing';
import { DevRelayController } from './dev-relay.controller';
import { DevRelayService } from './dev-relay.service';

describe('DevRelayController', () => {
  let controller: DevRelayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevRelayController],
      providers: [DevRelayService],
    }).compile();

    controller = module.get<DevRelayController>(DevRelayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
