import { Module } from '@nestjs/common';
import { StarterProjectsService } from './starter-projects.service';
import { StarterProjectsController } from './starter-projects.controller';

@Module({
  controllers: [StarterProjectsController],
  providers: [StarterProjectsService],
})
export class StarterProjectsModule {}
