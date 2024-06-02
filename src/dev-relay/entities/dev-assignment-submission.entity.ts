import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DevAssignment } from './dev-assignment.entity';

@Entity()
export class DevAssignmentSubmission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    noteUrl: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    figmaUrl: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    youtubeUrl: string;
    @Column({ type: 'int', nullable: true })
    skilNoteId: number;

    @ManyToOne(() => DevAssignment, { onDelete: 'CASCADE' }) // onDelete 옵션을 사용하여 삭제 시 관련 submission도 함께 삭제될 수 있도록 설정합니다.
    @JoinColumn({ name: 'devAssignmentId' }) // devAssignmentId로 연결된 필드를 사용하도록 지정합니다.
    devAssignment: DevAssignment; // DevAssignment과의 관계를 설정합니다.
}
