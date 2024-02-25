import { Module } from '@nestjs/common';
import { StarterProjectsService } from './starter-projects.service';
import { StarterProjectsController } from './starter-projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarterKitsModel } from './entities/starter-project.entity';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StarterKitsModel,
      UsersModel
    ])
  ],
  controllers: [StarterProjectsController],
  providers: [StarterProjectsService],
})
export class StarterProjectsModule { }
