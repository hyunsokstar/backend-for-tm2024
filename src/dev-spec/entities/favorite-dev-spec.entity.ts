import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class FavoriteDevSpec {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: "" })
    company: string;

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

    @Column()
    app: string;

    @Column({ default: 0 })
    likeCount: number;

    @Column({ default: 0 })
    dislikeCount: number;

    // 새로운 필드들 추가
    @Column({ nullable: true, default: "" })
    authGithub: string;

    @Column({ nullable: true, default: "" })
    authNote: string;

    @Column({ nullable: true, default: "" })
    boardGithub: string;

    @Column({ nullable: true, default: "" })
    boardNote: string;

    @Column({ nullable: true, default: "" })
    chatGithub: string;

    @Column({ nullable: true, default: "" })
    chatNote: string;

    @Column({ nullable: true, default: "" })
    paymentGithub: string;

    @Column({ nullable: true, default: "" })
    paymentNote: string;

    @Column({ nullable: true, default: "" })
    devOpsGithub: string;

    @Column({ nullable: true, default: "" })
    devOpsNote: string;

    @Column({ nullable: true, default: "" })
    figma: string;

}
