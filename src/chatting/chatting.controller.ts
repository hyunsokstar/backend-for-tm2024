import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, UnauthorizedException, Put, NotFoundException } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chatting')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) { }

  @Get('global-chat-rooms/:id')
  async getGlobalChatRoomById(@Param('id') id: string, @Req() req) {
    const { user } = req; // 요청 객체에서 로그인한 사용자 정보 추출

    try {
      const chatRoom = await this.chattingService.getGlobalChatRoomById(id, user);
      return chatRoom;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // 현재 유저를 특정 채팅방의 users에 추가
  @Put('global-chat-room/:roomId/register-current-user')
  async registerCurrentUserToChatRoom(@Param('roomId') roomId: string, @Req() req) {
    const { user } = req; // 요청 객체에서 로그인한 사용자 정보 추출
    try {
      await this.chattingService.registerUserToChatRoom(roomId, user.id);
      return { success: true, message: 'User registered to chat room successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // 모든 글로벌 챗룸 삭제
  @Delete('global-chat-room/all')
  async deleteAllGlobalChatRooms() {
    return this.chattingService.deleteAllGlobalChatRooms();
  }

  // 프로젝트 채팅방 추가
  @Post('global-chat-room')
  async createGlobalChatRoom(@Body('title') title: string, @Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('로그인 해주세요');
    }
    return this.chattingService.createGlobalChatRoom(title, req.user.id);
  }

  @Post('global-chat-room/:id/messages')
  async addMessageToGlobalChatRoom(@Param('id') id: string, @Body() createMessageDto: CreateMessageDto, @Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('로그인 해주세요');
    }

    const loginUser = req.user;
    return await this.chattingService.addMessageToGlobalChatRoom(id, createMessageDto, loginUser);
  }

  @Get('global-chat-rooms')
  async getAllGlobalChatRooms() {
    return await this.chattingService.getAllGlobalChatRooms();
  }

  // todo: Post, 'chatroom/:chatRoomId/message' 특정 채팅방에 대한 메세지 추가에 대해 컨트롤서 서비스 필요
  @Post('chatroom/:chatRoomId/message')
  async addMessage(
    @Param('chatRoomId') chatRoomId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Req() req
  ) {
    const loginUser = req.user;

    if (!req.user) {
      return {
        message: "로그인 하세요"
      }
    }

    return this.chattingService.addMessage(chatRoomId, createMessageDto, loginUser);
  }

  @Post()
  create(@Body() createChattingDto: CreateChattingDto) {
    return this.chattingService.create(createChattingDto);
  }

  @Get('chatRooms')
  findAll() {
    return this.chattingService.findAllChatRooms();
  }


  @Get(':id')
  findOneChatRoom(@Param('id') id: string) {
    return this.chattingService.findOneChatRoom(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChattingDto: UpdateChattingDto) {
    return this.chattingService.update(+id, updateChattingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chattingService.remove(+id);
  }
}
