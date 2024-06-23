import { Module } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { ChattingController } from './chatting.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { DevBattle } from 'src/dev-battle/entities/dev-battle.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { TeamForDevBattle } from 'src/dev-battle/entities/team-for-dev-battle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      Message,
      UsersModel,
      DevBattle,
      TeamForDevBattle,
      Message
    ])
  ],
  controllers: [ChattingController],
  providers: [ChattingService],
})
export class ChattingModule {

  // ChatRoom

}
