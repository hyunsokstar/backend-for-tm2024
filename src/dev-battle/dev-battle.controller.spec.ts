import { Test, TestingModule } from '@nestjs/testing';
import { DevBattleController } from './dev-battle.controller';
import { DevBattleService } from './dev-battle.service';

describe('DevBattleController', () => {
  let controller: DevBattleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevBattleController],
      providers: [DevBattleService],
    }).compile();

    controller = module.get<DevBattleController>(DevBattleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
