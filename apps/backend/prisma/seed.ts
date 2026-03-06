import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const starterCaptains = [
  { id: "captain_1", name: "Arun", currentLat: 12.9698, currentLng: 77.5906 },
  { id: "captain_2", name: "Vikram", currentLat: 12.9611, currentLng: 77.6387 },
  { id: "captain_3", name: "Ravi", currentLat: 12.926, currentLng: 77.6762 }
];

async function seed() {
  for (const captain of starterCaptains) {
    await prisma.captain.upsert({
      where: { id: captain.id },
      create: {
        ...captain,
        isOnline: true,
        isAvailable: true
      },
      update: {
        ...captain
      }
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

