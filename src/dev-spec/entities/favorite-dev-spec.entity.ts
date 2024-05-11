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

    @Column({ default: 0 }) // 기본값을 0으로 설정하여 시작할 수 있습니다.
    likeCount: number;

    @Column({ default: 0 }) // 기본값을 0으로 설정하여 시작할 수 있습니다.
    dislikeCount: number;

}
