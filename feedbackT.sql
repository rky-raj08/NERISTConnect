CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);


select * FROM feedback