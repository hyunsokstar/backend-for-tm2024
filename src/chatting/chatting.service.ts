import { GlobalChatRoom } from 'src/chatting/entities/global-chat-room.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { GlobalChatMessage } from './entities/global-chat-message.entity';

@Injectable()
export class ChattingService {

  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepo: Repository<ChatRoom>,
    @InjectRepository(UsersModel)
    private usersRepo: Repository<UsersModel>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,

    @InjectRepository(GlobalChatRoom)
    private globalChatRoomRepo: Repository<GlobalChatRoom>,

    @InjectRepository(GlobalChatMessage)
    private globalChatMessageRepo: Repository<GlobalChatMessage>,

  ) { }

  async getGlobalChatRoomById(id: string) {
    const chatRoom = await this.globalChatRoomRepo.findOne({
      where: { id: id },
      relations: ['owner', 'messages', 'messages.writer'],
    });
    if (!chatRoom) {
      throw new NotFoundException(`Chat room with ID ${id} not found`);
    }
    return chatRoom;
  }

  async addMessageToGlobalChatRoom(chatRoomId: string, createMessageDto: CreateMessageDto, loginUser: UsersModel) {
    const globalChatRoom = await this.globalChatRoomRepo.findOne({
      where: { id: chatRoomId },
    });
    if (!globalChatRoom) {
      throw new NotFoundException(`Chat room with ID ${chatRoomId} not found`);
    }

    const message = this.globalChatMessageRepo.create({
      ...createMessageDto,
      globalChatRoom, // chatRoom 대신 globalChatRoom 사용
      writer: loginUser,
    });
    return await this.globalChatMessageRepo.save(message);
  }

  async getAllGlobalChatRooms() {
    return await this.globalChatRoomRepo.find({ relations: ['owner'] });
  }

  async createGlobalChatRoom(title: string, ownerId: number): Promise<GlobalChatRoom> {
    const owner = await this.usersRepo.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }
    const globalChatRoom = this.globalChatRoomRepo.create({ title, owner });
    return await this.globalChatRoomRepo.save(globalChatRoom);
  }

  async addMessage(chatRoomId: string, createMessageDto: CreateMessageDto, loginUser: UsersModel) {
    const chatRoom = await this.chatRoomRepo.findOne({ where: { id: chatRoomId } });
    if (!chatRoom) {
      throw new NotFoundException(`Chat room with ID "${chatRoomId}" not found`);
    }

    const newMessage = this.messageRepo.create({
      content: createMessageDto.content,
      writer: loginUser,
      chatRoom: chatRoom,
    });

    await this.messageRepo.save(newMessage);
    return newMessage;
  }

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
