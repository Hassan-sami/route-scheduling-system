const schedulingService = require('../services/schedulingService');

class ScheduleController {
  async getSchedule(req, res) {
    try {
      const schedule = await schedulingService.getSchedule();
      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async assignDriver(req, res) {
    try {
      const { driverId, routeId } = req.body;
      const result = await schedulingService.manuallyAssignDriver(driverId, routeId);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async completeRoute(req, res) {
    try {
      const { driverId, routeId } = req.body;
      const result = await schedulingService.completeRoute(driverId, routeId);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ScheduleController();