import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../../database/database';



export const getBrands = async ( req: Request, res: Response ): Promise<Response> => {

    const response: QueryResult = await pool.query(`SELECT * FROM brands AS b WHERE b.state = true`);
    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'No brands entered in the database were found.'
        });
    }

    return res.status(200).json({
        ok: true,
        quantity: response.rowCount,
        brands: response.rows
    });

}

export const getBrandById = async(req: Request, res: Response): Promise<Response> => {

    const id: number = parseInt( req.params.id );

    if ( id === undefined || id.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    const response: QueryResult = await pool.query(`SELECT * FROM brands AS b WHERE b.brand_id = ${ id } AND b.state = true`);
    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `The brand was not found in the database with the id entered or it was removed. Id: ${id}.`
        })
    }

    return res.status(200).json({
        ok: true,
        brand: response.rows
    })

}

export const createBrand = async( req: Request, res: Response ): Promise<Response> => {

    const { name } = req.body;

    if ( typeof(name) != 'string' ) {
        return res.status(400).json({
            ok: false,
            msg: `Expected 'string' in field "name"`,
            value: name
        });
    }

    if ( name.length === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `The field "name" cannot be null or undefined"`,
            value: name
        });
    }

    const nameValue: string = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const stateValue: boolean = true;

    if ( nameValue === '' || nameValue.trim() === '' || nameValue.length < 3) {
        return res.status(400).json({
            ok: false,
            msg: `The minimum length allowed for the 'name' field is 3.`,
            value: name
        });
    }

    const exist: QueryResult = await pool.query(`SELECT * FROM brands AS b WHERE b.name = '${ nameValue }'`);
    if ( exist.rows[0].name === nameValue ) {
        return res.status(400).json({
            ok: false,
            msg: `The brand already exists in the database.`,
            value: nameValue
        });
    }

    const response: QueryResult = await pool.query(`INSERT INTO brands (name, state) VALUES ($1, $2)`, [ nameValue, stateValue ]);
    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'Error when trying to insert the brand'
        });
    }

    return res.status(200).json({
        ok: true,
        msg: `The brand was created correctly.`,
        body: {
            brand: {
                name: nameValue,
                state: stateValue
            }
        }
    })

}

export const updateBrand = async ( req: Request, res: Response ): Promise<Response> => {

    const id: number = parseInt( req.params.id );
    const { name } = req.body;

    if ( id === undefined || id.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    const brandResponse: QueryResult = await pool.query(`SELECT * FROM brands AS b WHERE b.brand_id = ${ id } AND b.state = true`);
    if ( brandResponse.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `A brand was not found in the database with the id entered or it is deleted. Id: ${ id }.`
        });
    }

    // Validate name
    if ( name === undefined || name.length === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `The field "name" cannot be null or undefined.`
        });
    }

    if ( typeof(name) === 'number' || typeof(name) === 'boolean' ) {
        return res.status(400).json({
            ok: false,
            msg: `The type of value entered in the 'name' field is not valid, expected 'string'.`,
            value: name
        });
    }
    let nameValue: string = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if ( nameValue === '' || nameValue.trim() === '') {
        nameValue = brandResponse.rows[0].name
    } else if ( nameValue.length < 3) {
        return res.status(400).json({
            ok: false,
            msg: `The minimum length allowed for the 'name' field is 3.`,
            value: name
        });
    }
    
    if ( brandResponse.rows[0].name === nameValue ) {
        return res.status(400).json({
            ok: false,
            msg: 'The name of the entered brand is the same with which it is registered in the database.',
            nameInDatabase: brandResponse.rows[0].name,
            enteredName: nameValue
        });
    }

    const allBrands: QueryResult = await pool.query(`SELECT * FROM brands`);
    allBrands.rows.forEach(element => {
        if ( element.name === nameValue ) {
            return res.status(400).json({
                ok: false,
                msg: 'the name of the brand that I entered is already registered in the database.'
            });
        }
    });

    const response: QueryResult = await pool.query(`
        UPDATE brands AS b
        SET name = $1
        WHERE b.brand_id = ${ id }`,
        [ nameValue ]    
    );
    if ( response.rowCount === 0 ){
        return res.status(400).json({
            ok: false,
            msg: `Error when trying to modify the brand.`
        });
    }

    return res.status(200).json({
        ok: true,
        msg: `The brand was successfully modified.`,
        value: {
            name: nameValue
        }
    });

}