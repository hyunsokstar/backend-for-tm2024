import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateLibraryForFavoriteDevSpecDto {
    @IsNotEmpty({ message: 'Library must not be empty' })
    @IsString({ message: 'Library must be a string' })
    public library: string;

    @IsOptional()
    @IsUrl({}, { message: 'Site URL must be a valid URL' })
    public siteUrl?: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    public description?: string;
}
