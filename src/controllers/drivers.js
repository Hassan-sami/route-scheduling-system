const driverService = require('../services/driverService');

class DriverController {
  async createDriver(req, res) {
    try {
      const driver = await driverService.createDriver(req.body);
      res.status(201).json({
        success: true,
        data: driver
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getDriver(req, res) {
    try {
      const driver = await driverService.getDriver(req.params.id);
      res.json({
        success: true,
        data: driver
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getDrivers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await driverService.getDrivers(page, limit);
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

  async getDriverHistory(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const history = await driverService.getDriverHistory(req.params.id, page, limit);
      res.json({
        success: true,
        ...history
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new DriverController();