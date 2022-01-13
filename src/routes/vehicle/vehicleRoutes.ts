import { Router } from 'express';
import { 
    getVehicles, 
    getVehicleById, 
    createVehicle, 
    updateVehicle,
    deleteVehicleLogical,
    deleteVehiclePhysical
} from '../../controllers/vehicle/vehicle.controllers';


const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicleLogical);
router.delete('/erased/:id', deleteVehiclePhysical);

export default router;