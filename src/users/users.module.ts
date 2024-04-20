import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModel } from "./entities/users.entity";
import { PaymentsModelForCashPoints } from "./entities/payment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      PaymentsModelForCashPoints
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
