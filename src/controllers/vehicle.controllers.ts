import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../database/database';


export const getVehicles = async ( req: Request, res: Response ): Promise<Response> => {

    try {

        /* const response: QueryResult = await pool.query(`
            SELECT v.vehicle_id, v.transmission, v.typeofvehicle, v.typesoffuel, v.colour, 
                v.model_id, md.name AS model_name, md.version AS model_version,
                v.motor_id, mt.name AS motor_name, mt.displacement AS motor_displacement, mt.version AS motor_version, 
                v.brand_id, br.name AS brand_name FROM vehicles AS v

                     INNER JOIN models AS md
                         ON v.model_id = md.model_id

                     INNER JOIN motors AS mt
                         ON v.motor_id = mt.motor_id

                     INNER JOIN brands AS br
                          ON v.brand_id = br.brand_id

                     WHERE v.state = true AND md.state = true AND mt.state = true AND br.state = true
        `); */


        // console.log(response.rows);
        const response: QueryResult = await pool.query(`
            SELECT 
                v.*, 
                row_to_json(models.*) AS model, 
                row_to_json(motors.*) AS motor, 
                row_to_json(brands.*) AS brand 
            FROM 
                vehicles AS v
            INNER JOIN 
                models ON (models.model_id = v.model_id) 
            INNER JOIN
                motors ON (motors.motor_id = v.motor_id)
            INNER JOIN
                brands ON (brands.brand_id = v.brand_id)
            WHERE 
                v.state = true AND 
                models.state = true AND  
                motors.state = true AND 
                brands.state = true
        `);

        if ( response.rowCount === 0 ) {
            return res.status(400).json({
                ok: false,
                msg: 'There are no vehicles in the database'
            });
        }

        return res.status(200).json({
            ok: true,
            vehicles: response.rows
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Internal Server Error'
        });
    }

}

export const getVehicleById = async ( req: Request, res: Response ): Promise<Response> => {

    const { id } = req.params;
    const idVehicle: number = parseInt(id);
    console.log(idVehicle)

    if ( id === undefined || idVehicle.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    /* SELECT * FROM vehicles AS v
            WHERE v.vehicle_id = ${ idVehicle }*/
    const response: QueryResult = await pool.query(`
        SELECT 
            v.*, 
            row_to_json(models.*) AS model, 
            row_to_json(motors.*) AS motor, 
            row_to_json(brands.*) AS brand 
        FROM 
            vehicles AS v
        INNER JOIN 
            models ON (models.model_id = v.model_id) 
        INNER JOIN
            motors ON (motors.motor_id = v.motor_id)
        INNER JOIN
            brands ON (brands.brand_id = v.brand_id)
        WHERE 
            v.state = true AND 
            models.state = true AND  
            motors.state = true AND 
            brands.state = true AND
            v.vehicle_id = ${ idVehicle }
        
    `);

    console.log(response.rows[0])
    if ( response.rows[0] === undefined ){
        return res.status(400).json({
            ok: false,
            msg: `there is no vehicle registered in the database with the id entered: ${ idVehicle }`
        });
    }

    return res.json(response.rows)

}

export const createVehicle = async ( req: Request, res: Response ): Promise<Response> => {

    const { 
        transmission, 
        typeofvehicle, 
        typesoffuel, 
        colour, 
        state, 
        model_id, 
        brand_id, 
        motor_id 
    } = req.body;


    const val1: string = transmission.toLowerCase();
    const trans: string = val1.charAt(0).toUpperCase() + val1.slice(1);
    try {
        const responseTransmission: QueryResult = await pool.query(`
            SELECT * FROM unnest(enum_range(NULL::transmission_enum)) 
            WHERE unnest.transmission_enum = '${ trans }' 
        `);

        if ( responseTransmission.rowCount === 0 ) {
            const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::transmission_enum)) AS Transmission')
        return res.status(400).json({
            ok: false,
            msg: `The transmission entered does not exist in the database`,
            types: types.rows
        });
        }
    } catch (error) {
        console.log(error);
        const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::transmission_enum)) AS Transmission')
        return res.status(400).json({
            ok: false,
            msg: `The transmission entered does not exist in the database`,
            types: types.rows
        });
    }


    const val2: string = typeofvehicle.toLowerCase();
    const typeVehicle: string = val2.charAt(0).toUpperCase() + val2.slice(1);
    try {
        const responseTypeVehicle: QueryResult = await pool.query(`
            SELECT * FROM unnest(enum_range(NULL::typeofvehicle_enum)) 
            WHERE unnest.typeofvehicle_enum = '${ typeVehicle }'
        `);

        if ( responseTypeVehicle.rowCount === 0 ) {
            const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::typeofvehicle_enum)) AS TypeOfVehicle');
            return res.status(400).json({
            ok: false,
            msg: `The type of vehicle entered does not exist in the database. `,
            types: types.rows
            });
        }
    } catch (error) {
        console.log(error);
        const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::typeofvehicle_enum)) AS TypeOfVehicle');
        return res.status(400).json({
            ok: false,
            msg: `The type of vehicle entered does not exist in the database. `,
            types: types.rows
        });
    }


    const val3: string = typesoffuel.toLowerCase();
    const typeFuel: string = val3.charAt(0).toUpperCase() + val3.slice(1);
    try {
        const responseTypeFuel: QueryResult = await pool.query(`
            SELECT * FROM unnest(enum_range(NULL::typesoffuel_enum)) 
            WHERE unnest.typesoffuel_enum = '${ typeFuel }'
        `);

        if ( responseTypeFuel.rowCount === 0 ) {
            const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::typesoffuel_enum)) AS TypeOfFuel');
            return res.status(400).json({
            ok: false,
            msg: `The type of fuel entered does not exist in the database. `,
            types: types.rows
            });
        }
    } catch (error) {
        console.log(error);
        const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::typesoffuel_enum)) AS TypeOfFuel');
        return res.status(400).json({
        ok: false,
        msg: `The type of fuel entered does not exist in the database. `,
        types: types.rows
        });
    }


    const color = colour.toLowerCase();
    if ( typeof(color) != 'string' ) {
        return res.status(400).json({
            ok: false,
            msg: `The type of value entered in the 'color' field is not valid, expected 'string'.`,
            value: color
        });
    }


    if ( typeof(model_id) != 'number' ){
        return res.status(400).json({
            ok: false,
            msg: `The type of value entered is not valid, expected 'number'..`,
            value: model_id
        });
    }
    try {
        const responseModelId: QueryResult = await pool.query(`
            SELECT * FROM models AS md
            WHERE md.model_id = ${ model_id }
        `);
        
        if ( responseModelId.rowCount === 0 ){
            const types: QueryResult = await pool.query('SELECT * FROM models');
            return res.status(400).json({
                ok: false,
                msg: `the value entered in the 'model_id' field does not 
                    represent any existing value in the database.`,
                models: types.rows
            });
        }
    } catch (error) {
        console.log(error);
        const types: QueryResult = await pool.query('SELECT * FROM models');
        return res.status(400).json({
            ok: false,
            msg: `the value entered in the 'model_id' field does not 
                represent any existing value in the database.`,
            models: types.rows
        });
    }


    if ( typeof(motor_id) != 'number' ){
        return res.status(400).json({
            ok: false,
            msg: `The type of value entered is not valid, expected 'number'.`,
            value: motor_id
        });
    }
    try {
        const responseMotorId: QueryResult = await pool.query(`
            SELECT * FROM motors AS mt
            WHERE mt.motor_id = ${ motor_id }
        `);
        
        if ( responseMotorId.rowCount === 0 ){
            const types: QueryResult = await pool.query('SELECT * FROM motors');
            return res.status(400).json({
                ok: false,
                msg: `the value entered in the 'motor_id' field does not 
                    represent any existing value in the database.`,
                models: types.rows
            });
        }
    } catch (error) {
        console.log(error);
        const types: QueryResult = await pool.query('SELECT * FROM motors');
        return res.status(400).json({
            ok: false,
            msg: `the value entered in the 'motor_id' field does not 
                represent any existing value in the database.`,
            models: types.rows
        });
    }


    if ( typeof(brand_id) != 'number' ){
        return res.status(400).json({
            ok: false,
            msg: `The type of value entered is not valid, expected 'number'.`,
            value: brand_id
        });
    }
    try {
        const responseBrandId: QueryResult = await pool.query(`
            SELECT * FROM brands AS br
            WHERE br.brand_id = ${ brand_id }
        `);

        if ( responseBrandId.rowCount === 0 ){
            const types: QueryResult = await pool.query('SELECT * FROM brands');
            return res.status(400).json({
                ok: false,
                msg: `the value entered in the 'brand_id' field does not 
                    represent any existing value in the database.`,
                models: types.rows
            });
        }
    } catch (error) {
        console.log(error);
        const types: QueryResult = await pool.query('SELECT * FROM brands');
        return res.status(400).json({
            ok: false,
            msg: `the value entered in the 'brand_id' field does not 
                represent any existing value in the database.`,
            models: types.rows
        });
    }



    const transmissionValue: string = transmission.charAt(0).toUpperCase() + val1.slice(1);
    const typeOfVehicleValue: string = typeofvehicle.charAt(0).toUpperCase() + val2.slice(1);
    const typeOfFuelValue: string = typesoffuel.charAt(0).toUpperCase() + val3.slice(1);
    const colourValue: string = color.charAt(0).toUpperCase() + color.slice(1);
    const stateDefault: boolean = true;
    const modelValue: QueryResult = await pool.query(`
        SELECT * FROM models AS m WHERE m.model_id = '${ model_id }'
    `);
    const motorValue: QueryResult = await pool.query(`
        SELECT * FROM motors AS m WHERE m.motor_id = '${ motor_id }'
    `);
    const brandValue: QueryResult = await pool.query(`
        SELECT * FROM brands AS b WHERE b.brand_id = '${ brand_id }'
    `);


    const response: QueryResult = await pool.query(`
        INSERT INTO vehicles ( 
            transmission, typeofvehicle, typesoffuel, colour, state, model_id, motor_id, brand_id 
        )
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )`,
        [ transmissionValue, typeOfVehicleValue, typeOfFuelValue, colourValue, stateDefault,
            model_id, motor_id, brand_id ]
    );

    return res.status(201).json({
        ok: true,
        msg: 'the vehicle was created successfully',
        body: {
            vehicle: {
                transmission: transmission.charAt(0).toUpperCase() + val1.slice(1),
                typeofvehicle: typeofvehicle.charAt(0).toUpperCase() + val2.slice(1),
                typesoffuel: typesoffuel.charAt(0).toUpperCase() + val3.slice(1),
                colour: color.charAt(0).toUpperCase() + color.slice(1),
                state: stateDefault,
                model: modelValue.rows,
                motor: motorValue.rows,
                brand: brandValue.rows
            }
        }
    });
    
}
