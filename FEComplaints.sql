CREATE TABLE FEcomplaints (
    id SERIAL PRIMARY KEY,  -- Unique ID for each complaint
    name VARCHAR(100) NOT NULL,  -- Renamed 'name' to match server-side code
    email VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    address VARCHAR(30) NOT NULL,
    issue TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Store submission time
);

--drop table FEcomplaints;--

select * from FEcomplaints; 