import { Router } from 'express';

import VehicleRoutes from './vehicle/vehicleRoutes';


const router = Router();

router.use('/vehicle', VehicleRoutes);

export default router;