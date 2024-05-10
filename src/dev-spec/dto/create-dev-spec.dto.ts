import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../entities/dev-spec.entity';

export class CreateDevSpecDto {
    @IsNotEmpty()
    @IsString()
    spec: string;

    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;
}
