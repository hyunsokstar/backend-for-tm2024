// src\dev-relay\entities\category-for-dev-assignment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { DevAssignment } from './dev-assignment.entity';
import { SubjectForCategory } from './subject-for-category.entity';

@Entity()
export class CategoryForDevAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @OneToMany(() => DevAssignment, devAssignment => devAssignment.category) // 반대 방향의 참조 설정
    devAssignments: DevAssignment[];

    @ManyToOne(() => SubjectForCategory, subject => subject.categories) // 반대 방향의 참조 설정
    subject: SubjectForCategory;

}
