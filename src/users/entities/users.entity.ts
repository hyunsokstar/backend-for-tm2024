// src\users\entities\users.entity.ts
import { Max, Min } from "class-validator";
import { GendersEnum, RolesEnum } from "../enums/roles.enum";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserPostingsModel } from "../../postings/entities/user_postings.entity";
import { TodosModel } from "src/todos/entities/todos.entity";
import { BookMarksForSkilNoteContentsModel } from "src/technotes/entities/bookMarksForSkilNoteContent.entity";
import { SupplementaryTodosModel } from "src/todos/entities/supplementary_todos.entity";

@Entity()
@Unique(["email", "nickname"])
export class UsersModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: "noname" })
    @Column()
    nickname: string;

    @Column({
        type: "enum",
        enum: RolesEnum,
        default: RolesEnum.FRONTEND,
    })
    role: RolesEnum;

    @Column({
        type: "enum",
        enum: GendersEnum,
        default: GendersEnum.MAN
    })
    gender: GendersEnum;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ type: "int", nullable: true, default: 1 })
    @Min(1)
    @Max(10)
    backEndLevel: number | null;

    @Column({ type: "int", nullable: true, default: 1 })
    @Min(1)
    @Max(10)
    frontEndLevel: number | null;

    @Column({ nullable: true })
    profileImage: string; // 이미지 경로를 저장할 칼럼

    @ManyToMany(() => UsersModel, user => user.followers)
    @JoinTable({
        name: 'followers_following', // 중간 테이블의 이름 설정 (원하는 이름으로 변경 가능)
        joinColumn: {
            name: 'follower_id', // 팔로워의 ID가 들어갈 컬럼
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'following_id', // 팔로잉의 ID가 들어갈 컬럼
            referencedColumnName: 'id',
        },
    })
    followers: UsersModel[];

    @ManyToMany(() => UsersModel, user => user.following)
    @JoinTable({
        name: 'followers_following', // 이미 정의된 중간 테이블과 동일한 이름 사용
        joinColumn: {
            name: 'following_id', // 팔로잉의 ID가 들어갈 컬럼
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'follower_id', // 팔로워의 ID가 들어갈 컬럼
            referencedColumnName: 'id',
        },
    })
    following: UsersModel[];

    @OneToMany(() => UserPostingsModel, posting => posting.user)
    postings: UserPostingsModel[];

    @OneToMany(() => TodosModel, todo => todo.manager, { cascade: true })
    todosForManager: TodosModel[];

    @OneToMany(() => SupplementaryTodosModel, supplemnetaryTodo => supplemnetaryTodo.manager, { cascade: true })
    supplementaryTodosForManager: TodosModel[];

    @OneToMany(() => TodosModel, todo => todo.supervisor)
    todosForSuperVisor: TodosModel[];

    @OneToMany(() => BookMarksForSkilNoteContentsModel, bookmark => bookmark.user)
    myBookMarksForSkilNoteContents: BookMarksForSkilNoteContentsModel[]

}
