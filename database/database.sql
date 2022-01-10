\l :listar todas las bases de datos creadas

\c fistapi :seleccionar la base de datos a utilizar

\dt :listar todas las tablas

\d users :seleccionar la tabla


CREATE DATABASE vehicleapi;

CREATE TYPE transmission_enum AS
    ENUM('Manual','Automatic');

CREATE TYPE typeOfVehicle_enum AS
    ENUM('Urban', 'Subcompact', 'Hatchback', 'Family', 'Sedan', 'Saloon', 'Convertible', 'Coupe', 'MuscleCar',
        'Sport', 'GT', 'Minivan', 'SUV', 'OffRoad', 'Commercial', 'MotorHome', 'PickUp', 'Classic', 'OneOff',
        'Limousine');

CREATE TYPE typesOfFuel_enum AS
    ENUM('Gasoline', 'Diesel', 'Ethanol', 'GNC', 'Electricity', 'Hydrogen', 'Biodiesel', 'Methanol',
        'Gasoline_GNC', 'Gasoline_Electricity', 'Diesel_Biodiesel');

CREATE TABLE vehicles(
    vehicle_id SERIAL NOT NULL,
    transmission transmission_enum,
    typeOfVehicle typeOfVehicle_enum,
    typesOfFuel typesOfFuel_enum,
    colour VARCHAR(20) NOT NULL,
    state BOOLEAN,
    model_id INT NOT NULL,
    brand_id INT NOT NULL,
    motor_id INT NOT NULL,
    
    PRIMARY KEY(vehicle_id),

    CONSTRAINT fk_models
        FOREIGN KEY(model_id)
            REFERENCES models(model_id)
                ON DELETE CASCADE,
    
    CONSTRAINT fk_brands
        FOREIGN KEY(brand_id)
            REFERENCES brands(brand_id)
                ON DELETE CASCADE,

    CONSTRAINT fk_motors
        FOREIGN KEY(motor_id)
            REFERENCES motors(motor_id)
                ON DELETE CASCADE
);

CREATE TABLE models(
    model_id SERIAL NOT NULL,
    name VARCHAR(50) NOT NULL,
    version VARCHAR(30) NOT NULL,
    state BOOLEAN,

    PRIMARY KEY(model_id)
);

CREATE TABLE brands(
    brand_id SERIAL NOT NULL,
    name VARCHAR(50) NOT NULL,
    state BOOLEAN,

    PRIMARY KEY(brand_id)
);

CREATE TABLE motors(
    motor_id SERIAL NOT NULL,
    name VARCHAR(50) NOT NULL,
    displacement INT,
    version VARCHAR(30),
    state BOOLEAN,

    PRIMARY KEY(motor_id)
);

INSERT INTO motors(name, displacement, version, state)
    VALUES ('Corsa 1.4L MPFI', 1389, '4 en linea - 92cv 6000RPM', true),
           ('Corsa 1.6L GL', 1598, '4 en linea - 92cv 6000RPM', true),
           ('Corsa 1.8L GLS 16v', 1796, '4 en linea - 102cv 5200RPM', true),
           ('Onix 1.4L', 1389, '4 en linea - 98cv 5800RPM', true),
           ('Cruze 1.4L', 1399, '4 en linea - 153cv 5000RPM', true),
           ('AP-1600 VW 1.6L', 1596, '4 en linea - 82cv 6000RPM', true);

INSERT INTO brands(name, state)
    VALUES ('Chevrolet', true),
           ('Ford', true),
           ('Renault', true),
           ('Fiat', true),
           ('Volkswagen', true);

INSERT INTO models(name, version, state)
    VALUES('Onix', 'Activ', true),
          ('Onix', 'Joy LS', true),
          ('Onix', 'Joy LS+', true),
          ('Onix', 'LT', true),
          ('Onix', 'LTZ', true),
          ('Onix', 'LTZ AT', true),
          ('Corsa', 'Classic', true),
          ('Corsa', 'II', true),
          ('Corsa', 'Wagon', true),
          ('Gol', 'GL 1993', true);

INSERT INTO vehicles(transmission, typeOfVehicle, typesOfFuel, colour, state, model_id, brand_id, motor_id)
    VALUES('Manual', 'Sedan', 'Gasoline', 'Red', true , 1, 1, 2),
          ('Manual', 'Family', 'Gasoline', 'White', true, 9, 1, 2),
          ('Automatic', 'Sedan', 'Gasoline', 'Red', true, 6, 1, 3),
          ('Manual', 'Hatchback', 'Gasoline', 'Black', true, 10, 5, 6);
          

