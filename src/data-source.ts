import "reflect-metadata";
import "dotenv/config";

import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Project } from "./entity/Project";
import { Task } from "./entity/Task";
import { Tag } from "./entity/Tag";

export const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User, Project, Task, Tag],

  migrations: ["src/migrations/*.ts"],

  synchronize: false,
});