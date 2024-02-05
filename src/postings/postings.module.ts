import { Module } from '@nestjs/common';
import { PostingsController } from './postings.controller';
import { PostingsService } from './postings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPostingsModel } from './entities/user_postings.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPostingsModel, UsersModel])
  ],
  controllers: [PostingsController],
  providers: [PostingsService, UsersService]
})
export class PostingsModule { }
