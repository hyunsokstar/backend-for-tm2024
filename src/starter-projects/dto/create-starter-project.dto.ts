import { IsString, IsNotEmpty, IsOptional, IsUrl, IsNumber } from 'class-validator';

export class CreateStarterProjectDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsUrl()
    skilNoteUrl: string;

    @IsNotEmpty()
    @IsNumber()
    writerId: number;
}
