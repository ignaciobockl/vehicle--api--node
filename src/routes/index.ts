import { Router } from 'express';

import BrandRoutes from './brand/brandRoutes';
import ModelRoutes from './model/modelRoutes';
import VehicleRoutes from './vehicle/vehicleRoutes';


const router = Router();

router.use('/brand', BrandRoutes);
router.use('/model', ModelRoutes);
router.use('/vehicle', VehicleRoutes);

export default router;