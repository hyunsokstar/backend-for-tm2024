// src/chat/entities/chat-room.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, ManyToOne, JoinTable } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { Message } from './message.entity';
import { DevBattle } from 'src/dev-battle/entities/dev-battle.entity';

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, default: '' })
    title: string;  // title 컬럼 추가, default: "" 및 null 허용

    @ManyToMany(() => UsersModel, user => user.chatRooms)
    @JoinTable({
        name: 'chat_room_users',
        joinColumn: {
            name: 'chat_room_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users: UsersModel[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Message, message => message.chatRoom)
    messages: Message[];

    @ManyToOne(() => DevBattle, devBattle => devBattle.chatRooms, { onDelete: 'CASCADE' })
    devBattle: DevBattle;

}
