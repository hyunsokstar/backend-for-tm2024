// src/chat/entities/message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

    @Column()
    content: string;

    @ManyToOne(() => ChatRoom, chatRoom => chatRoom.messages, { onDelete: 'CASCADE' })
    chatRoom: ChatRoom;

    @CreateDateColumn()
    created_at: Date;
}
