
CREATE TABLE facultypass (

    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);


INSERT INTO facultypass (username, password_hash)
VALUES ('rky@nerist.ac.in', 'welcomerky');

INSERT INTO facultypass (username, password_hash)
VALUES ('aky@nerist.ac.in', 'welcomeaky');

INSERT INTO facultypass (username, password_hash)
VALUES ('ymo@nerist.ac.in', 'welcomeymo');

INSERT INTO facultypass (username, password_hash)
VALUES ('pko@nerist.ac.in', 'welcomepko');

INSERT INTO facultypass (username, password_hash)
VALUES ('sjb@nerist.ac.in', 'welcomesjb');

INSERT INTO facultypass (username, password_hash)
VALUES ('atg@nerist.ac.in', 'welcomeatg');

INSERT INTO facultypass(username, password_hash)
VALUES ('mk@nerist.ac.in', 'welcomemk');

INSERT INTO facultypass (username, password_hash)
VALUES ('msk@nerist.ac.in', 'welcomemsk');

INSERT INTO facultypass (username, password_hash)
VALUES ('mjs@nerist.ac.in', 'welcomemjs');

INSERT INTO facultypass (username, password_hash)
VALUES ('kl@nerist.ac.in', 'welcomekl');


INSERT INTO facultypass (username, password_hash)
VALUES ('221100@nerist.ac.in', 'welcome221');



select * from facultypass;