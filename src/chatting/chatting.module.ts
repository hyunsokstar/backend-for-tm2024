import { Module } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { ChattingController } from './chatting.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { DevBattle } from 'src/dev-battle/entities/dev-battle.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { TeamForDevBattle } from 'src/dev-battle/entities/team-for-dev-battle.entity';
import { GlobalChatRoom } from './entities/global-chat-room.entity';
import { GlobalChatMessage } from './entities/global-chat-message.entity';
import { UserChatRoom } from './entities/user-chat-room.entity';
import { UserChatMessage } from './entities/user-chat-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      Message,
      UsersModel,
      DevBattle,
      TeamForDevBattle,
      Message,
      GlobalChatRoom,
      GlobalChatMessage,
      UserChatRoom,
      UserChatMessage
    ])
  ],
  controllers: [ChattingController],
  providers: [ChattingService],
})
export class ChattingModule {

  // ChatRoom

}
