const routeService = require('../services/routeService');
const schedulingService = require('../services/schedulingService');

class RouteController {
  async createRoute(req, res) {
    try {
      const route = await routeService.createRoute(req.body);
      
      // Try to assign a driver automatically
      const assignmentResult = await schedulingService.assignDriverToRoute(route.id);
      
      res.status(201).json({
        success: true,
        data: {
          route,
          assignment: assignmentResult
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getRoutes(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await routeService.getRoutes(page, limit);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getRoute(req, res) {
    try {
      const route = await routeService.getRoute(req.params.id);
      res.json({
        success: true,
        data: route
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new RouteController();