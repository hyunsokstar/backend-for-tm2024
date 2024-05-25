// src/dev-relay/dto/update-subject-for-category.dto.ts

import { IsString, MaxLength } from 'class-validator';

export class UpdateSubjectForCategoryDto {
    @IsString()
    @MaxLength(50)
    name: string;
}
