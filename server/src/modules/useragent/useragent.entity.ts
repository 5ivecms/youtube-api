import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('useragent')
export class UseragentEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public readonly id: number

  @Column({ type: 'varchar' })
  public readonly useragent: string

  @Index()
  @Column({ type: 'int', default: 0 })
  public readonly index: number
}
