import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Project from './Project'
import User from './User'

export enum ProjectPermission {
  Owner = 'Owner',
  Collaborator = 'Collaborator',
}

@Entity()
export default class ProjectAuthority {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  projectId: number

  @Column()
  userId: number

  @Column({
    type: 'enum',
    enum: ProjectPermission,
  })
  permission: ProjectPermission

  @ManyToOne(type => Project, project => project.authorities)
  @JoinColumn({ name: 'projectId' })
  project: Project

  @ManyToOne(type => User, user => user.authorities)
  @JoinColumn({ name: 'userId' })
  user: User
}
