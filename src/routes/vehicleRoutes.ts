import { Router } from 'express';
import { 
    getVehicles, 
    getVehicleById, 
    createVehicle 
} from '../controllers/vehicle.controllers';


const router = Router();

router.get('/vehicle', getVehicles);
router.get('/vehicle/:id', getVehicleById);
router.post('/vehicle', createVehicle);

export default router;