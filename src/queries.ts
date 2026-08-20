import { IsNull, Not, LessThan } from "typeorm";
import { AppDataSource } from "./data-source";
import { Task, TaskStatus } from "./entity/Task";
import { User } from "./entity/User";
import { Tag } from "./entity/Tag";

export async function getTasksByProject(
  projectId: number
): Promise<Task[]> {
  const taskRepository = AppDataSource.getRepository(Task);

  return taskRepository.find({
    where: {
      project: {
        id: projectId,
      },
    },
    order: {
      dueDate: {
        direction: "ASC",
        nulls: "LAST",
      },
    },
  });
}

export async function countTasksByStatus(): Promise<
  { status: string; count: number }[]
> {
  const taskRepository = AppDataSource.getRepository(Task);

  const results = await taskRepository
    .createQueryBuilder("task")
    .select("task.status", "status")
    .addSelect("COUNT(*)", "count")
    .groupBy("task.status")
    .getRawMany();

  return results.map((row) => ({
    status: row.status,
    count: Number(row.count),
  }));
}

export async function getUsersWithTaskCounts(): Promise<
  { userId: number; name: string; taskCount: number }[]
> {
  const userRepository = AppDataSource.getRepository(User);

  const results = await userRepository
    .createQueryBuilder("user")
    .leftJoin("user.tasks", "task")
    .select("user.id", "userId")
    .addSelect("user.name", "name")
    .addSelect("COUNT(task.id)", "taskCount")
    .groupBy("user.id")
    .addGroupBy("user.name")
    .getRawMany();

  return results.map((row) => ({
    userId: Number(row.userId),
    name: row.name,
    taskCount: Number(row.taskCount),
  }));
}

export async function getTasksByTag(
  tagName: string
): Promise<Task[]> {
  const taskRepository = AppDataSource.getRepository(Task);

  return taskRepository.find({
    where: {
      tags: {
        name: tagName,
      },
    },
    relations: {
      tags: true,
    },
  });
}

export async function getOverdueTasks(): Promise<Task[]> {
  const taskRepository = AppDataSource.getRepository(Task);

  return taskRepository.find({
    where: {
      dueDate: LessThan(new Date()),
      status: Not(TaskStatus.DONE),
      assignee: Not(IsNull()),
    },
    relations: {
      assignee: true,
    },
  });
}


export async function getTopUsersByCompleted(
  limit: number
): Promise<{ userId: number; name: string; done: number }[]> {
  const userRepository = AppDataSource.getRepository(User);

  const results = await userRepository
    .createQueryBuilder("user")
    .innerJoin("user.tasks", "task")
    .where("task.status = :status", {
      status: TaskStatus.DONE,
    })
    .select("user.id", "userId")
    .addSelect("user.name", "name")
    .addSelect("COUNT(task.id)", "done")
    .groupBy("user.id")
    .addGroupBy("user.name")
    .orderBy("done", "DESC")
    .limit(limit)
    .getRawMany();

  return results.map((row) => ({
    userId: Number(row.userId),
    name: row.name,
    done: Number(row.done),
  }));
}