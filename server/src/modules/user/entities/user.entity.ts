import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ unique: true })
  public readonly email: string

  @Column({ type: 'varchar' })
  public readonly password: string

  @Column({ type: 'varchar', nullable: true })
  public readonly refreshToken: string
}
