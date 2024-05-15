import { IsNotEmpty, IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';

export class CreateToolForFavoriteDevSpecDto {
    @IsNotEmpty({ message: 'Tool must not be empty' })
    @IsString({ message: 'Tool must be a string' })
    public tool: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    public description?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Site URL must be a valid URL' })
    public siteUrl?: string;

    @IsNotEmpty({ message: 'Category must not be empty' })
    @IsEnum(['editor', 'collaboration', 'design_system', 'deployment_operation'], {
        message: 'Category must be one of the following: editor, collaboration, design_system, deployment_operation',
    })
    public category: string;
}
