import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Project from './Project'

@Entity()
export default class Todo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  parentId: number

  @Column()
  projectId: number

  @Column()
  order: number

  @ManyToOne(type => Todo, todo => todo.children)
  @JoinColumn({ name: 'parentId' })
  parent: Todo

  @ManyToOne(type => Project, p => p.todos)
  project: Project

  @OneToMany(type => Todo, todo => todo.parent)
  children: Todo[]
}
