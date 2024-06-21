import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class ChattingService {

  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepo: Repository<ChatRoom>,
    @InjectRepository(UsersModel)
    private usersRepo: Repository<UsersModel>,
  ) { }

  async findAllChatRooms(): Promise<ChatRoom[]> {
    return this.chatRoomRepo.find({
      relations: ['users', 'messages', 'devBattle'],
    });
  }

  async findOneChatRoom(chatRoomId: string): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepo.findOne({
      where: { id: chatRoomId },
      relations: ['users', 'messages', 'devBattle'],
    });

    if (!chatRoom) {
      throw new NotFoundException(`Chat room with ID "${chatRoomId}" not found`);
    }

    return chatRoom;
  }

  create(createChattingDto: CreateChattingDto) {
    return 'This action adds a new chatting';
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
