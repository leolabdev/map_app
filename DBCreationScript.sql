DROP DATABASE IF EXISTS mapApp;
CREATE DATABASE mapApp;
USE mapApp;

CREATE TABLE Manufacturer
(
    manufacturerId INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY (manufacturerId)
);

CREATE TABLE Client
(
    clientId INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    PRIMARY KEY (clientId)
);

CREATE TABLE Address
(
    addressId INT NOT NULL AUTO_INCREMENT,
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
    manufacturerId INT NOT NULL,
    clientId INT NOT NULL,
    shipmentAddressId INT NOT NULL,
    deliveryAddressId INT NOT NULL,
    PRIMARY KEY (orderId),
    FOREIGN KEY (manufacturerId) REFERENCES Manufacturer(manufacturerId),
    FOREIGN KEY (clientId) REFERENCES Client(clientId),
    FOREIGN KEY (shipmentAddressId) REFERENCES Address(addressId),
    FOREIGN KEY (deliveryAddressId) REFERENCES Address(addressId)
);

CREATE TABLE AsShipmentAddress
(
    manufacturerId INT NOT NULL,
    addressId INT NOT NULL,
    PRIMARY KEY (manufacturerId, addressId),
    FOREIGN KEY (manufacturerId) REFERENCES Manufacturer(manufacturerId),
    FOREIGN KEY (addressId) REFERENCES Address(addressId)
);

CREATE TABLE AsDeliveryAddress
(
    addressId INT NOT NULL,
    clientId INT NOT NULL,
    PRIMARY KEY (addressId, clientId),
    FOREIGN KEY (addressId) REFERENCES Address(addressId),
    FOREIGN KEY (clientId) REFERENCES Client(clientId)
);