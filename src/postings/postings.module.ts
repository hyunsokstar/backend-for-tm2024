import { Module } from '@nestjs/common';
import { PostingsController } from './postings.controller';
import { PostingsService } from './postings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPostingsModel } from './entities/user_postings.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPostingsModel]),
    UsersModule, // Import the entire UsersModule
  ],
  controllers: [PostingsController],
  providers: [PostingsService]
})
export class PostingsModule { }