import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';

@Controller('chatting')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) { }

  @Post()
  create(@Body() createChattingDto: CreateChattingDto) {
    return this.chattingService.create(createChattingDto);
  }

  @Get()
  findAll() {
    return this.chattingService.findAllChatRooms();
  }

  // @Get(':id')
  // findOneChatRoom(@Param('id', ParseIntPipe) id: number) {
  //   return this.chattingService.findOneChatRoom(id);
  // }
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
