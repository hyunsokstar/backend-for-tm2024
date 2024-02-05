import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareController } from './cloudflare.controller';

describe('CloudflareController', () => {
  let controller: CloudflareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudflareController],
    }).compile();

    controller = module.get<CloudflareController>(CloudflareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
