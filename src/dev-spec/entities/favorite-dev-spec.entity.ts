import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FavoriteDevSpec {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    language: string;

    @Column()
    backend: string;

    @Column()
    frontend: string;

    @Column()
    orm: string;

    @Column()
    css: string;
}
