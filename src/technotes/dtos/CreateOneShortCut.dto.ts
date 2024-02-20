import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOneShortCutDto {
    @IsNotEmpty()
    readonly shortcut: string;

    @IsNotEmpty()
    readonly description: string;

    @IsOptional() // IsOptional을 사용하여 속성이 필수가 아니라는 것을 나타냅니다.
    readonly category?: string;
}
