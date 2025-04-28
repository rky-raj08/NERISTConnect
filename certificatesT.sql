CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    certificate_type VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE certificates
ALTER COLUMN certificate_type TYPE TEXT;


select * from certificates