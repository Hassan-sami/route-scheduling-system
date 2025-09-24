const prisma = require('../config/database');
const driverService = require('./driverService');
const routeService = require('./routeService');

class SchedulingService {
  async assignDriverToRoute(routeId) {
    return await prisma.$transaction(async (tx) => {
      // Find available drivers
      const availableDrivers = await tx.driver.findMany({
        where: { availability: true },
        orderBy: { createdAt: 'asc' }
      });
      
      if (availableDrivers.length === 0) {
        // Mark route as unassigned
        const updatedRoute = await tx.route.update({
          where: { id: parseInt(routeId) },
          data: { status: 'unassigned' }
        });
        
        return { 
          assigned: false, 
          message: 'No available drivers',
          route: updatedRoute
        };
      }

      // Assign the first available driver
      const driver = availableDrivers[0];
      
      // Create assignment
      const assignment = await tx.assignment.create({
        data: {
          driverId: driver.id,
          routeId: parseInt(routeId),
          status: 'active'
        },
        include: {
          driver: true,
          route: true
        }
      });
      
      // Update driver availability
      await tx.driver.update({
        where: { id: driver.id },
        data: { availability: false }
      });
      
      // Update route status
      await tx.route.update({
        where: { id: parseInt(routeId) },
        data: { status: 'assigned' }
      });

      return {
        assigned: true,
        assignment,
        driver: assignment.driver,
        route: assignment.route
      };
    });
  }

  async getSchedule() {
    return await prisma.driver.findMany({
      include: {
        assignments: {
          where: { status: 'active' },
          include: {
            route: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async completeRoute(driverId, routeId) {
    return await prisma.$transaction(async (tx) => {
      // Complete the assignment
      const assignment = await tx.assignment.updateMany({
        where: {
          driverId,
          routeId: parseInt(routeId),
          status: 'active'
        },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });
      
      if (assignment.count === 0) {
        throw new Error('Active assignment not found');
      }
      
      // Free up the driver
      await tx.driver.update({
        where: { id: driverId },
        data: { availability: true }
      });
      
      // Update route status
      await tx.route.update({
        where: { id: parseInt(routeId) },
        data: { status: 'completed' }
      });
      
      return { 
        message: 'Route completed successfully',
        driverId,
        routeId: parseInt(routeId)
      };
    });
  }

  async manuallyAssignDriver(driverId, routeId) {
    return await prisma.$transaction(async (tx) => {
      // Check if driver is available
      const driver = await tx.driver.findUnique({
        where: { id: driverId }
      });
      
      if (!driver) {
        throw new Error('Driver not found');
      }
      
      if (!driver.availability) {
        throw new Error('Driver is not available');
      }
      
      // Check if route exists and is pending
      const route = await tx.route.findUnique({
        where: { id: parseInt(routeId) }
      });
      
      if (!route) {
        throw new Error('Route not found');
      }
      
      if (route.status !== 'pending') {
        throw new Error('Route is not available for assignment');
      }
      
      // Create assignment
      const assignment = await tx.assignment.create({
        data: {
          driverId,
          routeId: parseInt(routeId),
          status: 'active'
        },
        include: {
          driver: true,
          route: true
        }
      });
      
      // Update driver availability
      await tx.driver.update({
        where: { id: driverId },
        data: { availability: false }
      });
      
      // Update route status
      await tx.route.update({
        where: { id: parseInt(routeId) },
        data: { status: 'assigned' }
      });
      
      return {
        assignment,
        driver: assignment.driver,
        route: assignment.route
      };
    });
  }
}

module.exports = new SchedulingService();