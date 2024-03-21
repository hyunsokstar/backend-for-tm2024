import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { CreateSubChallengeDto } from './dto/create-sub-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @Post(':id/subChallenges')
  async createSubChallenge(
    @Param('id') challengeId: string,
    @Body() createSubChallengeDto: CreateSubChallengeDto,
    @Res() response,
  ) {
    try {
      const createdSubChallenge = await this.challengesService.createSubChallenge(challengeId, createSubChallengeDto);
      return response.status(HttpStatus.CREATED).json(createdSubChallenge);
    } catch (error) {
      if (error instanceof HttpException) {
        return response.status(error.getStatus()).send(error.message);
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('서버 오류가 발생했습니다.');
    }
  }

  @Get(':id/subChallenges')
  async findAllSubChallenges(
    @Param('id') challengeId: string,
    @Res() response,
  ) {
    try {
      const subChallenges = await this.challengesService.findAllSubChallenges(challengeId);
      return response.status(HttpStatus.OK).json(subChallenges);
    } catch (error) {
      if (error instanceof HttpException) {
        return response.status(error.getStatus()).send(error.message);
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('서버 오류가 발생했습니다.');
    }
  }

  @Put(':id')
  async updateChallenge(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Req() req,
    @Res() response,
  ) {
    const loginUser = req.user;
    console.log("id check for challenge update : ", id);

    if (!loginUser) {
      throw new HttpException(
        '로그인된 사용자만 챌린지를 업데이트할 수 있습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const updatedChallenge = await this.challengesService.updateChallenge(
        id,
        updateChallengeDto,
      );
      return response.status(HttpStatus.OK).json(updatedChallenge);

    } catch (error) {
      console.log("error : ", error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '챌린지 업데이트 중 오류가 발생했습니다.',
        error: error.message, // 에러 메시지 포함
      });

    }
  }


  @Delete(':id')
  async deleteChallenge(
    @Param('id') id: string,
    @Req() req,
    @Res() response,
  ) {

    try {
      const loginUser = req.user;
      console.log('loginUser : ', loginUser);
      console.log("createChallenge check");

      if (!loginUser) {
        throw new HttpException(
          '로그인된 사용자만 챌린지를 삭제할 수 있습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.challengesService.deleteChallenge(id);
      return response.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      // 예외가 발생하면 해당 예외를 처리하여 적절한 HTTP 응답을 반환합니다.
      if (error instanceof HttpException) {
        return response.status(error.getStatus()).send(error.message);
      }
      // 서버 오류 등의 예상치 못한 오류가 발생하면 500 Internal Server Error를 반환합니다.
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('서버 오류가 발생했습니다.');
    }
  }


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

}
