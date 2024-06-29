import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModel } from "./entities/users.entity";
import { PaymentsModelForCashPoints } from "./entities/payment.entity";
import { UserChatRoom } from "src/chatting/entities/user-chat-room.entity";
import { UserChatMessage } from "src/chatting/entities/user-chat-message.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      PaymentsModelForCashPoints,
      UserChatRoom,
      UserChatMessage
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule] // Export both the service and the TypeOrmModule
})
export class UsersModule { }