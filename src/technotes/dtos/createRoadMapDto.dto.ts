// roadmap.dto.ts
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRoadMapDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    category: string;

    @IsNumber()
    writerId: number; // 작성자의 ID

}
