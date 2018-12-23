import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export default class Todo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @ManyToOne(type => Todo, todo => todo.children)
  parent: Todo

  @OneToMany(type => Todo, todo => todo.parent)
  children: Todo[]
}
