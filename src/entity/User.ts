import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import ProjectAuthority from './ProjectAuthority'

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
  })
  name: string

  // TODO: 이메일 형식 검사
  @Column({
    unique: true,
  })
  email: string

  @Column()
  hashedPassword: string

  @OneToMany(type => ProjectAuthority, pa => pa.user)
  authorities: ProjectAuthority[]
}
