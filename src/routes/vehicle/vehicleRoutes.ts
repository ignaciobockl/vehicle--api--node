import { Router } from 'express';
import { 
    getVehicles, 
    getVehicleById, 
    createVehicle, 
    updateVehicle
} from '../../controllers/vehicle.controllers';


const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);

export default router;