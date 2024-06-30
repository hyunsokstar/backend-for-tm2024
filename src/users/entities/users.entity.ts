// src\users\entities\users.entity.ts
import { Max, Min } from "class-validator";
import { GendersEnum, RolesEnum } from "../enums/roles.enum";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserPostingsModel } from "../../postings/entities/user_postings.entity";
import { TodosModel } from "src/todos/entities/todos.entity";
import { BookMarksForSkilNoteContentsModel } from "src/technotes/entities/bookMarksForSkilNoteContent.entity";
import { SupplementaryTodosModel } from "src/todos/entities/supplementary_todos.entity";
import { ParticipantsForSkilNoteModel } from "src/technotes/entities/participantsForSkilNote.entity";
import { PaymentsModelForCashPoints } from "./payment.entity";
import { ChallengesModel } from "src/challenges/entities/challenge.entity";
import { SubChallengesModel } from "src/challenges/entities/sub_challenge.entity";
import { ChatRoom } from "src/chatting/entities/chat-room.entity";
import { GlobalChatRoom } from "src/chatting/entities/global-chat-room.entity";
import { UserChatRoom } from "src/chatting/entities/user-chat-room.entity";

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

    @Column({ default: 0 })
    cashPoints: number;

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

    // user current task 관련 필드

    @Column({ type: "boolean", default: false })
    isOnline: boolean;

    @Column({ nullable: true })
    currentTask: string | null;

    @Column({ type: 'int', default: 0 })
    currentTaskProgressPercent: number;

    @Column({
        type: "enum",
        enum: ["struggling", "offroad", "ninja", "cheetah", "rocket"],
        default: "ninja"
    })
    performanceLevel: string;

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

    @OneToMany(() => ChallengesModel, challenge => challenge.writer, { cascade: true })
    challenges: TodosModel[];

    @OneToMany(() => SubChallengesModel, subChallenge => subChallenge.writer, { cascade: true })
    subChallenges: SubChallengesModel[];

    @OneToMany(() => SupplementaryTodosModel, supplemnetaryTodo => supplemnetaryTodo.manager, { cascade: true })
    supplementaryTodosForManager: TodosModel[];

    @OneToMany(() => TodosModel, todo => todo.supervisor)
    todosForSuperVisor: TodosModel[];

    @OneToMany(() => BookMarksForSkilNoteContentsModel, bookmark => bookmark.user)
    myBookMarksForSkilNoteContents: BookMarksForSkilNoteContentsModel[]

    @OneToMany(() => ParticipantsForSkilNoteModel, particiPateForSkilNote => particiPateForSkilNote.user)
    takenCoursesForSkilNote: ParticipantsForSkilNoteModel

    @OneToMany(() => PaymentsModelForCashPoints, paymentsModelForCashPoints => paymentsModelForCashPoints.user)
    paymentsForCashPoints: PaymentsModelForCashPoints

    @ManyToMany(() => ChatRoom, chatRoom => chatRoom.users)
    chatRooms: ChatRoom[];

    @ManyToMany(() => GlobalChatRoom, globalChatRoom => globalChatRoom.users)
    globalChatRooms: GlobalChatRoom[];

    @OneToMany(() => GlobalChatRoom, globalChatRoom => globalChatRoom.owner)
    ownedGlobalChatRooms: GlobalChatRoom[];

    @ManyToMany(() => UserChatRoom, userChatRoom => userChatRoom.users)
    userChatRooms: UserChatRoom[];

    @OneToOne(() => UserChatRoom, userChatRoom => userChatRoom.owner)
    userChatRoom: UserChatRoom;

}
