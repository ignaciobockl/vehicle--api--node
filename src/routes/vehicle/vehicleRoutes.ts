import { Router } from 'express';
import { 
    getVehicles, 
    getVehicleById, 
    createVehicle 
} from '../../controllers/vehicle.controllers';


const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);

export default router;