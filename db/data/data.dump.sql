DROP TABLE IF EXISTS "sales";
CREATE TABLE "public"."sales" (
    "customer" character varying(20) NOT NULL,
    "city" character varying(20) NOT NULL,
    "mount" numeric(10,2) NOT NULL
) WITH (oids = false);

INSERT INTO "sales" ("customer", "city", "mount") VALUES
('pepe',	'olivos',	10.00),
('pepe',	'quilmes',	15.00),
('tito',	'olivos',	14.00),
('fede',	'quilmes',	6.00),
('carlos',	'lanus',	3.00);

select * from sales;

select DISTINCT on (1)
city,customer
from sales
order by city,mount desc, customer asc;

delete from sales;

INSERT INTO "sales" ("customer", "city", "mount") VALUES
('pepe',	'olivos',	10.00),
('pepe',	'quilmes',	15.00),
('tito',	'olivos',	14.00),
('fede',	'quilmes',	15.00),
('carlos',	'lanus',	3.00);
select * from sales;

select DISTINCT on (1)
city,customer
from sales
order by city,mount desc, customer asc;

delete from sales;


INSERT INTO "sales" ("customer", "city", "mount") VALUES
('toto',	'olivos',	8.00),
('pepe',	'olivos',	10.00),
('fede',	'quilmes',	6.00),
('pepe',	'quilmes',	15.00),
('tito',	'olivos',	14.00),
('fede',	'quilmes',	6.00),
('carlos',	'lanus',	3.00),
('fede',	'quilmes',	6.00),
('toto',	'olivos',	7.00);

select * from sales;

select DISTINCT on (1)
city,customer
from sales
order by city,mount desc, customer asc;
