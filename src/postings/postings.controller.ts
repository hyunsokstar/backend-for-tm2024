// postings.controller.ts

import { Body, Controller, Get, Post, Delete, Param, Res, HttpStatus, Query, NotFoundException, Req } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { CreatePostingDto } from './dtos/create-posting.dto';
import { UserPostingsModel } from './entities/user_postings.entity';
import { ConfigService } from '@nestjs/config';

@Controller('postings')
export class PostingsController {

    constructor(
        private readonly postingsService: PostingsService,
        private readonly configService: ConfigService
    ) { }

    //1122
    @Get()
    async getAllPostings(
        @Query('pageNum') pageNum: number = 1,
    ): Promise<{ postings: UserPostingsModel[], totalCount: number, perPage: number }> {
        return this.postingsService.getAllPostings();
    }

    @Post()
    async createPosting(
        @Body() createPostingDto: CreatePostingDto,
        @Req() req
    ) {
        const user = req.user;

        if (!user) {
            // 유저 정보가 없을 때 처리 로직
            return { message: 'Unauthorized' };
        } else {
            console.log("유저 정보 ok posting go");
        }

        createPostingDto.userId = user.id;

        console.log("Controller - createPostingDto : ", createPostingDto);
        return this.postingsService.createPosting(createPostingDto);

    }

    @Delete(':id')
    async deletePosting(@Param('id') id: string, @Res() response): Promise<void> {
        const postingId = parseInt(id, 10);

        try {
            await this.postingsService.deletePosting(postingId);
            response.status(HttpStatus.OK).send({ message: '게시물이 성공적으로 삭제되었습니다.' });
        } catch (error) {
            response.status(500).send({ message: '게시물 삭제 중 오류가 발생했습니다.' });
        }
    }

    @Get('user/:userId')
    async getUserPostings(
        @Param('userId') userId: string,
        @Query('pageNum') pageNum = '1',
        @Query('perPage') perPage = '10',
        @Req() req, // 요청 객체 주입
    ) {
        // console.log("req.user : ", req.user);
        console.log("userId : ", userId);

        try {
            const userPostings = await this.postingsService.getUserPostings(
                parseInt(userId, 10),
                parseInt(pageNum, 10),
                parseInt(perPage, 10),
            );

            return {
                success: true,
                data: {
                    user: userPostings.user,
                    postings: userPostings.postings,
                    totalCount: userPostings.totalCount,
                    perPage: userPostings.perPage,
                },
                message: `Retrieved postings for user ${userId} (page ${pageNum})`,
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
                message: 'Failed to retrieve user postings : ' + error,
            };
        }
    }

    // const accessTokenSecret = this.configService.get<string>('CF_ID');
    // const accessTokenSecret = this.configService.get<string>('CF_TOKEN');
    @Post()
    async GetUploadURL() {
        const cfId = this.configService.get<string>('CF_ID');
        const accessTokenSecret = this.configService.get<string>('CF_TOKEN');
    }

}