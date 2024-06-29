// src/chat/entities/user-chat-message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { UserChatRoom } from './user-chat-room.entity';

@Entity()
export class UserChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

    @Column()
    content: string;

    @ManyToOne(() => UserChatRoom, userChatRoom => userChatRoom.messages, { onDelete: 'CASCADE' })
    userChatRoom: UserChatRoom;

    @CreateDateColumn()
    created_at: Date;
}
