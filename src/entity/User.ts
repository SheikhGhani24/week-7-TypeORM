import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

import { Project } from "./Project";
import { Task } from "./Task";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
  type: "varchar",
  length: 100,
  nullable: true,
})
name!: string | null;

  @Column({ length: 100, unique: true })
  email!: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @OneToMany(() => Project, (project) => project.owner)
  projects!: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  tasks!: Task[];
}