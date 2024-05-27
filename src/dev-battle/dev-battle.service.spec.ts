import { Test, TestingModule } from '@nestjs/testing';
import { DevBattleService } from './dev-battle.service';

describe('DevBattleService', () => {
  let service: DevBattleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevBattleService],
    }).compile();

    service = module.get<DevBattleService>(DevBattleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
