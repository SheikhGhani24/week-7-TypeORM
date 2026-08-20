import "reflect-metadata"
import "dotenv/config"

import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { Project } from "./entity/Project"
import { Task, TaskStatus } from "./entity/Task"
import { Tag } from "./entity/Tag"

async function seed() {
  await AppDataSource.initialize();

  console.log("Database connected.");

const userRepository = AppDataSource.getRepository(User)
const projectRepository = AppDataSource.getRepository(Project)
const taskRepository = AppDataSource.getRepository(Task)
const tagRepository = AppDataSource.getRepository(Tag);

const users = userRepository.create([
    {
        name : "Ghani",
        email: "Ghani@gmail.com",
    },
    {
        name: "Ali",
        email: "Ali@gmail.com",
    },
    {
        name: "Ahmed",
        email: "Ahmed@gmail.com",
    },
    {
        name: "Zain",
        email:"Zain@gmail.com",
    },
    {
        name: "Abdullah",
        email: "Abdullah@gmail.com"
    }

]);
await userRepository.save(users)

const projects = projectRepository.create([
    {
      name: "Website Redesign",
      owner: users[0],
    },
    {
      name: "Mobile App",
      owner: users[1],
    },
    {
      name: "Backend API",
      owner: users[2],
    },
  ]);

  await projectRepository.save(projects);

  const tags = tagRepository.create([
    { name: "frontend" },
    { name: "backend" },
    { name: "bug" },
    { name: "feature" },
    { name: "urgent" },
    { name: "testing" },
  ]);

  await tagRepository.save(tags);

   const tasks = taskRepository.create([
    {
      title: "Design homepage",
      description: "Create the homepage layout",
      status: TaskStatus.TODO,
      priority: 3,
      dueDate: new Date("2026-08-15"),
      project: projects[0],
      assignee: users[0],
      tags: [tags[0], tags[3]],
    },
    {
      title: "Create product API",
      description: "Build API for products",
      status: TaskStatus.IN_PROGRESS,
      priority: 5,
      dueDate: new Date("2026-08-16"),
      project: projects[0],
      assignee: users[1],
      tags: [tags[1], tags[4]],
    },
    {
      title: "Build product page",
      description: "Create the product details page",
      status: TaskStatus.DONE,
      priority: 4,
      dueDate: new Date("2026-08-17"),
      project: projects[0],
      assignee: users[0],
      tags: [tags[0], tags[3]],
    },
    {
      title: "Fix login bug",
      description: "Fix authentication issue",
      status: TaskStatus.DONE,
      priority: 5,
      dueDate: new Date("2026-08-10"),
      project: projects[0],
      assignee: users[2],
      tags: [tags[2], tags[4]],
    },
    {
      title: "Write frontend tests",
      description: "Add tests for homepage",
      status: TaskStatus.IN_PROGRESS,
      priority: 2,
      dueDate: new Date("2026-08-25"),
      project: projects[0],
      assignee: users[3],
      tags: [tags[0], tags[5]],
    },

    {
      title: "Create app design",
      description: "Design mobile application screens",
      status: TaskStatus.TODO,
      priority: 3,
      dueDate: new Date("2026-08-20"),
      project: projects[1],
      assignee: users[1],
      tags: [tags[0], tags[3]],
    },
    {
      title: "Implement authentication",
      description: "Implement mobile authentication",
      status: TaskStatus.DONE,
      priority: 5,
      dueDate: new Date("2026-08-12"),
      project: projects[1],
      assignee: users[2],
      tags: [tags[1], tags[4]],
    },
    {
      title: "Fix navigation",
      description: "Fix navigation issues",
      status: TaskStatus.DONE,
      priority: 4,
      dueDate: new Date("2026-08-14"),
      project: projects[1],
      assignee: users[0],
      tags: [tags[2], tags[0]],
    },
      {
      title: "Add notifications",
      description: "Add push notifications",
      status: TaskStatus.IN_PROGRESS,
      priority: 3,
      dueDate: new Date("2026-08-28"),
      project: projects[1],
      assignee: users[3],
      tags: [tags[3]],
    },
    {
      title: "Test mobile application",
      description: "Run application tests",
      status: TaskStatus.TODO,
      priority: 2,
      dueDate: null,
      project: projects[1],
      assignee: null,
      tags: [tags[5]],
    },

    {
      title: "Create user API",
      description: "Build user management API",
      status: TaskStatus.DONE,
      priority: 5,
      dueDate: new Date("2026-08-11"),
      project: projects[2],
      assignee: users[1],
      tags: [tags[1], tags[4]],
    },
    {
      title: "Create database service",
      description: "Implement database service",
      status: TaskStatus.IN_PROGRESS,
      priority: 4,
      dueDate: new Date("2026-08-24"),
      project: projects[2],
      assignee: users[2],
      tags: [tags[1]],
    },
    {
      title: "API error handling",
      description: "Improve API error handling",
      status: TaskStatus.TODO,
      priority: 3,
      dueDate: new Date("2026-08-22"),
      project: projects[2],
      assignee: null,
      tags: [tags[1], tags[2]],
    },
    {
      title: "Write API tests",
      description: "Add backend API tests",
      status: TaskStatus.DONE,
      priority: 4,
      dueDate: new Date("2026-08-18"),
      project: projects[2],
      assignee: users[3],
      tags: [tags[5], tags[1]],
    },
    {
  title: "Deploy API",
  description: "Deploy the backend API to the server",
  status: TaskStatus.TODO,
  priority: 3,
  dueDate: new Date("2026-08-30"),
  project: projects[2],
  assignee: null,
  tags: [tags[1], tags[5]],
},
  ]);


await taskRepository.save(tasks);

  console.log("Seed completed successfully.");
  console.log(`Users: ${users.length}`);
  console.log(`Projects: ${projects.length}`);
  console.log(`Tasks: ${tasks.length}`);
  console.log(`Tags: ${tags.length}`);

  await AppDataSource.destroy();
}
seed().catch(async (error) => {
  console.error("Seed failed:", error);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  process.exit(1);
});

  