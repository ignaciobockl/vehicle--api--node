import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';

import { 
    getBrands, 
    getBrandById, 
    createBrand, 
    updateBrand,
    deleteBrand
} from '../controllers/brand.controllers';


const router = Router();

router.route('/')
    .get( getBrands )
    .post( [
        check('name', 'The brand name is required.').not().isEmpty(),
        check('name', 'The minimum number of characters for the brand name is 3.').isLength({ min: 3 }),
        validateFields
    ], createBrand );

router.route('/:id')
    .get( getBrandById )
    .put( updateBrand )
    .delete( deleteBrand );


export default router;