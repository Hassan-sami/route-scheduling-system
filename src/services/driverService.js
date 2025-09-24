const prisma = require('../config/database');

class DriverService {
  async createDriver(driverData) {
    const { id, name, licenseType, availability = true } = driverData;
    
    // Check if customId already exists
    if (id) {
      const existingDriver = await prisma.driver.findUnique({
        where: { id }
      });
      if (existingDriver) {
        throw new Error('Driver with this ID already exists');
      }
    }

    return await prisma.driver.create({
      data: {
        id,
        name,
        licenseType,
        availability
      }
    });
  }

  async getDriver(id) {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            route: true
          },
          orderBy: {
            assignedAt: 'desc'
          }
        }
      }
    });
    
    if (!driver) {
      throw new Error('Driver not found');
    }
    return driver;
  }

  async getDrivers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: {
            where: { status: 'active' },
            include: { route: true }
          }
        }
      }),
      prisma.driver.count()
    ]);

    return {
      drivers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getAvailableDrivers() {
    return await prisma.driver.findMany({
      where: { availability: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  async updateDriverAvailability(id, availability) {
    return await prisma.driver.update({
      where: { id },
      data: { availability }
    });
  }

  async getDriverHistory(driverId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [history, total] = await Promise.all([
      prisma.assignment.findMany({
        where: { driverId },
        skip,
        take: limit,
        include: {
          route: true
        },
        orderBy: { assignedAt: 'desc' }
      }),
      prisma.assignment.count({
        where: { driverId }
      })
    ]);

    return {
      history,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = new DriverService();