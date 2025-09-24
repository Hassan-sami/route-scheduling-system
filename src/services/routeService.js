const prisma = require('../config/database');

class RouteService {
  async createRoute(routeData) {
    const { startLocation, endLocation, distance, estimatedTime } = routeData;
    
    return await prisma.route.create({
      data: {
        startLocation,
        endLocation,
        distance: parseFloat(distance),
        estimatedTime: parseFloat(estimatedTime)
      }
    });
  }

  async getRoutes(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: {
            where: { status: 'active' },
            include: { driver: true }
          }
        }
      }),
      prisma.route.count()
    ]);

    return {
      routes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getRoute(id) {
    const route = await prisma.route.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignments: {
          include: { driver: true }
        }
      }
    });
    
    if (!route) {
      throw new Error('Route not found');
    }
    return route;
  }

  async updateRouteStatus(id, status) {
    return await prisma.route.update({
      where: { id: parseInt(id) },
      data: { status }
    });
  }
}

module.exports = new RouteService();