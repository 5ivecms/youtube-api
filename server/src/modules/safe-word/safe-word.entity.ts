import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('safe_word')
export class SafeWordEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Column({ type: 'varchar' })
  public readonly phrase: string
}
