// src\dev-relay\entities\dev-assignment.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { DevAssignmentSubmission } from './dev-assignment-submission.entity';
import { CategoryForDevAssignment } from './category-for-dev-assignment.entity';

export enum WeekDay {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}

@Entity()
export class DevAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', default: WeekDay.MONDAY })
    day: WeekDay;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @OneToMany(() => DevAssignmentSubmission, submission => submission.devAssignment)
    submissions: DevAssignmentSubmission[];

    @ManyToOne(() => CategoryForDevAssignment, category => category.devAssignments) // 반대 방향의 참조 설정
    category: CategoryForDevAssignment;
}
