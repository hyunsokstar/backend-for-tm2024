import { IsEnum, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateDevRelayDto {

    @IsString()
    readonly devTitle: string;

    @IsOptional() // nullable: true를 고려하여 필드를 선택적으로 만듭니다.
    @IsString()
    readonly devNote?: string; // 선택적 필드로 변경합니다.

    @IsOptional() // nullable: true를 고려하여 필드를 선택적으로 만듭니다.
    @IsUrl()
    readonly figmaUrl?: string; // 선택적 필드로 변경합니다.

    @IsOptional() // nullable: true를 고려하여 필드를 선택적으로 만듭니다.
    @IsUrl()
    readonly githubUrl?: string; // 선택적 필드로 변경합니다.

    @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    readonly dayOfTheWeek: string;
}
