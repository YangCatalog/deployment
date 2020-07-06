CREATE DATABASE IF NOT EXISTS yang_catalog;
GRANT ALL PRIVILEGES ON yang_catalog.* TO 'yang'@'%';

CREATE TABLE IF NOT EXISTS yang_catalog.users (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `ModelsProvider` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `AccessRightsSdo` varchar(255) DEFAULT NULL,
  `AccessRightsVendor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
);
CREATE TABLE IF NOT EXISTS yang_catalog.users_temp (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `ModelsProvider` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `AccessRightsSdo` varchar(255) DEFAULT NULL,
  `AccessRightsVendor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
);
CREATE TABLE IF NOT EXISTS yang_catalog.admin_users (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
);
