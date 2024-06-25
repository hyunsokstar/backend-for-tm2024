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

  async getGlobalChatRoomById(id: string, currentUser: any) {
    // 채팅방 정보 가져오기 (사용자 정보 포함)
    const chatRoom = await this.globalChatRoomRepo.findOne({
      where: { id: id },
      relations: ['owner', 'users', 'messages', 'messages.writer'],
    });

    if (!chatRoom) {
      throw new NotFoundException(`Chat room with ID ${id} not found`);
    }

    // 현재 로그인한 사용자가 채팅방에 없으면 추가
    const isUserExist = chatRoom.users.some(u => u.id === currentUser.id);
    if (!isUserExist) {
      chatRoom.users.push(currentUser);
      await this.globalChatRoomRepo.save(chatRoom); // 채팅방 업데이트
    }

    return chatRoom;
  }

  async registerUserToChatRoom(roomId: string, userId: number): Promise<void> {
    // 채팅방과 사용자 정보 가져오기 (관계 엔티티를 포함하여)
    const chatRoom = await this.globalChatRoomRepo.findOne({
      where: { id: roomId },
      relations: { users: true }
    });
    if (!chatRoom) {
      throw new NotFoundException(`Chat room with ID ${roomId} not found`);
    }

    const user = await this.usersRepo.findOne({
      where: { id: userId }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 이미 채팅방에 해당 유저가 있는지 확인 후 추가
    const isUserExist = chatRoom.users.some(u => u.id === userId);
    if (!isUserExist) {
      chatRoom.users.push(user);
      await this.globalChatRoomRepo.save(chatRoom); // 채팅방 업데이트
    }
  }

  // 모든 글로벌 챗룸과 관련 메시지 삭제
  async deleteAllGlobalChatRooms() {
    // 모든 글로벌 챗룸 조회
    const chatRooms = await this.globalChatRoomRepo.find({ relations: ['messages'] });

    // 각 챗룸에 속한 메시지들을 삭제하고 챗룸 삭제
    for (const chatRoom of chatRooms) {
      await this.globalChatMessageRepo.remove(chatRoom.messages); // 챗룸에 속한 메시지 삭제
      await this.globalChatRoomRepo.remove(chatRoom); // 챗룸 삭제
    }

    return { deletedCount: chatRooms.length };
  }

  async createGlobalChatRoom(title: string, ownerId: number): Promise<GlobalChatRoom> {
    const owner = await this.usersRepo.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }

    const globalChatRoom = this.globalChatRoomRepo.create({ title, owner });
    globalChatRoom.users = [owner]; // 현재 로그인한 사용자 추가

    return await this.globalChatRoomRepo.save(globalChatRoom);
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
