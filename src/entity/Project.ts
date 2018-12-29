import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import ProjectAuthority from './ProjectAuthority'
import Todo from './Todo'

@Entity()
export default class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @OneToMany(type => ProjectAuthority, pa => pa.project)
  authorities: ProjectAuthority[]

  @OneToMany(type => Todo, t => t.project)
  todos: Todo[]
}
