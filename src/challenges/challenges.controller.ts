import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @Post()
  async createChallenge(
    @Req() req,
    @Res() response,
    @Body() createChallengeDto: CreateChallengeDto,
  ) {
    const loginUser = req.user;
    console.log('loginUser : ', loginUser);
    console.log("createChallenge check");


    if (!loginUser) {
      throw new HttpException(
        '로그인된 사용자만 챌린지를 등록할 수 있습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const createdChallenge = await this.challengesService.createChallenge(
        loginUser,
        createChallengeDto,
      );
      return response.status(HttpStatus.CREATED).json(createdChallenge);
    } catch (error) {
      throw new HttpException(
        '챌린지 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAllChallenges(@Query('pageNum') pageNum: number) {
    return this.challengesService.findAllChallenges(pageNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengesService.update(+id, updateChallengeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesService.remove(+id);
  }
}
