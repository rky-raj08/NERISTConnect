
CREATE TABLE accounts (

    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);


INSERT INTO accounts (username, password_hash)
VALUES ('221100@nerist.ac.in', 'welcomerky');

INSERT INTO accounts (username, password_hash)
VALUES ('221200@nerist.ac.in', 'welcomeaky');

INSERT INTO accounts (username, password_hash)
VALUES ('221067@nerist.ac.in', 'welcomepp');

INSERT INTO accounts (username, password_hash)
VALUES ('221147@nerist.ac.in', 'welcomeanup');

INSERT INTO accounts (username, password_hash)
VALUES ('221049@nerist.ac.in', 'welcomebp');

INSERT INTO accounts (username, password_hash)
VALUES ('322014@nerist.ac.in', 'welcomedarba');


/**
DELETE FROM accounts
WHERE username='ymo@nerist.ac.in';

*/

select * from accounts;

