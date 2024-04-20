import { Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SkilnotesService } from './skilnotes.service';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';
import { dtoForCreateSkilNoteContent } from '../dtos/dtoForCreateSkilNoteContents';
import { AuthGuard } from 'src/guards/auth.guard';
import { dtoForReorderContents } from '../dtos/dtoForReorderContents';
import { DeleteSkilNoteContentsDto } from 'src/users/dtos/DeleteSkilNoteContentsDto';
import { DtoForChangePagesOrderForSkilNoteContent } from '../dtos/dtoForChangePagesOrderForSkilNote';

@Controller('skilnotes')
export class SkilnotesController {
    constructor(private readonly skilnoteService: SkilnotesService) { }

    @Post('create-next-page-for-skilnotecontent/:skilNoteId')
    async createNextPageForSkilnoteContent(
        @Param('skilNoteId') skilNoteId: number,
        @Req() req
    ) {
        try {
            const loginUser = req.user;
            const createdSkilNoteContent = await this.skilnoteService.createNextPageForSkilnoteContent({ loginUser, skilNoteId });
            return { success: true, data: createdSkilNoteContent };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @UseGuards(AuthGuard)
    @Get("my-notes")
    async getAllMySkilNoteList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 100,
        @Req() req
    ) {
        console.log("getAllMySkilNoteList : ", pageNum);
        const loginUser = req.user;
        console.log("loginUser for create skil note : ", loginUser);

        const result = await this.skilnoteService.getAllMySkilNoteList(
            pageNum,
            perPage,
            loginUser
        );

        const response = {
            perPage: perPage,
            totalCount: result.length,
            allMySkilNoteList: result
        };

        return response;
    }

    // fix 02027
    @Get()
    async getAllSkilNoteList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 10,
        @Query('searchOption') searchOption = "",
        @Query('searchText') searchText = "",
        @Query('isBestByLikes') isBestByLikes = false,
        @Query('isBestByBookMarks') isBestByBookMarks = false,
        @Req() req
    ) {

        console.log("pageNum at controller : ", pageNum);

        return this.skilnoteService.getAllSkilNoteList(
            pageNum, perPage, searchOption, searchText,
            isBestByLikes,
            isBestByBookMarks
        );
    }

    @Post() // POST 요청을 처리하는 엔드포인트 추가
    async createTechNote(@Body() dto: dtoForCreateSkilNote) {
        console.log("createTechNote : ", dto);

        return this.skilnoteService.createSkilnote(dto);
    }

    @Get('byTechNoteId/:techNoteId') // 기존에 사용하던 Get 엔드포인트에 파라미터를 추가합니다.
    async getSkilnotesForTechNote(
        @Param('techNoteId') techNoteId: number,
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 30,
        @Query('searchOption') searchOption = "",
        @Query('searchText') searchText = "",
        @Query('isBestByLikes') isBestByLikes = false,
        @Query('isBestByBookMarks') isBestByBookMarks = false,
    ) {

        // console.log("skil note list for tech id check !", isBestByLikes, isBestByBookMarks);

        return this.skilnoteService.getSkilnotesForTechNote(
            techNoteId,
            pageNum,
            perPage,
            searchOption,
            searchText,
            isBestByLikes,
            isBestByBookMarks
        );

    }

    @Get(':skilnoteId/contents/:pageNum')
    async getSkilNoteContents(
        @Param('skilnoteId') skilnoteId: string,
        @Param('pageNum') pageNum: string,
        @Req() req
    ) {

        const loginUser = req.user

        return this.skilnoteService.getSkilNoteContentsBySkilNoteId(
            skilnoteId,
            pageNum,
            loginUser
        );
    }

    @Post('saveRows')
    async saveSkilNoteRows(@Body() dataForNoteRows: dtoForCreateSkilNoteContent[], @Req() req) {
        console.log("dataForNoteRows : ", dataForNoteRows)
        const loginUser = req.user
        return this.skilnoteService.saveSkilNoteRows(dataForNoteRows, loginUser);
    }

    // http://127.0.0.1:8080/skilnotes/:skilnoteId/contents/:pageNum
    @UseGuards(AuthGuard)
    @Post(':skilNoteId/contents/:pageNum')
    async createSkilNoteContents(
        @Req() req,
        @Body() dto: dtoForCreateSkilNoteContent,
        @Param('skilNoteId') skilNoteId: string,
        @Param('pageNum') pageNum: string,
        @Res() response
    ) {
        const loginUser = req.user;
        console.log("pageNum : ", pageNum);

        console.log("loginUser at create skilnote contents: ", loginUser);
        // if (loginUser === undefined) {
        //     return response.status(HttpStatus.UNAUTHORIZED).json({
        //         status: "error",
        //         message: '로그인 사용자만 skilnote content 를 입력 가능',
        //     });
        // }

        // console.log("skilNoteId : ", skilNoteId);
        // console.log("skilnote content 입력 check !");

        const result = await this.skilnoteService.createSkilNoteContents(skilNoteId, pageNum, loginUser, dto);
        return response.status(HttpStatus.CREATED).json({ message: "create skilnote contents success", result: result });

    }

    @Put('contents/reorder')
    async reorderingSkilNoteContents(@Body() contents: dtoForReorderContents[]) {
        console.log("reorder 요청 check ", contents);
        const updatedContents = await this.skilnoteService.reorderContents(contents);
        return updatedContents;
    }

    // http://127.0.0.1:8080/skilnotes/content/:skilNoteContetId
    @UseGuards(AuthGuard)
    @Put('content/:skilNoteContentId')
    async updateSkilNoteContent(
        @Req() req,
        @Param('skilNoteContentId') skilNoteContentId: string,
        @Body() dto: dtoForCreateSkilNoteContent,
        @Res() response
    ) {
        const loginUser = req.user;

        if (!loginUser) {

        }

        console.log("loginUser at create skilnote contents: ", loginUser);
        console.log("skilNoteContentId : ", skilNoteContentId);
        console.log("skilnote content 입력 check !");

        const result = await this.skilnoteService.updateSkilNoteContent(skilNoteContentId, dto, loginUser);
        return response.status(HttpStatus.CREATED).json({ message: "update skilnote content success", result: result });
    }

    @UseGuards(AuthGuard)
    @Delete('content/deleteByCheckedIds')
    async deleteSkilNoteContentsByCheckedIds(
        @Req() req,
        @Body() checkedIds: DeleteSkilNoteContentsDto,
        @Res() response
    ) {
        const loginUser = req.user;

        if (!loginUser) {
        }

        // console.log("checkdIds : ", checkedIds);
        // console.log("skilnote content 입력 check !");

        // const result = await this.skilnoteService.deleteSkilNoteContentForCheckedIds(checkedIds, loginUser);
        // // return response.status(HttpStatus.CREATED).json({ message: "update skilnote content success", result: result });
        try {
            const result = await this.skilnoteService.deleteSkilNoteContentForCheckedIds(checkedIds, loginUser);
            return response.status(200).json({ message: 'Skilnote content deleted successfully', result }); // 성공적으로 삭제됨 응답
        } catch (error) {
            return response.status(500).json({ message: 'Error deleting skilnote content', error: error.message }); // 삭제 중 에러 발생 응답
        }
    }
    // 스킬 노트 삭제 하기 
    // deleteCheckedRows
    @Delete('deleteCheckedRows')
    async deleteSkilNotesForCheckedIds(@Body('checkedIds') checkedIds: number[], @Req() req) {
        try {

            const loginUser = req.user

            console.log("스킬 노트 삭제 요청 받음 at deleteSkilNoteForCheckedIds");
            // const deletedCount = await this.skilnoteService.deleteForCheckNoteIdsForCheckedIds(checkedIds, loginUser);
            return this.skilnoteService.deleteForCheckNoteIdsForCheckedIds(checkedIds, loginUser);
            // return {
            //     message: `총 ${deletedCount}명의 유저가 삭제되었습니다.`,
            // };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Post('/bookMarkSkilNoteContent')
    async toggleBookMarkForSkilNoteContent(
        @Req() req,
        @Body() dto: { userId: number, skilNoteContentId: number }

    ) {
        console.log("here?");


        const success =
            await this.skilnoteService.toggleBookMarkForSkilNoteContent(
                dto.userId, dto.skilNoteContentId
            );

        if (success) {
            return { message: 'bookmark 성공' };
        } else {
            return { message: 'bookmark 취소' };
        }
    }

    @Put('skilNoteListReorder')
    async reorderingSkilNoteList(@Body() contents: dtoForReorderContents[]) {
        // console.log("reorder 요청 check ", contents);
        const updatedContents = await this.skilnoteService.reorderSkilNoteListOrder(contents);
        return updatedContents;
    }

    @Post('changePagesOrderForSkilNoteContent')
    async changePagesOrderForSkilNoteContent(@Body() dto: DtoForChangePagesOrderForSkilNoteContent) {
        try {
            const { skilNoteId, targetOrder, destinationOrder } = dto;

            // 여기서 targetOrder와 destinationOrder를 사용하여 작업을 수행합니다.
            // 예를 들어, 순서 변경 작업을 수행하고 결과를 반환할 수 있습니다.
            const result = await this.skilnoteService.changePagesOrderForSkilNoteContent({ skilNoteId, targetOrder, destinationOrder });

            // 작업에 성공했을 경우 결과를 클라이언트에 반환합니다.
            return { success: true, message: '페이지 순서 변경 성공', data: result };
        } catch (error) {
            // 작업에 실패했을 경우 에러를 클라이언트에 반환합니다.
            return { success: false, message: '페이지 순서 변경 실패', error: error.message };
        }
    }


    @Post('participants')
    async addParticipantsForSkilnote(@Body() data: any) {
        const { skilNoteId, userId, techNoteId } = data; // 요청 바디에서 roadMapId와 userId를 추출합니다.
        // ParticipantsForRoadMapModel에 등록하는 로직을 작성합니다.
        // console.log("skilNoteId : ", skilNoteId);

        return await this.skilnoteService.addParticipantsForSkilnote(skilNoteId, userId, techNoteId);
    }

}
