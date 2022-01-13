import { Router } from 'express';

import VehicleRoutes from './vehicle/vehicleRoutes';
import ModelRoutes from './model/modelRoutes';


const router = Router();

router.use('/vehicle', VehicleRoutes);
router.use('/model', ModelRoutes);

export default router;