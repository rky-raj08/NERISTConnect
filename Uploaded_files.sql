CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  filetype TEXT NOT NULL,
  location TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



select * from files;

