import { DislikeDevSpec } from './entities/dislike-dev-spec';
import { Module } from '@nestjs/common';
import { DevSpecService } from './dev-spec.service';
import { DevSpecController } from './dev-spec.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevSpec } from './entities/dev-spec.entity';
import { LikeDevSpec } from './entities/like-dev-spec';
import { FavoriteDevSpec } from './entities/favorite-dev-spec.entity';
import { FavoriteDevSpecController } from './favorite-dev-spec.controller';
import { FavoriteDevSpecService } from './favorite-dev-spec.service';
import { LibraryForFavoriteDevSpec } from './entities/library-for-favorite-dev-spec';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevSpec,
      LikeDevSpec,
      DislikeDevSpec,
      FavoriteDevSpec,
      LibraryForFavoriteDevSpec
    ])
  ],
  controllers: [DevSpecController, FavoriteDevSpecController],
  providers: [DevSpecService, FavoriteDevSpecService],
})
export class DevSpecModule { }
