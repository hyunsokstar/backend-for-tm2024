// SubChallengeBriefingsModel  
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SubChallengesModel } from './sub_challenge.entity';

export enum Position {
    Manager = "manager",
    Commenter = "commenter"
}

@Entity()
export class SubChallengeBriefingsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'enum', enum: Position })
    position: Position; // "manager" or "commenter"

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => SubChallengesModel, subChallenge => subChallenge.briefings, { onDelete: 'CASCADE', nullable: true })
    subChallenge: SubChallengesModel;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel

    @Column({ type: 'varchar', nullable: true })
    refImage: string;

}