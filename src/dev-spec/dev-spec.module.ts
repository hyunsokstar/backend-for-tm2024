import { DislikeDevSpec } from './entities/dislike-dev-spec';
import { Module } from '@nestjs/common';
import { DevSpecService } from './dev-spec.service';
import { DevSpecController } from './dev-spec.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevSpec } from './entities/dev-spec.entity';
import { LikeDevSpec } from './entities/like-dev-spec';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevSpec,
      LikeDevSpec,
      DislikeDevSpec
    ])
  ],
  controllers: [DevSpecController],
  providers: [DevSpecService],
})
export class DevSpecModule { }
