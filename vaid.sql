create database vaid;

use vaid;

CREATE TABLE IF NOT EXISTS users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    address VARCHAR(100),
    age INT,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    role ENUM('user', 'admin') DEFAULT 'user'
);

DESCRIBE users;

INSERT INTO users (firstname, lastname, email, password, mobile, gender, address, age, blood_group, role)
VALUES('Admin', 'User', 'admin@gmail.com', 'admin123', '1234567890', 'male', 'admin-address', 30, 'O+', 'admin');

SELECT * FROM users WHERE email = 'admin@gmail.com';

SELECT * FROM users;




-- medical_request table --
CREATE TABLE medical_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    child_id INT DEFAULT NULL,
    illness VARCHAR(255),
    description TEXT,
    recommended_hospitals TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (child_id) REFERENCES children(id)
);



SELECT 
    medical_requests.*,
    CONCAT(
        IF(users.firstname IS NOT NULL, CONCAT(users.firstname, ' ', users.lastname), 'Unknown User'),
        IF(children.name IS NOT NULL AND children.name != '', 
           CONCAT(' (Child: ', children.name, ')'), 
           '')
    ) AS name
FROM medical_requests
LEFT JOIN users ON medical_requests.user_id = users.id
LEFT JOIN children ON medical_requests.child_id = children.id
WHERE (medical_requests.user_id = ? OR ? IS NULL);

SELECT id, user_id, child_id, illness FROM medical_requests WHERE child_id IS NOT NULL;


SELECT * FROM medical_requests;

UPDATE medical_requests mr
JOIN children c ON mr.child_id = c.id
SET mr.user_id = c.user_id
WHERE mr.user_id IS NULL AND mr.child_id IS NOT NULL;

SELECT * FROM medical_requests WHERE user_id IS NULL;

ALTER TABLE medical_requests MODIFY user_id INT NOT NULL;

ALTER TABLE medical_requests
ADD COLUMN child_id INT DEFAULT NULL,
ADD FOREIGN KEY (child_id) REFERENCES children(id);

DESCRIBE medical_requests;


drop table medical_requests;




-- search_history
CREATE TABLE history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, 
  search_query VARCHAR(255) NOT NULL,
  search_type ENUM('user', 'child', 'general') NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT * FROM history;
ALTER TABLE history ADD COLUMN recommended_hospitals TEXT;
SELECT * FROM history WHERE user_id = 4;
DESCRIBE history;
ALTER TABLE history ADD COLUMN child_name VARCHAR(255) DEFAULT NULL;
ALTER TABLE history
	ADD COLUMN child_id INT, 
	ADD FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE;





-- hospital details table-- 
CREATE TABLE hospitals(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact  VARCHAR(50) NOT NULL,
    specialties Text
);
INSERT INTO hospitals (name, location, contact, specialties) 
VALUES 
("Jayadeva Hospital", "Bengaluru, India", "+91-80-2697-6644", "cardiology, heart surgery"),
("Victoria Hospital", "Bengaluru, India", "+91-80-2670-0245", "emergency care, general medicine"),
("Bowring Hospital", "Bengaluru, India", "+91-80-2267-2920", "general medicine, surgery"),
("K.C General Hospital", "Bengaluru, India", "+91-80-2286-5555", "emergency care, general surgery"),
("Bengaluru City Hospital", "Bengaluru, India", "+91-80-2657-6567", "cardiology, orthopedics"),
("Jayanagar General Hospital", "Bengaluru, India", "+91-80-2654-6345", "general medicine, surgery"),
("Bengaluru Delivery Hospital", "Bengaluru, India", "+91-80-2322-5777", "obstetrics, gynecology, delivery"),
("BMCRI Super Specialty", "Bengaluru, India", "+91-80-2222-3456", "cardiology, nephrology, orthopedics"),
("Govt UPHC", "Bengaluru, India", "+91-80-2345-6789", "general health, immunization");

SELECT * FROM hospitals;
SELECT * FROM hospitals WHERE name = "Jayadeva Hospital";

drop table hospitals;


    


SELECT * FROM hospitals;


  
 

SELECT * FROM hospitals WHERE name = 'Jayadeva Hospital';

-- feedback db 
CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comments TEXT
);

SELECT * FROM feedbacks;


-- child-registration db
CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM children;


SELECT * FROM children WHERE user_id = 4;


-- admin- manage_medical request
-- CREATE TABLE medical_requests (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     illness VARCHAR(255),
--     description TEXT,
--     recommended_hospitals TEXT,
--     request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );


-- SELECT 
--     medical_requests.id, 
--     medical_requests.illness, 
--     medical_requests.description, 
--     medical_requests.recommended_hospitals, 
--     medical_requests.request_date, 
--     -- users.first_name,  -- Fetching the user_name from the users table
--     users.email       -- Fetching the email from the users table
-- FROM medical_requests
-- JOIN users ON medical_requests.user_id = users.id;
-- SELECT * FROM medical_requests;

-- ALTER TABLE users ADD COLUMN reset_otp VARCHAR(10);
-- SELECT * FROM users;

-- ALTER TABLE medical_requests
-- ADD COLUMN child_id INT DEFAULT NULL,
-- ADD FOREIGN KEY (child_id) REFERENCES children(id);

-- DESCRIBE medical_requests;















