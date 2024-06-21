// src/chat/entities/message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => ChatRoom, chatRoom => chatRoom.messages)
    chatRoom: ChatRoom;

    @CreateDateColumn()
    created_at: Date;
}
