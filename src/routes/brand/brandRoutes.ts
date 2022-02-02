import { Router } from 'express';

import { 
    getBrands, 
    getBrandById, 
    createBrand, 
    updateBrand,
    deleteBrand
} from '../../controllers/brand.controllers';


const router = Router();

router.route('/')
    .get( getBrands )
    .post( createBrand );

router.route('/:id')
    .get( getBrandById )
    .put( updateBrand )
    .delete( deleteBrand );


export default router;