DROP DATABASE IF EXISTS mapApp;
CREATE DATABASE mapApp;
USE mapApp;

CREATE TABLE Manufacturer
(
    manufacturerUsername VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY (manufacturerUsername)
);

CREATE TABLE Client
(
    clientUsername VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY (clientUsername)
);

CREATE TABLE Address
(
    addressId INT NOT NULL AUTO_INCREMENT,
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    building VARCHAR(10) NOT NULL,
    flat INT,
    lon DOUBLE NOT NULL,
    lat DOUBLE NOT NULL,
    PRIMARY KEY (addressId)
);

CREATE TABLE OrderData
(
    orderId INT NOT NULL AUTO_INCREMENT,
    manufacturerUsername VARCHAR(255) NOT NULL,
    clientUsername VARCHAR(255) NOT NULL,
    shipmentAddressId INT NOT NULL,
    deliveryAddressId INT NOT NULL,
    PRIMARY KEY (orderId),
    FOREIGN KEY (manufacturerUsername) REFERENCES Manufacturer(manufacturerUsername),
    FOREIGN KEY (clientUsername) REFERENCES Client(clientUsername),
    FOREIGN KEY (shipmentAddressId) REFERENCES Address(addressId),
    FOREIGN KEY (deliveryAddressId) REFERENCES Address(addressId)
);

CREATE TABLE AsShipmentAddress
(
    addressId INT NOT NULL,
    manufacturerUsername VARCHAR(255) NOT NULL,
    PRIMARY KEY (addressId, manufacturerUsername),
    FOREIGN KEY (addressId) REFERENCES Address(addressId),
    FOREIGN KEY (manufacturerUsername) REFERENCES Manufacturer(manufacturerUsername)
);

CREATE TABLE AsDeliveryAddress
(
    addressId INT NOT NULL,
    clientUsername VARCHAR(255) NOT NULL,
    PRIMARY KEY (addressId, clientUsername),
    FOREIGN KEY (addressId) REFERENCES Address(addressId),
    FOREIGN KEY (clientUsername) REFERENCES Client(clientUsername)
);

CREATE TABLE DATA
(
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    value VARCHAR(255),
    lastUpdated DATETIME DEFAULT NOW() ON UPDATE NOW()
);