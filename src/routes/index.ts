import { Router } from 'express';

import BrandRoutes from './brand.routes';
import ModelRoutes from './model.routes';
import VehicleRoutes from './vehicle.routes';


const router = Router();

router.use('/brand', BrandRoutes);
router.use('/model', ModelRoutes);
router.use('/vehicle', VehicleRoutes);

export default router;