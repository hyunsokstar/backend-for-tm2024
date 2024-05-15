import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FavoriteDevSpec } from './favorite-dev-spec.entity';

@Entity()
export class ToolForFavoriteDevSpec {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tool: string;

    @Column({ nullable: true, default: '' })
    description: string;

    @Column({ nullable: true, default: '' })
    siteUrl: string;

    // One-to-Many relationship with FavoriteDevSpec entity
    @ManyToOne(() => FavoriteDevSpec, (favoriteDevSpec) => favoriteDevSpec.tools)
    favoriteDevSpec: FavoriteDevSpec;

    @Column({
        type: 'enum',
        enum: ['editor', 'collaboration', 'design_system', 'deployment_operation'],
        default: 'editor', // Set a default category for convenience
    })
    category: string;

}
