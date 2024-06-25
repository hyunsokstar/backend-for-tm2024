// src/chat/entities/global-chat-message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { GlobalChatRoom } from './global-chat-room.entity';

@Entity()
export class GlobalChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

    @Column()
    content: string;

    @ManyToOne(() => GlobalChatRoom, globalChatRoom => globalChatRoom.messages, { onDelete: 'CASCADE' })
    globalChatRoom: GlobalChatRoom;

    @CreateDateColumn()
    created_at: Date;
}


