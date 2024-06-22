import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chatting')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) { }

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
