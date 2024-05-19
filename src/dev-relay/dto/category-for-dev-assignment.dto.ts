// src\dev-relay\dto\category-for-dev-assignment.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CategoryForDevAssignmentDto {
    @IsString()
    name: string;
}
