// src/chat/entities/user-chat-room.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { UserChatMessage } from './user-chat-message.entity';

@Entity()
export class UserChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UsersModel, user => user.userChatRoom, { onDelete: 'CASCADE' })
    @JoinColumn()
    owner: UsersModel;

    @Column({ nullable: true, default: '' })
    title: string;

    @ManyToMany(() => UsersModel, user => user.userChatRooms)
    @JoinTable({
        name: 'user_chat_room_users',
        joinColumn: {
            name: 'user_chat_room_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users: UsersModel[];

    @OneToMany(() => UserChatMessage, message => message.userChatRoom)
    messages: UserChatMessage[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
