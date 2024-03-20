import { UsersModel } from 'src/users/entities/users.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';

@Entity('challenges')
export class ChallengesModel {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    challengeName: string;

    @Column()
    description: string;

    @Column({ type: 'int' })
    prize: number;

    @ManyToOne(() => UsersModel, (user) => user.challenges, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    writer: UsersModel;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
