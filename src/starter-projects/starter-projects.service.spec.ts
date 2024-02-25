import { Test, TestingModule } from '@nestjs/testing';
import { StarterProjectsService } from './starter-projects.service';

describe('StarterProjectsService', () => {
  let service: StarterProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarterProjectsService],
    }).compile();

    service = module.get<StarterProjectsService>(StarterProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
