const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        id: 'DRV-001',
        name: 'John Smith',
        licenseType: 'Commercial',
        availability: true
      }
    }),
    prisma.driver.create({
      data: {
        id: 'DRV-002',
        name: 'Maria Garcia',
        licenseType: 'Commercial',
        availability: true
      }
    }),
    prisma.driver.create({
      data: {
        id: 'DRV-003',
        name: 'Robert Johnson',
        licenseType: 'Heavy Vehicle',
        availability: false
      }
    })
  ]);

  console.log(`✅ Created ${drivers.length} drivers`);

  // Create sample routes
  const routes = await Promise.all([
    prisma.route.create({
      data: {
        startLocation: 'New York',
        endLocation: 'Boston',
        distance: 215.5,
        estimatedTime: 4.5,
        status: 'completed'
      }
    }),
    prisma.route.create({
      data: {
        startLocation: 'Los Angeles',
        endLocation: 'San Francisco',
        distance: 382.0,
        estimatedTime: 6.0,
        status: 'assigned'
      }
    }),
    prisma.route.create({
      data: {
        startLocation: 'Chicago',
        endLocation: 'Detroit',
        distance: 282.0,
        estimatedTime: 4.8,
        status: 'pending'
      }
    })
  ]);

  console.log(`✅ Created ${routes.length} routes`);

  // Create sample assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        driverId: drivers[0].id,
        routeId: routes[0].id,
        status: 'completed',
        completedAt: new Date()
      }
    }),
    prisma.assignment.create({
      data: {
        driverId: drivers[1].id,
        routeId: routes[1].id,
        status: 'active'
      }
    })
  ]);

  console.log(`✅ Created ${assignments.length} assignments`);
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });