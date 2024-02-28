import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, Req, Res } from "@nestjs/common";
import { TechnotesService } from "./technotes.service";
import { DtoForCreateTechNote } from "./dtos/dtoForCreateTechNote.dto";

@Controller('technotes')
export class TechnotesController {

    constructor(private readonly technotesService: TechnotesService) { }


    // techNoteId 와 userId 받아서
    // getAllCorriculmnsForUserCorricumnsForSkilNotes

    @Get('/corriculmnsForSkilnote')
    async getAllCorriculmnsForUserCorricumnsForSkilNotes(
        @Query('techNoteId') techNoteId,
        @Query('userId') userId,
        @Req() req
    ) {
        const response = await this.technotesService.getAllCorriculmnsForUserCorricumnsForSkilNotes(
            techNoteId, userId
        );

        return response
    }

    @Post() // POST 요청을 처리하는 엔드포인트 추가
    async createTechNoteForRoadMap(@Body() dto: DtoForCreateTechNote) {
        return this.technotesService.createTechNote(dto);
    }

    @Get()
    async getAllTechNoteList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 10,
        @Query('searchOption') searchOption = "",
        @Query('searchText') searchText = "",
        @Query('isBestByLikes') isBestByLikes = false,
        @Query('isBestByBookMarks') isBestByBookMarks = false,
        @Req() req
    ) {
        // console.log("req.user 2: ", req.user);
        return this.technotesService.getAllTechNotes(
            pageNum,
            perPage,
            searchOption,
            searchText,
            isBestByLikes,
            isBestByBookMarks
        );
    }

    // userId, techNoteId 받아서 techNote에 대한 좋아요 실행하는 controller 작성 하기
    // post, /likeTechNote
    // service 와 연동

    @Post('create/forRoadMap') // POST 요청을 처리하는 엔드포인트 추가
    async createTechNote(@Body() dto: DtoForCreateTechNote) {
        return this.technotesService.createTechNoteForRoadMap(dto);
    }

    @Post('saveTechNotes') // API 엔드포인트 추가
    async saveTechNotes(@Body() requestBody: any, @Req() req) {
        const { techNotesToSave, roadMapId } = requestBody; // 요청 본문에서 techNotesToSave와 roadMapId 추출

        // console.log("techNotesToSave at controller : ", techNotesToSave);
        console.log("RoadMapId at controller : ", roadMapId); // roadMapId 출력

        console.log("req.user at save tech note : ", req.user);

        return this.technotesService.saveTechNotes(techNotesToSave, req.user, roadMapId);
    }


    @Delete('deleteCheckedRows')
    async deleteUsersForCheckedIds(@Body('checkedIds') checkedIds: number[], @Req() req) {

        try {
            console.log("유저 삭제 요청 받음");
            const loginUser = req.user

            if (!req.user) {
                return {
                    message: "로그인 하세요"
                }
            }

            return await this.technotesService.deleteForCheckNoteIdsForCheckedIds(checkedIds, loginUser);

            // return {
            //     message: `총 ${deletedCount}명의 유저가 삭제되었습니다.`,
            // };

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('search')
    async searchTechNoteBySearchOptionAndSearchWorld(
        @Query('searchOption') searchOption: string,
        @Query('searchText') searchText: string,
        @Res() res) {
        console.log(`Search Option: ${searchOption}, Search Text: ${searchText}`);

        const searchResult =
            await this.technotesService.searchTechNoteBySearchOptionAndSearchWorld(searchOption, searchText);

        res.status(200).json({ success: true, searchResult });
    }

    // userId, techNoteId 받아서 techNote에 대한 좋아요 실행하는 controller 작성 하기
    // post, /likeTechNote
    // service 와 연동
    @Post('/likeTechNote')
    async toggleLikeForTechNote(
        @Req() req,
        @Body() dto: { userId: number, techNoteId: number }

    ) {
        const success = await this.technotesService.toggleLikeForTechNote(dto.userId, dto.techNoteId);
        if (success) {
            return { message: '좋아요 for technote 성공' };
        } else {
            return { message: '좋아요 for technote 취소' };
        }
    }

    @Post('/likeSkilNote')
    async toggleLikeForSkilNote(
        @Req() req,
        @Body() dto: { userId: number, skilNoteId: number }

    ) {
        const success = await this.technotesService.toggleLikeForSkilNote(dto.userId, dto.skilNoteId);
        if (success) {
            return { message: '좋아요 for skilnote 성공' };
        } else {
            return { message: '좋아요 for skilnote 취소' };
        }
    }

    @Post('/bookMarkTechNote')
    async toggleBookMarkForTechNote(
        @Req() req,
        @Body() dto: { userId: number, techNoteId: number }

    ) {
        const success = await this.technotesService.toggleBookMarkForTechNote(dto.userId, dto.techNoteId);
        if (success) {
            return { message: 'bookmark 성공' };
        } else {
            return { message: 'bookmark 취소' };
        }
    }

    @Post('/bookMarkSkilNote')
    async toggleBookMarkForSkilNote(
        @Req() req,
        @Body() dto: { userId: number, skilNoteId: number }
    ) {
        const success = await this.technotesService.toggleBookMarkForSkilNote(dto.userId, dto.skilNoteId);
        if (success) {
            return { message: 'bookmark 성공' };
        } else {
            return { message: 'bookmark 취소' };
        }
    }

    @Post('participants')
    async addParticipantsForTechNote(@Body() data: any) {
        const { skilNoteId, userId } = data; // 요청 바디에서 roadMapId와 userId를 추출합니다.
        // ParticipantsForRoadMapModel에 등록하는 로직을 작성합니다.

        console.log("skilNoteId : ", skilNoteId);


        return await this.technotesService.addParticipantsForTechNote(skilNoteId, userId);
    }

}