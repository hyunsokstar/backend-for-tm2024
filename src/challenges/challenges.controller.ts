import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, HttpException, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { CreateSubChallengeDto } from './dto/create-sub-challenge.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  // 다른 컨트롤러 메서드들 위에 추가할 것
  @Put('sub-challenges/:subChallengeId/participants/:participantId/is-passed')
  @UseGuards(new AuthGuard()) // 인증이 필요한 경우 사용
  async updateIsPassedForParticipantForSubChallenge(
    @Param('subChallengeId') subChallengeId: number,
    @Param('participantId') participantId: number,
    @Body('isPassed') isPassed: boolean,
  ) {
    return this.challengesService.updateIsPassedForParticipantForSubChallenge(subChallengeId, participantId, isPassed);
  }

  // subChallenge 에 대한 사용자 추가
  // subChallenge 에 대한 사용자 추가
  @Post('sub-challenges/:subChallengeId/participants')
  async addParticipantForSubChallenge(
    @Param('subChallengeId') subChallengeId: number,
    @Body() addParticipantDto: AddParticipantDto,
    @Req() req,
    @Res() res,
  ) {
    const loginUser = req.user;

    // subChallenge를 가져옵니다.
    const subChallenge = await this.challengesService.findSubchallengeById(subChallengeId);

    if (!subChallenge) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: '해당하는 서브 챌린지를 찾을 수 없습니다.' });
    }

    // 참가 또는 탈퇴 메시지를 생성합니다.
    let message: string;

    // 참가자를 추가하거나 삭제합니다.
    const participant = await this.challengesService.addParticipantForSubChallenge(loginUser, subChallengeId, addParticipantDto);

    if (participant) {
      message = `${loginUser.email} 님이 ${subChallenge.challengeName}에 참가했습니다.`;
    } else {
      message = `${loginUser.email} 님이 ${subChallenge.challengeName}에서 탈퇴했습니다.`;
    }

    // 적절한 응답을 반환합니다.
    if (participant) {
      res.status(HttpStatus.CREATED).json({ message });
    } else {
      res.status(HttpStatus.OK).json({ message });
    }
  }

  @Get('sub-challenges/:subChallengeId/participants')
  async allParticipantsListForSubchallenges(
    @Param('subChallengeId') subChallengeId: number,
    @Res() response,
  ) {

    console.log("subChallengeId ??? ", subChallengeId);


    try {

      const participantsForSubChallenge = await this.challengesService.findAllParticipantsForSubChallenges(subChallengeId);

      return response.status(HttpStatus.ACCEPTED).json({
        success: true,
        participantsForSubChallenge: participantsForSubChallenge, // 에러 메시지 포함
      });

    } catch (error) {
      if (error instanceof HttpException) {
        return response.status(error.getStatus()).send(error.message);
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('서버 오류가 발생했습니다.');
    }

  }

  @Post(':id/subChallenges')
  async createSubChallenge(
    @Param('id') challengeId: number,
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
    @Param('id') challengeId: number,
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
    @Param('id') id: number,
    @Body('isMainOrSub') isMainOrSub: string,
    @Body('updateChallengeDto') updateChallengeDto: UpdateChallengeDto,
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
      if (isMainOrSub === "main") {
        const updatedChallenge = await this.challengesService.updateMainChallenge(
          id,
          updateChallengeDto,
        );
        return response.status(HttpStatus.OK).json(updatedChallenge);
      } else {
        const updatedChallenge = await this.challengesService.updateSubChallenge(
          id,
          updateChallengeDto,
        );
        return response.status(HttpStatus.OK).json(updatedChallenge);
      }


    } catch (error) {
      console.log("error : ", error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: '챌린지 업데이트 중 오류가 발생했습니다.',
        error: error.message, // 에러 메시지 포함
      });

    }
  }


  @Delete(':isMainOrSub/:id')
  async deleteChallenge(
    @Param('id') id: number,
    @Param('isMainOrSub') isMainOrSub: string,
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

      if (isMainOrSub === "main") {
        await this.challengesService.deleteMainChallenge(id);

      } else {
        await this.challengesService.deleteSubChallenge(id);

      }

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
