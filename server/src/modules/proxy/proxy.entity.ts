import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { ProxyProtocol } from './proxy.types'

@Entity('proxy')
export class ProxyEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public readonly id: number

  @Column({ type: 'enum', enum: ProxyProtocol, default: ProxyProtocol.https })
  public readonly protocol: ProxyProtocol

  @Column({ type: 'varchar' })
  public readonly ip: string

  @Column({ type: 'int' })
  public readonly port: number

  @Column({ type: 'varchar' })
  public readonly login: string

  @Column({ type: 'varchar' })
  public readonly password: string

  @Column({ type: 'boolean', default: true })
  public readonly isActive?: boolean

  @Column({ type: 'int', default: 0 })
  public readonly index: number

  @Column({ type: 'varchar', default: '' })
  public readonly comment?: string
}
