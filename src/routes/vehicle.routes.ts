import { Router } from 'express';
import { 
    getVehicles, 
    getVehicleById, 
    createVehicle, 
    updateVehicle,
    deleteVehicleLogical,
    deleteVehiclePhysical
} from '../controllers/vehicle.controllers';


const router = Router();

router.route('/')
    .get( getVehicles )
    .post( createVehicle );

router.route('/:id')
    .get( getVehicleById )
    .put( updateVehicle )
    .delete( deleteVehicleLogical );

router.route('/erased/:id').delete( deleteVehiclePhysical );


export default router;