import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Post, Put, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { DtoForUserList } from './dtos/dtoForUserList.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dtos/UpdateUserDTO';
import { UpdateUserImageDto } from './dtos/UpdateUserImageDto';
import { FollowUserDto } from './dtos/FollowUser.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getAllUsers(
    @Query('pageNum') pageNum: number = 1,
  ): Promise<{ users: DtoForUserList[], totalCount: number, perPage: number }> {
    const { users, totalCount, perPage } = await this.usersService.getAllUsers(pageNum);

    return { users, totalCount, perPage };
  }

  @Post()
  async SignUp(@Body() user: CreateUserDto) {
    console.log("add user request check !");

    try {
      await this.usersService.checkDuplicateEmailAndNickname(user.email, user.nickname);
      return this.usersService.CreateUser(user);
    } catch (error) {
      console.log("error : ", error);
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @Delete()
  async deleteUsersForCheckedIds(@Body('checkedIds') checkedIds: number[]) {

    try {
      console.log("유저 삭제 요청 받음");

      const deletedCount = await this.usersService.deleteUsersForCheckedIds(checkedIds);

      return {
        message: `총 ${deletedCount}명의 유저가 삭제되었습니다.`,
      };

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Post("login")
  async login(@Body() requestBody, @Res() response) {
    const { email, password } = requestBody;

    // 이메일로 사용자 찾기
    const user = await this.usersService.getUserByEmailWithEmailRelations(email);
    // console.log("user : ", user);
    // 사용자가 존재하지 않으면 에러 처리
    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: '이메일이나 비밀번호가 잘못되었습니다.',
        // user: user
      });
    }

    // 비밀번호 일치 여부 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: '이메일이나 비밀번호가 잘못되었습니다.',
      });
    }

    // access token 과 refresh token 발급을 위한 서비스 함수 생성후 여기서 호출하고
    // 아래 response 할때 응답 하도록 하기
    const { accessToken, refreshToken } = await this.usersService.issueTokens(user);

    return response.status(HttpStatus.OK).json({
      success: true,
      message: '로그인 성공2',
      id: user.id,
      email: user.email,
      nickname: user.email,
      following: user.following,
      followers: user.followers,
      myBookMarksForSkilNoteContents: user.myBookMarksForSkilNoteContents,
      accessToken,
      refreshToken
    });
  }

  @Post("login-check-by-accessToken")
  async loginCheckByAccessToken(@Req() req, @Res() response) {
    // console.log("login check by accessToken");

    try {
      const authorizationHeader = req.headers['authorization'] as string;

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid authorization header',
        });
      }

      const accessToken = authorizationHeader.replace('Bearer ', '');
      const userOrError = await this.usersService.loginCheck(accessToken);

      // console.log("userOrError.user : ", userOrError.user);

      if (!userOrError.success) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          reason: userOrError.reason || 'Unknown reason',
        });
      }

      return response.status(HttpStatus.OK).json({
        success: true,
        user: userOrError.user,
      });

    } catch (error) {
      console.error('Login check error:', error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error,
      });
    }
  }

  @Post("login-check-by-refreshToken")
  async loginCheckByRefreshToken(@Req() req, @Res() response) {

    try {
      const authorizationHeader = req.headers['authorization'] as string;
      console.log("authorizationHeader refresh: ", authorizationHeader);


      if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid authorization header',
        });
      }

      const refreshToken = authorizationHeader.replace('Basic ', '');
      console.log("login check by refresh token :", refreshToken);

      const { user, accessToken } = await this.usersService.resignAccessTokenByRefreshToken(refreshToken);

      return response.status(HttpStatus.OK).json({
        success: true,
        user,
        accessToken,
      });

    } catch (error) {
      console.error('Login check error:', error);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error,
      });
    }
  }

  @Put('/')
  async updateUsersModelController(
    @Body() userList: UpdateUserDTO[],
    @Res() response
  ) {

    console.log("userList for update : ", userList);


    const updatedCount = await this.usersService.updateUsersModel(userList);
    if (updatedCount > 0) {
      return response.status(HttpStatus.OK).json({
        success: true,
        message: `${updatedCount} users updated.`,
      });
    } else {
      return response.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'No users updated.',
      });
    }
  }

  @Put('update-image')
  async updateUserProfileImage(@Body() updateUserImageDto: UpdateUserImageDto) {
    try {
      console.log("update 요청 확인 ");

      console.log("updateUserImageDto : ", updateUserImageDto);

      // 이메일로 사용자 찾기
      const user = await this.usersService.getUserByEmail(updateUserImageDto.email);

      // 사용자가 존재하지 않으면 에러 처리
      if (!user) {
        throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      // 사용자의 이미지를 업데이트하는 서비스 메서드 호출
      const updatedUser = await this.usersService.updateUserProfileImage(user, updateUserImageDto.image);

      return {
        success: true,
        message: '프로필 이미지가 업데이트되었습니다.',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('follow')
  async followUser(@Body('targetUserId') targetUserId: number, @Req() req): Promise<any> {
    // 로그인 여부 확인
    if (!req.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    try {
      // 현재 로그인된 사용자의 아이디를 가져옴
      const userId = req.user.id; // 이 부분은 실제 로그인 사용자의 아이디를 가져오는 방법에 따라 달라질 수 있습니다.

      // followUser 함수에 직접 targetUserId와 userId를 전달하여 호출
      await this.usersService.followUser({ userId, targetUserId });

      return {
        success: true,
        message: '팔로우 성공',
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: '팔로우 실패 : ' + error,
      };
    }
  }

  @Delete('unfollow')
  async unfollowUser(@Body('targetUserId') targetUserId: number, @Req() req): Promise<any> {
    // 로그인 여부 확인
    if (!req.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    try {
      const userId = req.user.id; // 현재 로그인된 사용자의 아이디

      await this.usersService.unfollowUser({ userId, targetUserId });
      return {
        success: true,
        message: '언팔로우 성공',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: '언팔로우 실패 : ' + error,
      };
    }
  }

  @Get('getUserEmailsByArray')
  async getUsersEmailArrays(@Res() res: any) {
    const userEmails = await this.usersService.getUserEmails()
    console.log("userEmails : ", userEmails);

    return res.status(HttpStatus.OK).json(userEmails);
  }

  @Put('/buyPoints')
  async updateUserCashPoints(
    @Body('cashPointsToBuy') cashPointsToBuy: number,
    @Body('merchantUid') merchantUid: number,
    @Req() req, @Res() response
  ) {
    console.log("cashPointsToBuy:", cashPointsToBuy);
    const loginUser = req.user

    try {
      // 로그인하지 않은 경우 에러 처리
      if (!loginUser) {
        throw new Error("로그인된 사용자만 캐시를 구입할 수 있습니다.");
      }

      // cashPoints를 업데이트하고 업데이트된 값을 가져옵니다.
      const cashPointsAfterUpdate = await this.usersService.updateUserCashPoints({ loginUser, cashPointsToBuy, merchantUid });

      // 적절한 응답을 보냅니다.
      return response.status(200).json({
        success: true,
        message: `${req.user.email} 님은 cashPoint ${cashPointsToBuy} 원을 구입 했습니다. 총 잔액: ${cashPointsAfterUpdate} `
      });
    } catch (error) {
      // 에러 메시지를 콘솔에 기록합니다.
      console.error("updateUserCashPoints 오류:", error.message);

      // 적절한 에러 응답을 보냅니다.
      return response.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  @Get('payment-history')
  async getUsersPaymentHistory(@Req() req, @Res() response) {
    const userId = req.user.id;

    if (!userId) {
      return response.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: '로그인이 필요합니다.' });
    }

    try {
      const paymentHistory = await this.usersService.getUsersPaymentHistory(userId);
      return response.status(HttpStatus.OK).json({ success: true, paymentHistory });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

}
