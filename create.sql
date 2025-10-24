DROP SCHEMA IF EXISTS ccca CASCADE;

CREATE SCHEMA ccca;

CREATE TABLE ccca.accounts (
	account_id UUID PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	cpf TEXT NOT NULL,
	car_plate TEXT NULL,
	is_passenger BOOLEAN NOT NULL DEFAULT false,
	is_driver BOOLEAN NOT NULL DEFAULT false,
	password TEXT NOT NULL
);

CREATE TABLE ccca.rides (
	ride_id UUID PRIMARY KEY NOT NULL,
	passenger_id UUID NOT NULL,
	driver_id UUID,
	status TEXT NOT NULL,
	fare NUMERIC,
	distance NUMERIC,
	from_lat NUMERIC,
	from_long NUMERIC,
	to_lat NUMERIC,
	to_long NUMERIC,
	date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE ccca.positions (
	position_id UUID PRIMARY KEY NOT NULL,
	ride_id UUID NOT NULL,
	lat NUMERIC NOT NULL,
	long NUMERIC NOT NULL
);
