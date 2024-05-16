import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DevRelay {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    devTitle: string;

    @Column({ nullable: true, default: '' })
    devNote: string;

    @Column({ nullable: true, default: '' })
    figmaUrl: string;

    @Column({ nullable: true, default: '' })
    githubUrl: string;

    @Column({
        type: 'enum',
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: 'Monday'
    })
    dayOfTheWeek: string;
}
