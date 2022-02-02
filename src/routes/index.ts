import { Router } from 'express';

import BrandRoutes from './brandRoutes';
import ModelRoutes from './modelRoutes';
import VehicleRoutes from './vehicleRoutes';


const router = Router();

router.use('/brand', BrandRoutes);
router.use('/model', ModelRoutes);
router.use('/vehicle', VehicleRoutes);

export default router;