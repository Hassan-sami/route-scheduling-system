const validateDriver = (req, res, next) => {
  if(req.method == 'POST'){
    const { name, licenseType,id } = req.body;
                                          
    if (!name || !licenseType || !id) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: name, licenseType' 
      });
  }
  }
  next();
};

const validateRoute = (req, res, next) => {
  if(req.method == 'POST'){
      const { startLocation, endLocation, distance, estimatedTime } = req.body;
      
      if (!startLocation || !endLocation || !distance || !estimatedTime) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: startLocation, endLocation, distance, estimatedTime' 
        });
      }
      
      if (isNaN(distance) || parseFloat(distance) <= 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Distance must be a positive number' 
        });
      }
      
      if (isNaN(estimatedTime) || parseFloat(estimatedTime) <= 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Estimated time must be a positive number' 
        });
      }
  }
  
  
  next();
};

const validateAssignment = (req, res, next) => {
  const { driverId, routeId } = req.body;
  
  if (!driverId || !routeId) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields: driverId, routeId' 
    });
  }
  
  next();
};

module.exports = {
  validateDriver,
  validateRoute,
  validateAssignment
};