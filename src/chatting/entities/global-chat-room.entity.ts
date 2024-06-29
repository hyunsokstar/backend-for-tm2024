// src/chat/entities/global-chat-room.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable, ManyToOne } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { GlobalChatMessage } from './global-chat-message.entity';

@Entity()
export class GlobalChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersModel, user => user.ownedGlobalChatRooms, { onDelete: 'CASCADE' })
    owner: UsersModel;

    @Column({ nullable: true, default: '' })
    title: string;  // title 컬럼 추가, default: "" 및 null 허용

    @ManyToMany(() => UsersModel, user => user.globalChatRooms)
    @JoinTable({
        name: 'global_chat_room_users',
        joinColumn: {
            name: 'global_chat_room_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users: UsersModel[];

    @OneToMany(() => GlobalChatMessage, message => message.globalChatRoom)
    messages: GlobalChatMessage[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
