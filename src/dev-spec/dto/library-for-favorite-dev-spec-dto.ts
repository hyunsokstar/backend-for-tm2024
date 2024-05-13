// library-for-favorite-dev-spec-dto.ts

import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateLibraryForFavoriteDevSpecDto {
    @IsNotEmpty()
    @IsString()
    library: string;

    @IsOptional()
    @IsUrl()
    siteUrl?: string;
}
