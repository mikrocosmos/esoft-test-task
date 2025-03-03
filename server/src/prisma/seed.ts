import { prisma } from "./prisma-client";
import { tasks, users } from "./constants";

async function up() {
  await prisma.user.createMany({
    data: users,
  });

  await prisma.task.createMany({
    data: tasks,
  });
}

async function down() {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prisma.$executeRaw`TRUNCATE TABLE task;`;
  await prisma.$executeRaw`TRUNCATE TABLE user;`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
