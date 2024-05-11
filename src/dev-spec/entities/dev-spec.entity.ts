import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEnum } from 'class-validator';
import { LikeDevSpec } from './like-dev-spec';

export enum Category {
  LANGUAGE = 'language',
  BACKEND = 'backend',
  FRONTEND = 'frontend',
  ORM = 'orm',
  CSS = 'css',
  APP = 'app'
}

@Entity()
export class DevSpec {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  spec: string;

  @Column()
  @IsEnum(Category)
  category: Category;

  @OneToMany(() => LikeDevSpec, likeDevSpec => likeDevSpec.devSpec)
  likeDevSpecs: LikeDevSpec[];

  @OneToMany(() => LikeDevSpec, disLikeDevSpec => disLikeDevSpec.devSpec)
  disLikeDevSpecs: LikeDevSpec[];
}
