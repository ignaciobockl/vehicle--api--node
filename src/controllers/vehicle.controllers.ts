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

    if ( id === undefined || idVehicle.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

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


    // Validate transmission
    const val1: string = transmission.toLowerCase();
    const trans: string = val1.charAt(0).toUpperCase() + val1.slice(1);
    try {
        const responseTransmission: QueryResult = await pool.query(`
            SELECT * FROM unnest(enum_range(NULL::transmission_enum)) 
            WHERE unnest.transmission_enum = '${ trans }' 
        `);

        if ( responseTransmission.rowCount === 0 ) {
            const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::transmission_enum)) AS Transmission');
            return res.status(400).json({
                ok: false,
                msg: `The transmission entered does not exist in the database`,
                types: types.rows
             });
        }
    } catch (error) {
        console.log(error);
        const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::transmission_enum)) AS Transmission');
        return res.status(400).json({
            ok: false,
            msg: `The transmission entered does not exist in the database`,
            types: types.rows
        });
    }


    // Validate Type Of Vehicle
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


    // Validate Type Of Fuel
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

    // Validate Colour
    const color = colour.toLowerCase();
    if ( typeof(color) != 'string' ) {
        return res.status(400).json({
            ok: false,
            msg: `The type of value entered in the 'color' field is not valid, expected 'string'.`,
            value: color
        });
    }


    // Validate Model Id
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


    // Validate Motor Id
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


    // Validate Brand Id
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


    // Insert the vehicle in the database
    const response: QueryResult = await pool.query(`
        INSERT INTO vehicles ( 
            transmission, typeofvehicle, typesoffuel, colour, state, model_id, motor_id, brand_id 
        )
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )`,
        [ transmissionValue, typeOfVehicleValue, typeOfFuelValue, colourValue, stateDefault,
            model_id, motor_id, brand_id ]
    );
    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'Error when trying to insert the vehicle'
        });
    }

    return res.status(201).json({
        ok: true,
        msg: 'the vehicle was created successfully',
        body: {
            vehicle: {
                transmission: transmissionValue,
                typeofvehicle: typeOfVehicleValue,
                typesoffuel: typeOfFuelValue,
                colour: colourValue,
                state: stateDefault,
                model: modelValue.rows,
                motor: motorValue.rows,
                brand: brandValue.rows
            }
        }
    });
    
}


export const updateVehicle = async( req: Request, res: Response ): Promise<Response> => {

    const { id } = req.params;

    const idVehicle: number = parseInt(id);

    if ( id === undefined || idVehicle.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    const { transmission, typeofvehicle, typesoffuel, colour, model_id, brand_id, motor_id } = req.body;

    try {
        const exists = await pool.query(`SELECT * FROM vehicles AS v WHERE v.vehicle_id = ${ id } `);
        if ( exists.rowCount === 0 ) {
            return res.status(400).json({
                ok: false,
                msg: `Entered an invalid or non-existent 'id' in the database. Id: ${ id }`
            });
        }
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: `Entered an invalid or non-existent 'id' in the database`
        });
    }

    const stateValue: QueryResult = await pool.query(`SELECT * FROM vehicles AS v WHERE v.vehicle_id = ${ id } `);
    if ( stateValue.rows[0].state === false ) {
        return res.status(400).json({
            ok: false,
            msg: 'The vehicle you are trying to modify has been eliminated'
        });
    }

    let transmissionValue: string = transmission.charAt(0).toUpperCase() + transmission.slice(1).toLocaleLowerCase();
    let typeOfVehicleValue: string = typeofvehicle.charAt(0).toUpperCase() + typeofvehicle.slice(1).toLocaleLowerCase();
    let typeOfFuelValue: string = typesoffuel.charAt(0).toUpperCase() + typesoffuel.slice(1).toLocaleLowerCase();

    
    const vehicle: QueryResult = await pool.query(`SELECT * FROM vehicles AS v WHERE v.vehicle_id = ${ id } `);
    if ( vehicle.rowCount === 0) {
        return res.status(400).json({
            ok: false,
            msg: `No vehicle was found with the id entered. Id: ${ id }`
        });
    } 


    // Validate transmission
    if ( transmission != '' ) {
        try {
            const responseTransmission: QueryResult = await pool.query(`
                SELECT * FROM unnest(enum_range(NULL::transmission_enum)) 
                WHERE unnest.transmission_enum = '${ transmissionValue }' 
            `);
    
            if ( responseTransmission.rowCount === 0 ) {
                const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::transmission_enum)) AS Transmission');
                return res.status(400).json({
                    ok: false,
                    msg: `The transmission entered does not exist in the database`,
                    types: types.rows
                 });
            }
        } catch (error) {
            // console.log(error);
            const types: QueryResult = await pool.query('SELECT * FROM unnest(enum_range(NULL::transmission_enum)) AS Transmission');
            return res.status(400).json({
                ok: false,
                msg: `The transmission entered does not exist in the database`,
                types: types.rows
            });
        }
    } else {
        transmissionValue = vehicle.rows[0].transmission;
    }


    // Validate Type Of Vehicle
    if ( typeOfVehicleValue != '' ) {
        try {
            const responseTypeVehicle: QueryResult = await pool.query(`
                SELECT * FROM unnest(enum_range(NULL::typeofvehicle_enum)) 
                WHERE unnest.typeofvehicle_enum = '${ typeOfVehicleValue }'
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
    } else {
        typeOfVehicleValue = vehicle.rows[0].typeofvehicle;
    }


    // Validate Type Of Vehicle
    if ( typeOfFuelValue != '' ) {
        try {
            const responseTypeFuel: QueryResult = await pool.query(`
                SELECT * FROM unnest(enum_range(NULL::typesoffuel_enum)) 
                WHERE unnest.typesoffuel_enum = '${ typeOfFuelValue }'
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
    } else {
        typeOfFuelValue = vehicle.rows[0].typesoffuel;
    }

    
    // Validate Colour
    if ( typeof( colour ) === 'number' ) {
        return res.status(400).json({
            ok: false,
            msg: `The type of value entered in the 'color' field is not valid, expected 'string'.`,
            value: colour
        });
    }
    let colourValue: string = colour.charAt(0).toUpperCase() + colour.slice(1).toLocaleLowerCase();
    if ( colourValue === '' ) {
        colourValue = vehicle.rows[0].colour;
    } 


    // Validate Model Id
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


    // Validate Motor Id
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


    // Validate Brand Id
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
        UPDATE vehicles AS v 
            SET transmission = $1, typeofvehicle = $2, typesoffuel = $3, colour = $4, model_id = $5, motor_id = $6, brand_id = $7
            WHERE v.vehicle_id = ${ id }
    `, [ transmissionValue, typeOfVehicleValue, typeOfFuelValue, colourValue, model_id, motor_id, brand_id ]);
    if ( response.rowCount === 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'Error when trying to modify the vehicle'
        });
    }


    return res.status(200).json({
        ok: true,
        msg: 'The vehicle was successfully modified',
        body: {
            vehicle: {
                transmission: transmissionValue,
                typeofvehicle: typeOfVehicleValue,
                typesoffuel: typeOfFuelValue,
                colour: colourValue,
                model: modelValue.rows,
                motor: motorValue.rows,
                brand: brandValue.rows
            }
        }
    });
}


export const deleteVehicleLogical = async( req: Request, res: Response ): Promise<Response> => {

    const { id } = req.params;
    const idVehicle: number = parseInt(id);

    if ( id === undefined || idVehicle.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }

    let state: boolean = true;

    const vehicle: QueryResult = await pool.query(`SELECT * FROM vehicles AS v WHERE v.vehicle_id = ${ id } `);
    if ( vehicle.rowCount === 0) {
        return res.status(400).json({
            ok: false,
            msg: `No vehicle was found with the id entered. Id: ${ id }`
        });
    } 

    if ( vehicle.rows[0].state === true ) {

        state = false;

        const response: QueryResult = await pool.query(` 
            UPDATE vehicles AS v
            SET state = $1
            WHERE v.vehicle_id = ${ id }
        `, [ state ]);

        if ( response.rowCount === 0 ) {
            return res.status(400).json({
                ok: false,
                msg: 'Error trying to remove vehicle'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'The vehicle was removed successfully'
        });

    } else {

        state = true;

        const response: QueryResult = await pool.query(` 
            UPDATE vehicles AS v
            SET state = $1
            WHERE v.vehicle_id = ${ id }
        `, [ state ]);

        if ( response.rowCount === 0 ) {
            return res.status(400).json({
                ok: false,
                msg: 'Error trying to restore the vehicle'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'The vehicle was restored correctly'
        });

    }
}


export const deleteVehiclePhysical = async( req: Request, res: Response ): Promise<Response> => {

    const id: number = parseInt( req.params.id );

    if ( id === undefined || id.toString() === 'NaN'  ) {
        return res.status(400).json({
            ok: false,
            msg: 'I did not enter a valid id'
        });
    }


    const vehicle: QueryResult = await pool.query(`SELECT * FROM vehicles AS v WHERE v.vehicle_id = ${ id } `);
    if ( vehicle.rowCount === 0) {
        return res.status(400).json({
            ok: false,
            msg: `No vehicle was found with the id entered. Id: ${ id }`
        });
    } 

    const response = vehicle.rows[0];

    await pool.query(`DELETE FROM vehicles AS v WHERE v.vehicle_id = ${ id }`);

    return res.status(200).json({
        ok: true,
        msg: 'The vehicle was removed successfully',
        vehicle: response
    });
}