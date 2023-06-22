import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiKeyEntity } from '../api-key/api-key.entity'

@Entity('domain')
export class DomainEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Column({ type: 'varchar' })
  public readonly domain: string

  @Column({ nullable: true })
  public readonly apiKeyId: number

  @OneToOne(() => ApiKeyEntity, (apiKey) => apiKey.domain)
  @JoinColumn()
  public apiKey: ApiKeyEntity

  @CreateDateColumn({ type: 'timestamptz' })
  public readonly createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  public readonly updatedAt: Date
}
