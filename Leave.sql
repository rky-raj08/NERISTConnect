/**
CREATE TABLE leave_applications (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    no_of_days TEXT NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    reason TEXT NOT NULL,
    substitution TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--drop table leave_applications;

select * FROM leave_applications;

*/

CREATE TABLE leave_applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    no_of_days TEXT NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    reason TEXT NOT NULL,
    substitution VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * FROM leave_applications;

drop table leave_applications;