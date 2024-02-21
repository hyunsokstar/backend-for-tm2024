import { Test, TestingModule } from '@nestjs/testing';
import { SubShortCutController } from './sub-short-cut.controller';

describe('SubShortCutController', () => {
  let controller: SubShortCutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubShortCutController],
    }).compile();

    controller = module.get<SubShortCutController>(SubShortCutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
