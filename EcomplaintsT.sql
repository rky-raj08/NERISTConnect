CREATE TABLE Ecomplaints (
    id SERIAL PRIMARY KEY,  -- Unique ID for each complaint
    student_name VARCHAR(100) NOT NULL,  -- Renamed 'name' to match server-side code
    block_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    room_number VARCHAR(30) NOT NULL,
    issue TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Store submission time
);



select * from Ecomplaints; 