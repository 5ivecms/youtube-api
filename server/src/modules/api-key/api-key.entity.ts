import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DomainEntity } from '../domain/domain.entity'

@Entity('apiKey')
export class ApiKeyEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ type: 'varchar' })
  public readonly apiKey: string

  @Column({ type: 'text', default: '' })
  public readonly comment: string

  @OneToOne(() => DomainEntity)
  public domain: DomainEntity

  @CreateDateColumn({ type: 'timestamptz' })
  public readonly createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  public readonly updatedAt: Date
}
