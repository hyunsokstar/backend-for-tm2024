import { IsArray } from "class-validator";

export class DeleteSkilNoteContentsDto {
    @IsArray()
    checkedIds: number[];
}