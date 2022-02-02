import { Request, Response } from 'express';
import { pool } from '../database/database';
import { QueryResult } from 'pg';



export const getModels = async( req: Request, res: Response ): Promise<Response> => {

    const response: QueryResult = await pool.query('SELECT * FROM models AS m WHERE m.state = true');

    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'No models were found entered in the database.'
        });
    }

    return res.status(200).json({
        ok: true,
        models: response.rows
    });

}


export const getModelById = async(req: Request, res: Response): Promise<Response> => {

    const id: number = parseInt(req.params.id);

    if ( id === undefined || id.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    const response: QueryResult = await pool.query(`SELECT * FROM models AS m WHERE m.model_id = ${ id } AND m.state = true`);
    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `A model was not found in the database with the id entered or it is deleted. Id: ${ id }.`
        });
    }

    return res.status(200).json({
        ok: true,
        model: response.rows
    });
}

export const createModel = async ( req: Request, res: Response ): Promise<Response> => {

    const { name, version } = req.body;

    if ( typeof(name) != 'string' ) {
        return res.status(400).json({
            ok: false,
            msg: `Expected 'string' in field "name" and "version"`,
            value: name, version
        });
    }

    if ( name.length === 0 || version.lenght === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `The field "name" and "version" cannot be null or undefined"`,
            value: name, version
        });
    }

    const nameValue: string = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const versionValue: string = version.charAt(0).toUpperCase() + version.slice(1).toLowerCase();
    const stateValue: boolean = true;

    const response: QueryResult = await pool.query(`
        INSERT INTO models (name, version, state) VALUES ($1, $2, $3)`, 
        [ nameValue, versionValue, stateValue ]
    );
    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'Error when trying to insert the model'
        });
    }

    return res.status(200).json({
        ok: true,
        msg: 'the model was created successfully',
        body: {
            model: {
                name: nameValue,
                version: versionValue,
                state: stateValue
            }
        }
    });

}


export const updateModel = async ( req: Request, res: Response ): Promise<Response> => {

    const id: number = parseInt(req.params.id);
    const { name, version } = req.body

    if ( id === undefined || id.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    const modelResponse: QueryResult = await pool.query(`SELECT * FROM models AS m WHERE m.model_id = ${ id } AND m.state = true`);
    if ( modelResponse.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `A model was not found in the database with the id entered or it is deleted. Id: ${ id }.`
        });
    }


    // Validate name
    if ( typeof(name) === 'number' || typeof(name) === 'boolean' ) {
        return res.status(400).json({
            ok: false,
            msg: `El tipo de valor ingresado en el campo 'name' no es válido, se esperaba 'string'.`,
            value: name
        });
    }
    let nameValue: string = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if ( nameValue === '' || name.trim() === '') {
        nameValue = modelResponse.rows[0].name
    } else if ( nameValue.length < 3) {
        return res.status(400).json({
            ok: false,
            msg: `The minimum length allowed for the 'name' field is 3.`,
            value: name
        });
    }


    // Validate version
    if ( typeof(version) === 'number' || typeof(version) === 'boolean' ) {
        return res.status(400).json({
            ok: false,
            msg: `El tipo de valor ingresado en el campo 'version' no es válido, se esperaba 'string'.`,
            value: version
        });
    }
    let versionValue: string = version.charAt(0).toUpperCase() + version.slice(1).toLowerCase();
    if ( versionValue === '' || versionValue.trim() === '') {
        versionValue = modelResponse.rows[0].version
    }

    const response: QueryResult = await pool.query(`
        UPDATE models AS m 
        SET name = $1, version = $2 
        WHERE m.model_id = ${ id }`, 
        [ nameValue, versionValue ]
    );
    if ( response.rowCount === 0 ){
        return res.status(400).json({
            ok: false,
            msg: `Error when trying to modify the model.`
        });
    }

    return res.status(200).json({
        ok: true,
        msg: 'The model has been successfully modified.',
        model: {
            name: nameValue,
            version: versionValue
        }
    })
}

export const deleteModelLogical = async ( req: Request, res: Response ): Promise<Response> => {

    const id: number = parseInt(req.params.id);
    let stateValue: boolean = true;

    if ( id === undefined || id.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    const modelResponse: QueryResult = await pool.query(`SELECT * FROM models AS m WHERE m.model_id = ${ id }`);
    if ( modelResponse.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `the model you are trying to delete does not exist in the database, check field 'id': ${ id }`
        });
    }


    if ( modelResponse.rows[0].state === true ) {
        stateValue = false;

        const response: QueryResult = await pool.query(`UPDATE models AS m SET state = $1 WHERE m.model_id = ${ id }`, [ stateValue ]);
        if ( response.rowCount === 0 ){
            return res.status(400).json({
                ok: false,
                msg: `Error when trying to delete a model.`
            });
        }

        return res.status(200).json({
            ok: true,
            msg: `The model was successfully removed.`
        });
    } else {
        stateValue = true;

        const response: QueryResult = await pool.query(`UPDATE models AS m SET state = $1 WHERE m.model_id = ${ id }`, [ stateValue ]);
        if ( response.rowCount === 0 ){
            return res.status(400).json({
                ok: false,
                msg: `An attempt to restore the model failed.`
            });
        }

        return res.status(200).json({
            ok: true,
            msg: `The model was restored successfully.`
        });
    }
}