import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class CreateCategoriesForDevAssignmentDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    name: string[];
}