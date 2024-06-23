import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { DevBattle } from './dev-battle.entity';
import { DevProgressForTeam } from './dev-progress-for-team.entity';
import { MemberForDevTeam } from './member-for-dev-team.entity';
import { DevSpecForTeamBattle } from './dev-spec-for-team-battle.entity';
import { ChatRoom } from 'src/chatting/entities/chat-room.entity';

@Entity()
export class TeamForDevBattle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'int', nullable: true })
    techNoteId: number;

    @Column({ type: 'text', nullable: true })
    techNoteListUrl: string;

    @ManyToOne(() => DevBattle, (devBattle) => devBattle.teams, { onDelete: "CASCADE" })
    devBattle: DevBattle;

    @OneToMany(() => DevProgressForTeam, (devProgressForTeam) => devProgressForTeam.team)
    devProgressForTeams: DevProgressForTeam[];

    @OneToMany(() => MemberForDevTeam, member => member.team)
    members: MemberForDevTeam[];

    @OneToMany(() => DevSpecForTeamBattle, (devSpec) => devSpec.devTeam)
    devSpecs: DevSpecForTeamBattle[];

    @OneToMany(() => ChatRoom, chatRoom => chatRoom.devTeam)
    chatRooms: ChatRoom[];

}
