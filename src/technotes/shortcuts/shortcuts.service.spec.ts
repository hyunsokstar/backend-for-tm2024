import { Test, TestingModule } from '@nestjs/testing';
import { ShortcutsService } from './shortcuts.service';

describe('ShortcutsService', () => {
  let service: ShortcutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortcutsService],
    }).compile();

    service = module.get<ShortcutsService>(ShortcutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
