import prisma from '../src/config/prisma'; 

async function main() {
  await prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN' } });
  await prisma.role.upsert({ where: { name: 'PREMIUM' }, update: {}, create: { name: 'PREMIUM' } });
  await prisma.role.upsert({ where: { name: 'USER' }, update: {}, create: { name: 'USER' } });
  
  console.log('Uloge uspešno seed-ovane!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Zatvaramo konekciju tvoje glavne instance kada seed završi
    await prisma.$disconnect();
  });