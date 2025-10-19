DROP SCHEMA IF EXISTS ccca CASCADE;

CREATE SCHEMA ccca;

CREATE TABLE ccca.accounts (
	account_id UUID PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	cpf TEXT NOT NULL,
	car_plate TEXT NULL,
	is_passenger BOOLEAN NOT NULL DEFAULT false,
	is_driver boolean NOT NULL DEFAULT false,
	password TEXT NOT NULL
);

CREATE TABLE ccca.rides (
	ride_id uuid,
	passenger_id uuid,
	driver_id uuid,
	status text,
	fare numeric,
	distance numeric,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
	date timestamp
);

CREATE TABLE ccca.positions (
	position_id uuid PRIMARY KEY NOT NULL,
	ride_id uuid NOT NULL,
	lat numeric NOT NULL,
	long numeric NOT NULL
);
