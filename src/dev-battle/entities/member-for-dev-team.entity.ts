import { UsersModel } from 'src/users/entities/users.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { TeamForDevBattle } from './team-for-dev-battle.entity';

@Entity()
export class MemberForDevTeam {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    user: UsersModel;

    @Column({ type: 'enum', enum: ['leader', 'member'], default: 'member' })
    position: 'leader' | 'member';

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => TeamForDevBattle, team => team.members, { onDelete: 'CASCADE', cascade: true })
    @JoinColumn()
    team: TeamForDevBattle;

}