import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['taskId']) 
export class InferenceOrchestratorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true, nullable: false }) // Make taskId unique
  taskId: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ type: 'text', nullable: false })
  language: string;

  @Column({ type: 'text', nullable: false })
  model: string;

  @Column({ type: 'text', nullable:false })
  status: string;

  @Column({ type: 'text', nullable: true })
  statusMessage: string;

  @Column({ type: 'text', nullable: true })
  username: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
