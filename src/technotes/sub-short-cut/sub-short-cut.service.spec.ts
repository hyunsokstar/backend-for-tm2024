import { Test, TestingModule } from '@nestjs/testing';
import { SubShortCutService } from './sub-short-cut.service';

describe('SubShortCutService', () => {
  let service: SubShortCutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubShortCutService],
    }).compile();

    service = module.get<SubShortCutService>(SubShortCutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
