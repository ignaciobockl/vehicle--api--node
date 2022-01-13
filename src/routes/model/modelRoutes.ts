import { Router } from 'express';
import { 
    getModels, 
    getModelById,
    createModel,
    updateModel,
    deleteModelLogical
} from '../../controllers/model/model.controllers';


const router = Router();

router.get('/', getModels);
router.get('/:id', getModelById);
router.post('/', createModel);
router.put('/:id', updateModel);
router.delete('/:id', deleteModelLogical);


export default router;