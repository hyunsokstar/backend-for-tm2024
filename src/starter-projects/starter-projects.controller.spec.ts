import { Test, TestingModule } from '@nestjs/testing';
import { StarterProjectsController } from './starter-projects.controller';
import { StarterProjectsService } from './starter-projects.service';

describe('StarterProjectsController', () => {
  let controller: StarterProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarterProjectsController],
      providers: [StarterProjectsService],
    }).compile();

    controller = module.get<StarterProjectsController>(StarterProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
