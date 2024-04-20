import { UsersModel } from 'src/users/entities/users.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { SubChallengesModel } from './sub_challenge.entity';

@Entity('challenges')
export class ChallengesModel {
    @PrimaryGeneratedColumn()
    id: number;

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

    @OneToMany(() => SubChallengesModel, subChallenge => subChallenge.challenge, {
        nullable: true,
    })
    subChallenges: SubChallengesModel[];


}
