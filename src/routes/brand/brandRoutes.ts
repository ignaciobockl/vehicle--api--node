import { Router } from 'express';
import { 
    getBrands, 
    getBrandById, 
    createBrand, 
    updateBrand
} from '../../controllers/brand/brand.controllers';


const router = Router();

router.route('/')
    .get( getBrands )
    .post( createBrand );

router.route('/:id')
    .get( getBrandById )
    .put( updateBrand );


export default router;