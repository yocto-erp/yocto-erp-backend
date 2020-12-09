-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: yocto_erp
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acl_action`
--

DROP TABLE IF EXISTS `acl_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_action` (
  `id` int(11) NOT NULL,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moduleId` int(11) NOT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `acl_group`
--

DROP TABLE IF EXISTS `acl_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdById` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `acl_group_action`
--

DROP TABLE IF EXISTS `acl_group_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_group_action` (
  `groupId` int(11) NOT NULL,
  `actionId` int(11) NOT NULL,
  `type` int(11) DEFAULT '1',
  PRIMARY KEY (`groupId`,`actionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `acl_group_action_shop`
--

DROP TABLE IF EXISTS `acl_group_action_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_group_action_shop` (
  `groupId` int(11) NOT NULL,
  `actionId` int(11) NOT NULL,
  `shopId` bigint(20) NOT NULL,
  PRIMARY KEY (`groupId`,`actionId`,`shopId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `acl_module`
--

DROP TABLE IF EXISTS `acl_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_module` (
  `id` int(11) NOT NULL,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `asset` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `createdById` bigint(20) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ext` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_fileId_uindex` (`fileId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `audit`
--

DROP TABLE IF EXISTS `audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `audit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `actionId` int(11) NOT NULL,
  `companyId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `business_action`
--

DROP TABLE IF EXISTS `business_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `business_action` (
  `id` int(11) NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `company` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdDate` datetime DEFAULT NULL,
  `createdById` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company_configure`
--

DROP TABLE IF EXISTS `company_configure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `company_configure` (
  `companyId` bigint(20) NOT NULL,
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1: Number\n2: String\n3: JSON',
  PRIMARY KEY (`companyId`,`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company_person`
--

DROP TABLE IF EXISTS `company_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `company_person` (
  `companyId` bigint(20) NOT NULL,
  `personId` bigint(20) NOT NULL,
  PRIMARY KEY (`companyId`,`personId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company_shop`
--

DROP TABLE IF EXISTS `company_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `company_shop` (
  `companyId` bigint(20) NOT NULL,
  `shopId` bigint(20) NOT NULL,
  PRIMARY KEY (`shopId`,`companyId`),
  KEY `user_company_fk` (`companyId`),
  CONSTRAINT `user_company_fk` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`),
  CONSTRAINT `user_company_shop_shop_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shop` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cost`
--

DROP TABLE IF EXISTS `cost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cost` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL COMMENT 'IN: 1\nOUT: 2',
  `amount` decimal(16,2) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `createdById` bigint(20) DEFAULT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `processedDate` datetime DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  `partnerCompanyId` bigint(20) DEFAULT NULL,
  `partnerPersonId` bigint(20) DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `cost_companyId_createdById_processedDate_index` (`companyId`,`createdById`,`processedDate`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cost_asset`
--

DROP TABLE IF EXISTS `cost_asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cost_asset` (
  `costId` bigint(20) NOT NULL,
  `assetId` bigint(20) NOT NULL,
  PRIMARY KEY (`costId`,`assetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cost_purpose`
--

DROP TABLE IF EXISTS `cost_purpose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cost_purpose` (
  `costId` bigint(20) NOT NULL,
  `purposeId` int(11) NOT NULL,
  `relativeId` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`costId`,`purposeId`),
  CONSTRAINT `cost_purpose_cost_id_fk` FOREIGN KEY (`costId`) REFERENCES `cost` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_attachment`
--

DROP TABLE IF EXISTS `email_attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `email_attachment` (
  `emailId` bigint(20) unsigned NOT NULL,
  `id` int(11) NOT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `data` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`emailId`,`id`),
  CONSTRAINT `email_attachment_email_send_fk` FOREIGN KEY (`emailId`) REFERENCES `email_send` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_company`
--

DROP TABLE IF EXISTS `email_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `email_company` (
  `emailId` bigint(20) unsigned NOT NULL,
  `companyId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  PRIMARY KEY (`emailId`,`companyId`,`userId`),
  KEY `email_company_company_id_fk` (`companyId`),
  KEY `email_company_user_id_fk` (`userId`),
  CONSTRAINT `email_company_company_id_fk` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`),
  CONSTRAINT `email_company_email_send_id_fk` FOREIGN KEY (`emailId`) REFERENCES `email_send` (`id`),
  CONSTRAINT `email_company_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_gateway`
--

DROP TABLE IF EXISTS `email_gateway`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `email_gateway` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provider` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `configuration` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyId` bigint(20) NOT NULL,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_gateway_companyId_index` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_send`
--

DROP TABLE IF EXISTS `email_send`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `email_send` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `from` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `to` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `bcc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `subject` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` tinyint(4) DEFAULT NULL,
  `retry` int(11) DEFAULT NULL,
  `api_response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `sent_date` datetime DEFAULT NULL,
  `totalAttach` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_template`
--

DROP TABLE IF EXISTS `email_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `email_template` (
  `templateId` bigint(20) NOT NULL,
  `subject` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`templateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inventory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warehouseId` bigint(20) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL COMMENT 'IN: 1\nOUT: 2',
  `processedDate` datetime DEFAULT NULL,
  `companyId` bigint(20) NOT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `totalProduct` int(11) DEFAULT NULL,
  `createdById` bigint(20) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `inventory_createdById_companyId_index` (`createdById`,`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_detail`
--

DROP TABLE IF EXISTS `inventory_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inventory_detail` (
  `inventoryId` bigint(20) NOT NULL,
  `inventoryDetailId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` decimal(14,2) DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `unitId` int(11) DEFAULT NULL,
  `serialCode` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`inventoryId`,`inventoryDetailId`),
  CONSTRAINT `inventory_detail_inventory_id_fk` FOREIGN KEY (`inventoryId`) REFERENCES `inventory` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_purpose`
--

DROP TABLE IF EXISTS `inventory_purpose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inventory_purpose` (
  `inventoryId` bigint(20) NOT NULL,
  `purposeId` int(11) NOT NULL,
  `relativeId` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`inventoryId`,`purposeId`),
  CONSTRAINT `inventory_purpose_inventory_id_fk` FOREIGN KEY (`inventoryId`) REFERENCES `inventory` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_summary`
--

DROP TABLE IF EXISTS `inventory_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inventory_summary` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `productId` bigint(20) NOT NULL,
  `unitId` int(11) NOT NULL,
  `quantity` decimal(16,2) DEFAULT '0.00',
  `warehouseId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inventory_summary_index` (`warehouseId`,`productId`,`unitId`,`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_summary_serial`
--

DROP TABLE IF EXISTS `inventory_summary_serial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inventory_summary_serial` (
  `inventorySummaryId` bigint(20) NOT NULL,
  `serialCode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int(11) DEFAULT '0',
  PRIMARY KEY (`inventorySummaryId`,`serialCode`),
  CONSTRAINT `inventory_serial_inventory_summary_id_fk` FOREIGN KEY (`inventorySummaryId`) REFERENCES `inventory_summary` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `language` (
  `id` int(11) NOT NULL,
  `code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `language_code_uindex` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partnerPersonId` bigint(20) DEFAULT '0',
  `partnerCompanyId` bigint(20) DEFAULT '0',
  `type` tinyint(4) DEFAULT NULL COMMENT '1: Purchase Order\n2: Sale Order',
  `companyId` bigint(20) NOT NULL,
  `totalAmount` decimal(16,2) DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `shopId` bigint(20) NOT NULL DEFAULT '0',
  `processedDate` datetime DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `createdById` bigint(20) NOT NULL,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_company_shop__index` (`shopId`,`companyId`),
  KEY `order__date_index` (`companyId`,`createdDate`,`name`,`partnerCompanyId`,`partnerPersonId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_asset`
--

DROP TABLE IF EXISTS `order_asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_asset` (
  `orderId` bigint(20) NOT NULL,
  `assetId` bigint(20) NOT NULL,
  PRIMARY KEY (`orderId`,`assetId`),
  KEY `order_asset_asset_id_fk` (`assetId`),
  CONSTRAINT `order_asset_asset_id_fk` FOREIGN KEY (`assetId`) REFERENCES `asset` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_asset_order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_detail` (
  `orderId` bigint(20) NOT NULL,
  `orderDetailId` int(11) NOT NULL,
  `productId` bigint(20) DEFAULT NULL,
  `productUnitId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '0',
  `price` decimal(14,2) NOT NULL DEFAULT '0.00',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`orderId`,`orderDetailId`),
  CONSTRAINT `order_detail_order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `otp` (
  `clientId` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `expiredDate` datetime DEFAULT NULL,
  `verifiedDate` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT '0',
  `target` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetType` int(11) DEFAULT NULL,
  PRIMARY KEY (`clientId`,`code`,`target`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='One Time Password';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_company`
--

DROP TABLE IF EXISTS `partner_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `partner_company` (
  `companyId` bigint(20) NOT NULL,
  `partnerCompanyId` bigint(20) NOT NULL,
  PRIMARY KEY (`companyId`,`partnerCompanyId`),
  KEY `company_partner___fk` (`partnerCompanyId`),
  CONSTRAINT `company_own_id_fk` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`),
  CONSTRAINT `company_partner___fk` FOREIGN KEY (`partnerCompanyId`) REFERENCES `company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_company_person`
--

DROP TABLE IF EXISTS `partner_company_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `partner_company_person` (
  `partnerCompanyId` bigint(20) NOT NULL,
  `personId` bigint(20) NOT NULL,
  PRIMARY KEY (`partnerCompanyId`,`personId`),
  KEY `partner_company_person_person_id_fk` (`personId`),
  CONSTRAINT `partner_company_person_company_id_fk` FOREIGN KEY (`partnerCompanyId`) REFERENCES `company` (`id`) ON DELETE CASCADE,
  CONSTRAINT `partner_company_person_person_id_fk` FOREIGN KEY (`personId`) REFERENCES `person` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_person`
--

DROP TABLE IF EXISTS `partner_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `partner_person` (
  `companyId` bigint(20) NOT NULL,
  `personId` bigint(20) NOT NULL,
  PRIMARY KEY (`companyId`,`personId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gsm` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `sex` tinyint(4) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageId` bigint(20) DEFAULT NULL COMMENT 'Default image preview.',
  `priceBaseUnit` decimal(16,2) DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `companyId` bigint(20) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `createdById` bigint(20) DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT NULL,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_name_index` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_asset`
--

DROP TABLE IF EXISTS `product_asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product_asset` (
  `assetId` bigint(20) NOT NULL,
  `productId` bigint(20) NOT NULL,
  PRIMARY KEY (`productId`,`assetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_unit`
--

DROP TABLE IF EXISTS `product_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product_unit` (
  `productId` bigint(20) NOT NULL,
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT '1.00',
  PRIMARY KEY (`productId`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report_cost_daily`
--

DROP TABLE IF EXISTS `report_cost_daily`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `report_cost_daily` (
  `reportDate` date NOT NULL,
  `companyId` bigint(20) NOT NULL,
  `receipt` decimal(18,2) DEFAULT NULL,
  `payment` decimal(18,2) DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`reportDate`,`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop`
--

DROP TABLE IF EXISTS `shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shop` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` bigint(20) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `createdById` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `personId` bigint(20) NOT NULL,
  `companyId` bigint(20) NOT NULL,
  `studentId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alias` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherId` bigint(20) DEFAULT NULL,
  `motherId` bigint(20) DEFAULT NULL,
  `feePackage` tinyint(4) DEFAULT NULL,
  `scholarShip` decimal(5,2) DEFAULT NULL,
  `enableBus` bit(1) DEFAULT NULL,
  `toSchoolBusRoute` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `toHomeBusRoute` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enableMeal` bit(1) DEFAULT NULL,
  `joinDate` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL COMMENT '1: PENDING\n2: ACTIVE\n3: LEAVE',
  `createdById` bigint(20) DEFAULT NULL,
  `class` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT NULL,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_studentId_uindex` (`studentId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_monthly_fee`
--

DROP TABLE IF EXISTS `student_monthly_fee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_monthly_fee` (
  `id` binary(16) NOT NULL,
  `studentId` bigint(20) NOT NULL,
  `companyId` bigint(20) NOT NULL,
  `monthFee` int(11) DEFAULT NULL,
  `yearFee` int(11) DEFAULT NULL,
  `scholarShip` decimal(5,2) DEFAULT NULL,
  `scholarFee` decimal(12,2) DEFAULT NULL,
  `mealFee` decimal(12,2) DEFAULT NULL,
  `absentDay` int(11) DEFAULT NULL,
  `deduceTuition` decimal(12,2) DEFAULT NULL,
  `busFee` decimal(12,2) DEFAULT NULL,
  `beginningYearFee` decimal(12,2) DEFAULT NULL,
  `otherFee` decimal(12,2) DEFAULT NULL,
  `otherDeduceFee` decimal(12,2) DEFAULT NULL,
  `debt` decimal(12,2) DEFAULT '0.00',
  `remark` text COLLATE utf8mb4_unicode_ci,
  `status` tinyint(4) DEFAULT NULL COMMENT '1: NOT PAID\n2: PAID',
  `paidDate` datetime DEFAULT NULL,
  `paidInformation` text COLLATE utf8mb4_unicode_ci,
  `paidAmount` decimal(12,2) DEFAULT NULL,
  `sentToParent` bit(1) DEFAULT NULL,
  `emailId` bigint(20) DEFAULT NULL,
  `trialDate` int(11) DEFAULT NULL,
  `feePerMonth` decimal(12,2) DEFAULT NULL,
  `daysOfMonth` int(11) DEFAULT NULL,
  `absentDayFee` decimal(10,2) DEFAULT NULL,
  `trialDateFee` decimal(10,2) DEFAULT NULL,
  `totalAmount` decimal(12,2) DEFAULT NULL,
  `lastUpdatedDate` datetime DEFAULT NULL,
  `lastUpdatedById` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_monthly_fee_index` (`companyId`,`studentId`,`monthFee`,`yearFee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey`
--

DROP TABLE IF EXISTS `survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `companyId` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` text COLLATE utf8mb4_unicode_ci,
  `createdDate` datetime DEFAULT NULL,
  `createdById` bigint(20) NOT NULL DEFAULT '0',
  `lastModifiedDate` datetime DEFAULT NULL,
  `lastModifiedById` bigint(20) NOT NULL DEFAULT '0',
  `totalAnswer` int(11) DEFAULT NULL,
  `lastAnsweredDate` datetime DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1: Public\n2: Need email Verify\n3: Need SMS Verify',
  PRIMARY KEY (`id`),
  KEY `survey_companyId_createdByIdid_index` (`companyId`,`createdById`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_i18n`
--

DROP TABLE IF EXISTS `survey_i18n`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey_i18n` (
  `surveyId` bigint(20) NOT NULL,
  `languageId` int(11) NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci,
  `remark` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`surveyId`,`languageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_person`
--

DROP TABLE IF EXISTS `survey_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey_person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `surveyId` bigint(20) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `personId` bigint(20) DEFAULT NULL,
  `submittedDate` datetime DEFAULT NULL,
  `IP` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientAgent` text COLLATE utf8mb4_unicode_ci,
  `clientId` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` bigint(20) NOT NULL DEFAULT '0',
  `ipfsId` text COLLATE utf8mb4_unicode_ci,
  `blockchainId` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastUpdatedDate` datetime DEFAULT NULL,
  `languageId` int(11) DEFAULT NULL,
  `ageRange` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `survey_person_surveyId_personId_uindex` (`surveyId`,`personId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_person_answer`
--

DROP TABLE IF EXISTS `survey_person_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey_person_answer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `surveyPersonId` bigint(20) NOT NULL,
  `questionId` bigint(20) NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `survey_person_answer_survey_question_id_fk` (`questionId`),
  CONSTRAINT `survey_person_answer_survey_question_id_fk` FOREIGN KEY (`questionId`) REFERENCES `survey_question` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_question`
--

DROP TABLE IF EXISTS `survey_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey_question` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `surveyId` bigint(20) DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `type` int(11) DEFAULT NULL,
  `rightAnswer` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `introduction` text COLLATE utf8mb4_unicode_ci,
  `data` text COLLATE utf8mb4_unicode_ci,
  `priority` int(11) NOT NULL DEFAULT '0',
  `allowFilter` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_question_answer`
--

DROP TABLE IF EXISTS `survey_question_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey_question_answer` (
  `id` int(11) NOT NULL,
  `questionId` bigint(20) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `key` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`,`questionId`),
  UNIQUE KEY `survey_question_answer_questionId_key_uindex` (`questionId`,`key`),
  CONSTRAINT `survey_question_answer_survey_question_id_fk` FOREIGN KEY (`questionId`) REFERENCES `survey_question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_question_answer_i18n`
--

DROP TABLE IF EXISTS `survey_question_answer_i18n`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey_question_answer_i18n` (
  `surveyQuestionId` bigint(20) NOT NULL,
  `surveyQuestionAnswerId` int(11) NOT NULL,
  `languageId` int(11) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`surveyQuestionId`,`surveyQuestionAnswerId`,`languageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_question_i18n`
--

DROP TABLE IF EXISTS `survey_question_i18n`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `survey_question_i18n` (
  `surveyQuestionId` bigint(20) NOT NULL,
  `languageId` int(11) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `remark` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`surveyQuestionId`,`languageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `system_property`
--

DROP TABLE IF EXISTS `system_property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `system_property` (
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tagging`
--

DROP TABLE IF EXISTS `tagging`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tagging` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `companyId` bigint(20) DEFAULT NULL,
  `label` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` int(11) DEFAULT NULL,
  `lastUpdatedDate` datetime DEFAULT NULL,
  `color` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tagging_companyId_index` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tagging_item`
--

DROP TABLE IF EXISTS `tagging_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tagging_item` (
  `taggingId` bigint(20) NOT NULL,
  `itemType` int(11) NOT NULL,
  `itemId` bigint(20) NOT NULL,
  PRIMARY KEY (`taggingId`,`itemId`,`itemType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tagging_item_type`
--

DROP TABLE IF EXISTS `tagging_item_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tagging_item_type` (
  `id` int(11) NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `template` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `companyId` bigint(20) NOT NULL DEFAULT '0',
  `templateTypeId` int(11) DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `createdById` bigint(20) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `remark` text COLLATE utf8mb4_unicode_ci,
  `lastUpdatedDate` datetime DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1: Template\n2: Email Template',
  PRIMARY KEY (`id`),
  KEY `template_companyId_templateTypeId_index` (`companyId`,`templateTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `template_plugin_variables`
--

DROP TABLE IF EXISTS `template_plugin_variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `template_plugin_variables` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variables` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `template_type`
--

DROP TABLE IF EXISTS `template_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `template_type` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `template_type_plugin`
--

DROP TABLE IF EXISTS `template_type_plugin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `template_type_plugin` (
  `templateTypeId` int(11) NOT NULL,
  `templatePluginId` int(11) NOT NULL,
  PRIMARY KEY (`templateTypeId`,`templatePluginId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayName` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageUrl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pwd` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_active` tinyint(1) NOT NULL DEFAULT '0',
  `personId` bigint(20) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `gsm` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int(11) DEFAULT '1',
  `createdDate` datetime DEFAULT NULL,
  `createdById` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_uindex` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_activate`
--

DROP TABLE IF EXISTS `user_activate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_activate` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `active_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_inserted` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_company`
--

DROP TABLE IF EXISTS `user_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_company` (
  `userId` bigint(20) NOT NULL,
  `companyId` bigint(20) NOT NULL,
  PRIMARY KEY (`userId`,`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_configure`
--

DROP TABLE IF EXISTS `user_configure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_configure` (
  `userId` bigint(20) NOT NULL,
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1: String, 2: Number, 3: JSON',
  PRIMARY KEY (`userId`,`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_reset_password`
--

DROP TABLE IF EXISTS `user_reset_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_reset_password` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `token` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expired_time` datetime DEFAULT NULL,
  `confirmed` tinyint(1) DEFAULT NULL,
  `date_inserted` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_shop`
--

DROP TABLE IF EXISTS `user_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_shop` (
  `userId` bigint(20) NOT NULL,
  `shopId` bigint(20) NOT NULL,
  PRIMARY KEY (`userId`,`shopId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `warehouse` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `companyId` bigint(20) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `createdById` bigint(20) DEFAULT NULL,
  `lastModifiedDate` datetime DEFAULT NULL,
  `lastModifiedById` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'yocto_erp'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-09 15:53:17
-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: yocto_erp
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `acl_action`
--

LOCK TABLES `acl_action` WRITE;
/*!40000 ALTER TABLE `acl_action` DISABLE KEYS */;
INSERT INTO `acl_action` VALUES (1,'Create Product',1,NULL),(2,'Read Product',1,NULL),(3,'Update Product',1,NULL),(4,'Delete Product',1,NULL),(5,'Create Customer',2,NULL),(6,'Read Customer',2,NULL),(7,'Update Customer',2,NULL),(8,'Delete Customer',2,NULL),(9,'Create Sale Order',3,NULL),(10,'Read Sale Order',3,NULL),(11,'Update Sale Order',3,NULL),(12,'Delete Sale Order',3,NULL),(13,'Create Goods Receipt Note',4,NULL),(14,'Read Goods Receipt Note',4,NULL),(15,'Update Goods Receipt Note',4,NULL),(16,'Delete Goods Receipt Note',4,NULL),(17,'Create Warehouse',5,NULL),(18,'Read Warehouse',5,NULL),(19,'Update Warehouse',5,NULL),(20,'Delete Warehouse',5,NULL),(21,'Create Goods Issue Note',4,NULL),(22,'Read Goods Issue Note',4,NULL),(23,'Update Goods Issue Note',4,NULL),(24,'Delete Goods Issue Note',4,NULL),(25,'Create Purchase Order',3,NULL),(26,'Read Purchase Order',3,NULL),(27,'Update Purchase Order',3,NULL),(28,'Delete Purchase Order',3,NULL),(29,'Create Cost',6,NULL),(30,'Read Cost',6,NULL),(31,'Update Cost',6,NULL),(32,'Delete Cost',6,NULL);
/*!40000 ALTER TABLE `acl_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `acl_group`
--

LOCK TABLES `acl_group` WRITE;
/*!40000 ALTER TABLE `acl_group` DISABLE KEYS */;
INSERT INTO `acl_group` VALUES (1,'COMPANY_GROUP','Default group for master access',0),(2,'COMPANY_GROUP','Default group for master access',0),(3,'COMPANY_GROUP','Default group for master access',0);
/*!40000 ALTER TABLE `acl_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `acl_group_action`
--

LOCK TABLES `acl_group_action` WRITE;
/*!40000 ALTER TABLE `acl_group_action` DISABLE KEYS */;
INSERT INTO `acl_group_action` VALUES (1,1,3),(1,2,3),(1,3,3),(1,4,3),(1,5,3),(1,6,3),(1,7,3),(1,8,3),(1,9,3),(1,10,3),(1,11,3),(1,12,3),(1,13,3),(1,14,3),(1,15,3),(1,16,3),(1,17,3),(1,18,3),(1,19,3),(1,20,3),(1,44,3),(1,45,3),(1,46,3),(1,47,3),(2,1,3),(2,2,3),(2,3,3),(2,4,3),(2,5,3),(2,6,3),(2,7,3),(2,8,3),(2,9,3),(2,10,3),(2,11,3),(2,12,3),(2,13,3),(2,14,3),(2,15,3),(2,16,3),(2,17,3),(2,18,3),(2,19,3),(2,20,3),(2,44,3),(2,45,3),(2,46,3),(2,47,3),(3,1,3),(3,2,3),(3,3,3),(3,4,3),(3,5,3),(3,6,3),(3,7,3),(3,8,3),(3,9,3),(3,10,3),(3,11,3),(3,12,3),(3,13,3),(3,14,3),(3,15,3),(3,16,3),(3,17,3),(3,18,3),(3,19,3),(3,20,3),(3,21,3),(3,22,3),(3,23,3),(3,24,3),(3,25,3),(3,26,3),(3,27,3),(3,28,3),(3,29,3),(3,30,3),(3,31,3),(3,32,3),(3,44,3),(3,45,3),(3,46,3),(3,47,3);
/*!40000 ALTER TABLE `acl_group_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `acl_group_action_shop`
--

LOCK TABLES `acl_group_action_shop` WRITE;
/*!40000 ALTER TABLE `acl_group_action_shop` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_group_action_shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `acl_module`
--

LOCK TABLES `acl_module` WRITE;
/*!40000 ALTER TABLE `acl_module` DISABLE KEYS */;
INSERT INTO `acl_module` VALUES (1,'Product','Manage product.'),(2,'Customer','Manage customer'),(3,'Order','Manage Order'),(4,'Inventory','Manage inventory'),(5,'WareHouse','Manage Warehouse'),(6,'Cost','Manage Cost');
/*!40000 ALTER TABLE `acl_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (1,'adilchraudou.png',18759,'image/png','367dd5d5-e96e-4e7a-a9bc-19d9b7ad25a2',NULL,NULL,'2020-09-07 14:49:41',NULL),(2,'BankCard_1.jpeg',316736,'image/jpeg','1e1557c7-59ca-44a5-8205-fab983994827',NULL,NULL,'2020-09-07 14:49:41',NULL),(3,'BankCard_2.jpeg',330378,'image/jpeg','72859c27-4379-4a86-94f5-91e44b55c224',NULL,NULL,'2020-09-07 14:49:41',NULL),(4,'IMG_UPLOAD_20200511_104648.jpg',294615,NULL,'e3800dda-f688-4db3-be99-179f92497c02',1,NULL,'2020-11-05 04:44:42',NULL),(5,'IMG_UPLOAD_20200511_104735.jpg',324297,NULL,'5cdad8d5-97c9-4ae1-9d37-d131eb7b8330',1,NULL,'2020-11-05 04:44:42',NULL),(6,'IMG_UPLOAD_20200921_105942.jpg',238429,NULL,'bc2ae855-2170-4f76-853a-b8cbd57d8573',1,NULL,'2020-11-05 04:44:42',NULL),(7,'IMG_UPLOAD_20200526_154802.jpg',576211,NULL,'f5917dee-645e-4bc5-9a05-9047492cc703',1,NULL,'2020-11-05 04:44:42',NULL),(8,'IMG_UPLOAD_20200419_161942.jpg',703240,NULL,'3ce731ff-36da-41c7-8e13-76b71260b383',1,NULL,'2020-11-05 05:35:15',NULL),(9,'IMG_UPLOAD_20200405_155042.jpg',422418,NULL,'ef341427-6e8c-4dde-bebe-0f4058baedaf',1,NULL,'2020-11-05 05:35:15',NULL),(10,'IMG_UPLOAD_20200405_155001.jpg',387102,NULL,'b052a699-8329-4efb-9e70-17a9be010771',1,NULL,'2020-11-05 05:35:15',NULL),(11,'IMG_UPLOAD_20200419_162010.jpg',634304,NULL,'3d4d7173-7df0-4144-be4f-0bae137ceb47',1,NULL,'2020-11-05 05:35:15',NULL),(12,'IMG_UPLOAD_20200127_131209.jpg',296709,NULL,'b89de718-a58b-476d-b99f-6b404cef2343',1,NULL,'2020-11-05 05:35:15',NULL),(13,'IMG_UPLOAD_20200419_161926.jpg',710713,NULL,'60c49afb-4512-40cd-b755-fa3e7d851fb6',1,NULL,'2020-11-05 05:35:15',NULL),(14,'IMG_UPLOAD_20200405_155035.jpg',331507,NULL,'dc42982f-115a-4d19-9019-6abd33831e26',1,NULL,'2020-11-05 05:35:15',NULL),(15,'IMG_UPLOAD_20200419_172222.jpg',609105,NULL,'5bdd0d4c-7918-4c05-8363-6e57427e6743',1,NULL,'2020-11-05 05:35:15',NULL),(16,'IMG_UPLOAD_20200123_135351.jpg',438967,NULL,'38f10cc6-b8b1-4d00-9d65-7804b4d7e4f8',1,NULL,'2020-11-05 05:35:15',NULL),(17,'IMG_UPLOAD_20200405_161307.jpg',411776,NULL,'8396c072-3277-4b97-aed3-e2050ea4fb10',1,NULL,'2020-11-05 05:35:15',NULL),(18,'IMG_UPLOAD_20200511_104648.jpg',294615,'image/jpeg','8f841254-acb7-4b4f-a82b-d04a255e06f7',1,NULL,'2020-11-05 05:49:37',NULL),(19,'IMG_UPLOAD_20200405_155001.jpg',387102,'image/jpeg','b07c0198-21de-4ab0-8eea-dd9b126f884d',1,NULL,'2020-11-05 05:51:13',NULL),(20,'IMG_UPLOAD_20200921_105942.jpg',238429,'image/jpeg','1dfcd592-fe24-4fb2-8ba3-a22f845b9576',1,NULL,'2020-11-05 06:49:37',NULL),(21,'IMG_UPLOAD_20200511_104648.jpg',294615,'image/jpeg','98c7a12a-6818-4317-a0c6-f28e078078fa',1,NULL,'2020-11-05 08:22:30',NULL),(22,'1A9D2001-07F0-476B-93F2-B45904559445.jpg',4916996,'image/jpeg','fdd8bb64-1098-4b77-8bba-6da03c877f8d',1,NULL,'2020-11-06 05:34:35',NULL),(23,'75B50E71-A4BF-4342-80AE-02A390BD92A0.jpg',4416284,'image/jpeg','8cf8fe07-8f39-4633-a1cb-bc6c29f6c4d4',1,NULL,'2020-11-06 05:34:35',NULL),(24,'1D9096A5-4336-4964-BF29-DE33F02B493B.jpg',4233700,'image/jpeg','b9fff359-00c7-4bc7-bd7e-ad3d038981fd',1,NULL,'2020-11-06 05:40:33',NULL);
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `audit`
--

LOCK TABLES `audit` WRITE;
/*!40000 ALTER TABLE `audit` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `business_action`
--

LOCK TABLES `business_action` WRITE;
/*!40000 ALTER TABLE `business_action` DISABLE KEYS */;
INSERT INTO `business_action` VALUES (1,'Purchase Order'),(2,'Sale Order'),(3,'Warehouse Good Receipt'),(4,'Warehouse Good Issue'),(5,'Receipt Voucher'),(6,'Payment Voucher'),(7,'Student Fee');
/*!40000 ALTER TABLE `business_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'Harmony','0938130683','Testing','teseting','2020-09-11 15:17:14',2);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `company_person`
--

LOCK TABLES `company_person` WRITE;
/*!40000 ALTER TABLE `company_person` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `company_shop`
--

LOCK TABLES `company_shop` WRITE;
/*!40000 ALTER TABLE `company_shop` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cost`
--

LOCK TABLES `cost` WRITE;
/*!40000 ALTER TABLE `cost` DISABLE KEYS */;
INSERT INTO `cost` VALUES (2,'test',0,32434.00,NULL,2,'2020-09-20 14:29:46','2020-09-20 14:29:46','2020-09-20 14:29:46',NULL,NULL,NULL,''),(10,'Mua rèm ',2,5000000.00,1,2,'2020-09-21 07:11:09','2020-09-21 07:11:09','2020-09-21 07:11:09',NULL,NULL,NULL,'mua rèm cho lớp thầy Hùng.'),(11,'Thu tièn học phí tháng 9',1,5000000.00,1,2,'2020-09-21 07:11:57','2020-09-21 07:11:57','2020-09-21 07:11:57',NULL,NULL,NULL,'Từ ba Khoa'),(12,'Mua hoa cho khai giảng',1,500000.00,1,2,'2020-09-21 07:14:11','2020-09-21 07:14:11','2020-11-06 05:34:35',2,NULL,NULL,''),(13,'Phiếu thu 1',1,5000000.00,1,2,'2020-11-05 04:44:42','2020-11-05 04:44:42','2020-11-05 04:44:42',NULL,NULL,NULL,NULL),(14,'Phiếu chi 01',2,44646.00,1,2,'2020-11-05 05:35:15','2020-11-05 05:35:15','2020-11-05 05:35:15',NULL,NULL,NULL,NULL),(15,'Phiếu chi 02',2,243464646.00,1,2,'2020-11-05 05:49:37','2020-11-05 05:49:37','2020-11-05 05:49:37',NULL,NULL,NULL,NULL),(16,'Phiéue thu 03',1,546464.00,1,2,'2020-11-05 05:51:13','2020-11-05 05:51:13','2020-11-05 05:51:13',NULL,NULL,NULL,NULL),(17,'Jfhfh',2,64646.00,1,2,'2020-11-05 06:49:37','2020-11-05 06:49:37','2020-11-05 06:49:37',NULL,NULL,NULL,NULL),(18,'Mua rèm update 123465',NULL,5000000.00,1,2,'2020-11-05 08:22:30','2020-11-05 08:22:30','2020-11-05 08:25:50',2,NULL,NULL,NULL),(19,'Ios test 1',2,5453.00,1,2,'2020-11-06 05:40:33','2020-11-06 05:40:33','2020-11-06 05:40:33',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cost_asset`
--

LOCK TABLES `cost_asset` WRITE;
/*!40000 ALTER TABLE `cost_asset` DISABLE KEYS */;
INSERT INTO `cost_asset` VALUES (13,4),(13,5),(13,6),(13,7),(14,8),(14,9),(14,10),(14,11),(14,12),(14,13),(14,14),(14,15),(14,16),(14,17),(15,18),(16,19),(17,20),(18,21),(19,24);
/*!40000 ALTER TABLE `cost_asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cost_purpose`
--

LOCK TABLES `cost_purpose` WRITE;
/*!40000 ALTER TABLE `cost_purpose` DISABLE KEYS */;
/*!40000 ALTER TABLE `cost_purpose` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `email_attachment`
--

LOCK TABLES `email_attachment` WRITE;
/*!40000 ALTER TABLE `email_attachment` DISABLE KEYS */;
INSERT INTO `email_attachment` VALUES (20,0,1,'/Users/lephuoccanh/development/vietnam/yocto_erp/backend/test/files/Yocto ERP.pdf'),(49,0,1,'/Users/lephuoccanh/development/vietnam/yocto_erp/backend/app/renderFolder/Lê Phước Cảnh_20200112_095428_20200612_011257.pdf'),(50,0,1,'/Users/lephuoccanh/development/vietnam/yocto_erp/backend/app/renderFolder/Lê Phước Cảnh_20200112_095428_20200612_011257.pdf'),(53,0,1,'/Users/lephuoccanh/development/vietnam/yocto_erp/backend/app/renderFolder/Lê Phước Cảnh_20200112_095428_20200612_011257.pdf'),(54,0,1,'/Users/lephuoccanh/development/vietnam/yocto_erp/backend/app/renderFolder/Lê Phước Cảnh_20200112_095428_20200612_011257.pdf'),(55,0,1,'/Users/lephuoccanh/development/vietnam/yocto_erp/backend/app/renderFolder/Lê Phước Cảnh_20200112_095428_20200612_011257.pdf');
/*!40000 ALTER TABLE `email_attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `email_company`
--

LOCK TABLES `email_company` WRITE;
/*!40000 ALTER TABLE `email_company` DISABLE KEYS */;
INSERT INTO `email_company` VALUES (20,1,2,'2020-11-16 04:52:48'),(49,1,2,'2020-12-07 15:06:23'),(50,1,2,'2020-12-07 16:38:58'),(51,1,2,'2020-12-08 08:49:50'),(52,1,2,'2020-12-08 08:50:30'),(53,1,2,'2020-12-08 08:52:19'),(54,1,2,'2020-12-08 08:53:13'),(55,1,2,'2020-12-08 08:55:50');
/*!40000 ALTER TABLE `email_company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `email_gateway`
--

LOCK TABLES `email_gateway` WRITE;
/*!40000 ALTER TABLE `email_gateway` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_gateway` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `email_template`
--

LOCK TABLES `email_template` WRITE;
/*!40000 ALTER TABLE `email_template` DISABLE KEYS */;
INSERT INTO `email_template` VALUES (9,'Testing'),(10,'tets 324'),(11,'teste3');
/*!40000 ALTER TABLE `email_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'test',2,2,'2020-09-23 16:22:58',1,'',2,2,'2020-09-23 16:23:19',NULL,'2020-09-23 16:23:19'),(2,'test output',2,1,'2020-09-23 16:23:31',1,'',1,2,'2020-09-23 16:24:39',NULL,'2020-09-23 16:24:39');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory_detail`
--

LOCK TABLES `inventory_detail` WRITE;
/*!40000 ALTER TABLE `inventory_detail` DISABLE KEYS */;
INSERT INTO `inventory_detail` VALUES (1,1,2,15.00,'',1,'chen001'),(1,2,2,1.00,'',2,'chen002'),(2,1,2,25.00,'',1,'chen001');
/*!40000 ALTER TABLE `inventory_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory_purpose`
--

LOCK TABLES `inventory_purpose` WRITE;
/*!40000 ALTER TABLE `inventory_purpose` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_purpose` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory_summary`
--

LOCK TABLES `inventory_summary` WRITE;
/*!40000 ALTER TABLE `inventory_summary` DISABLE KEYS */;
INSERT INTO `inventory_summary` VALUES (1,2,1,90.00,2,1,'2020-09-23 16:24:39',2);
/*!40000 ALTER TABLE `inventory_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory_summary_serial`
--

LOCK TABLES `inventory_summary_serial` WRITE;
/*!40000 ALTER TABLE `inventory_summary_serial` DISABLE KEYS */;
INSERT INTO `inventory_summary_serial` VALUES (1,'chen001',-10),(1,'chen002',100);
/*!40000 ALTER TABLE `inventory_summary_serial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES (1,'en','English'),(2,'ja','Japanese');
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,'test',NULL,NULL,2,1,32434.00,'tếtts',0,'2020-11-12 04:50:37','2020-11-12 04:50:37',2,NULL,NULL);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_asset`
--

LOCK TABLES `order_asset` WRITE;
/*!40000 ALTER TABLE `order_asset` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (1,1,3,1,1,32434.00,'tét');
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `otp`
--

LOCK TABLES `otp` WRITE;
/*!40000 ALTER TABLE `otp` DISABLE KEYS */;
INSERT INTO `otp` VALUES ('1201cf2f-6f4d-482e-a773-879053874f9f','173WMA','2020-11-24 08:15:42','2020-11-25 08:15:42',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','7YDQQV','2020-11-24 08:08:34','2020-11-25 08:08:34',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','FWFP6Q','2020-11-24 04:03:57','2020-11-25 04:03:57',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','GVJ1XF','2020-11-23 04:21:03','2020-11-24 04:21:03',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','NZQBAC','2020-11-24 07:47:08','2020-11-25 07:47:08',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','o9qOI5','2020-11-18 15:46:02','2020-11-20 06:29:51',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','SJVUAB','2020-11-24 08:04:55','2020-11-25 08:04:55',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','TC7OVQ','2020-11-24 10:30:51','2020-11-25 10:30:51',NULL,1,'lephuoccanh@gmail.com',1),('1201cf2f-6f4d-482e-a773-879053874f9f','Z8HKS5','2020-11-24 10:59:42','2020-11-25 10:59:42',NULL,1,'lephuoccanh@gmail.com',1),('1324324','S7MQ65','2020-11-22 09:57:57','2020-11-23 09:57:57',NULL,1,'lephuoccanh@gmail.ccom',1),('1324324','Y5JZYV','2020-11-22 09:58:48','2020-11-23 09:58:48',NULL,1,'lephuoccanh@gmail.com',1),('5e5c0297-6d96-46ad-a0be-fa64ff04a345','NYKBB3','2020-11-26 09:06:21','2020-11-27 09:06:21',NULL,1,'lephuocccanh@gmail.com',1),('5e5c0297-6d96-46ad-a0be-fa64ff04a345','RRALQV','2020-11-26 09:06:04','2020-11-27 09:06:04',NULL,1,'lephuoccanh@gmail.om',1),('d80c12d8-3a84-48ee-aeff-7ad5516bba3d','0Y6RTB','2020-12-03 08:53:27','2020-12-04 08:53:27',NULL,1,'info@yoctoerp.com',1),('d80c12d8-3a84-48ee-aeff-7ad5516bba3d','DX9RC1','2020-12-04 08:46:13','2020-12-05 08:46:13',NULL,1,'lephuoccanh@outlook.com',1),('d80c12d8-3a84-48ee-aeff-7ad5516bba3d','W2CKG3','2020-12-03 08:43:42','2020-12-04 08:43:42',NULL,1,'lephuoccanh@cartomat.com',1),('d80c12d8-3a84-48ee-aeff-7ad5516bba3d','YI4L7Q','2020-12-04 14:17:39','2020-12-05 14:17:39',NULL,1,'lephuoccanh@outlook.com',1);
/*!40000 ALTER TABLE `otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `partner_company`
--

LOCK TABLES `partner_company` WRITE;
/*!40000 ALTER TABLE `partner_company` DISABLE KEYS */;
/*!40000 ALTER TABLE `partner_company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `partner_company_person`
--

LOCK TABLES `partner_company_person` WRITE;
/*!40000 ALTER TABLE `partner_company_person` DISABLE KEYS */;
/*!40000 ALTER TABLE `partner_company_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `partner_person`
--

LOCK TABLES `partner_person` WRITE;
/*!40000 ALTER TABLE `partner_person` DISABLE KEYS */;
INSERT INTO `partner_person` VALUES (1,1),(1,2);
/*!40000 ALTER TABLE `partner_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,'Le','Canh','0938130683','','',NULL,0,2,'2020-09-21 09:01:58',NULL),(2,'Đỗ Thị','Cam','','lephuoccanh@gmail.com','',NULL,1,2,'2020-10-11 16:47:15','test'),(5,'Lê Phước','Cảnh',NULL,NULL,NULL,'2020-10-11',NULL,2,'2020-10-11 16:48:18',NULL),(6,'Le','Canh',NULL,'lephuoccanh@gmail.com','06 Nguyen Duy Hieu',NULL,NULL,0,'2020-11-24 05:25:39',NULL),(7,'Le','Canh',NULL,'lephuoccanh@gmail.com','6 Nguyen Duy Hieu',NULL,NULL,0,'2020-11-24 07:49:28',NULL),(14,'Lê','Cảnh',NULL,'lephuoccanh@gmail.com','4/3 Thắng Nhì',NULL,NULL,0,'2020-11-24 09:09:07',NULL),(15,'Lê','Cảnh',NULL,'lephuoccanh@gmail.com','4/3 Thắng Nhì',NULL,NULL,0,'2020-11-24 10:33:11',NULL),(16,'Lê','Cảnh',NULL,'lephuoccanh@gmail.com','4/3 Thắng Nhì',NULL,NULL,0,'2020-11-24 11:07:27',NULL),(17,'Lê','Cảnh',NULL,'lephuoccanh@gmail.com','hokkaido',NULL,2,0,'2020-12-02 16:35:04',NULL),(18,'le','canh',NULL,'lephuoccanh@cartomat.com','aomori',NULL,0,0,'2020-12-03 08:48:11',NULL),(19,'Lê','Cảnh',NULL,'info@yoctoerp.com','hokkaido',NULL,1,0,'2020-12-03 09:00:00',NULL),(20,'Lê','Cảnh',NULL,'lephuoccanh@outlook.com','iwate',NULL,0,0,'2020-12-04 14:30:34',NULL);
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'NEWTECH 5',NULL,5555.00,'tseting create product',NULL,'2020-09-07 14:49:41',1,NULL,NULL),(3,'Đồ gỗ',NULL,54853443.00,'',1,'2020-11-12 04:42:06',2,NULL,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_asset`
--

LOCK TABLES `product_asset` WRITE;
/*!40000 ALTER TABLE `product_asset` DISABLE KEYS */;
INSERT INTO `product_asset` VALUES (1,1),(2,1),(3,1);
/*!40000 ALTER TABLE `product_asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_unit`
--

LOCK TABLES `product_unit` WRITE;
/*!40000 ALTER TABLE `product_unit` DISABLE KEYS */;
INSERT INTO `product_unit` VALUES (1,1,'teset',1.00),(3,1,'Cái',1.00);
/*!40000 ALTER TABLE `product_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `report_cost_daily`
--

LOCK TABLES `report_cost_daily` WRITE;
/*!40000 ALTER TABLE `report_cost_daily` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_cost_daily` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `shop`
--

LOCK TABLES `shop` WRITE;
/*!40000 ALTER TABLE `shop` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,5,1,'HS001','Tèo',NULL,2,0,NULL,_binary '','Home','CV293',_binary '','2020-10-12 16:45:58',1,2,'LOP5','2020-10-12 05:21:17',2,'2020-10-11 16:48:18');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `student_monthly_fee`
--

LOCK TABLES `student_monthly_fee` WRITE;
/*!40000 ALTER TABLE `student_monthly_fee` DISABLE KEYS */;
INSERT INTO `student_monthly_fee` VALUES (_binary '�\�\0\0\0\0\0\0\0\0\0\0\0\0',1,1,12,2020,7.00,350000.00,3800000.00,3,NULL,500000.00,NULL,700000.00,230000.00,0.00,'Testing Student fee',NULL,NULL,NULL,NULL,NULL,NULL,4,5000000.00,NULL,697500.00,2000000.00,10722500.00,NULL,NULL),(_binary 'D.��\0\0\0\0\0\0\0\0\0\0\0\0',1,1,11,2020,20.00,1000000.00,4400000.00,0,NULL,500000.00,NULL,0.00,0.00,0.00,'Testing update',NULL,NULL,NULL,NULL,NULL,NULL,0,5000000.00,NULL,0.00,0.00,8900000.00,'2020-12-01 14:54:28',2);
/*!40000 ALTER TABLE `student_monthly_fee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey`
--

LOCK TABLES `survey` WRITE;
/*!40000 ALTER TABLE `survey` DISABLE KEYS */;
INSERT INTO `survey` VALUES (1,0,'American Conservative CPAC',NULL,'2020-11-18 11:24:51',0,NULL,0,NULL,NULL,1),(2,0,'Testing Survey','Testing Survey','2020-11-18 06:40:11',0,NULL,0,0,NULL,NULL),(3,0,'Testing Survey','Testing Survey','2020-11-18 06:44:24',0,NULL,0,0,NULL,NULL),(4,0,'Testing Survey','Testing Survey','2020-11-18 06:44:46',0,NULL,0,0,NULL,NULL),(5,0,'Testing Survey','Testing Survey','2020-11-18 06:45:45',0,NULL,0,0,NULL,NULL),(6,0,'American Conservative CPAC','Testing Survey','2020-11-18 06:51:38',0,NULL,0,0,NULL,2),(7,0,'American Conservative CPAC','Testing Survey','2020-11-18 06:56:50',0,NULL,0,0,NULL,2),(8,0,'American Conservative CPAC','Testing Survey','2020-11-18 06:58:01',0,NULL,0,0,NULL,2),(9,0,'CPAC Japan 2020','日本最大級の国際政治カンファレンス。','2020-12-02 08:38:00',0,NULL,0,0,NULL,1),(10,0,'CPAC Japan 2020','日本最大級の国際政治カンファレンス。','2020-12-02 08:38:29',0,NULL,0,0,NULL,1),(11,0,'CPAC Japan 2020','日本最大級の国際政治カンファレンス。','2020-12-02 08:39:28',0,NULL,0,0,NULL,2);
/*!40000 ALTER TABLE `survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey_i18n`
--

LOCK TABLES `survey_i18n` WRITE;
/*!40000 ALTER TABLE `survey_i18n` DISABLE KEYS */;
INSERT INTO `survey_i18n` VALUES (11,1,'CPAC Japan 2020','Japan\'s largest international political conference.');
/*!40000 ALTER TABLE `survey_i18n` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey_person`
--

LOCK TABLES `survey_person` WRITE;
/*!40000 ALTER TABLE `survey_person` DISABLE KEYS */;
INSERT INTO `survey_person` VALUES (1,8,NULL,16,'2020-11-24 11:07:27','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36','1201cf2f-6f4d-482e-a773-879053874f9f',0,'QmeR94RDyktKYwWeyNvFTKvh3yXWQQptcX7xqogPsmi2Pq','0x4d9c869149d1ab74894cd080fb350aacc34e9052f59377707ec17070fba45c73','2020-11-24 15:36:02',NULL,NULL),(2,11,NULL,17,'2020-12-02 16:35:04','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36','1201cf2f-6f4d-482e-a773-879053874f9f',0,'QmUob2bjUyXNgMyE34pc2TdNL4jvFfLUcFsffuiM769Krx','0x31747b3d2926157927a3cafef793f96e97d5c0c1bd1874d4834994deded59562','2020-12-02 16:35:17',1,'Under 18'),(3,11,NULL,18,'2020-12-03 08:48:11','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36','d80c12d8-3a84-48ee-aeff-7ad5516bba3d',0,'QmYeu6k85XakG5byo7t7XTPsHe4CLAKmEoeFtqk7NvVDbV','0x2593c629dcfdc43cf747864b8b3224d427509af5298262245a4033cc658109fa','2020-12-03 08:48:17',1,'Under 20'),(4,11,NULL,19,'2020-12-03 09:00:00','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36','d80c12d8-3a84-48ee-aeff-7ad5516bba3d',0,'QmeYoZVRCSyGF2rE6MQPi2fwkPGNsG49UGVYdPhd5ekMN2','0x8cadce0fd36e9e66e9527186f2cc494aaac8d6d90681ca60a63292fa06b13378','2020-12-03 09:00:15',1,'Under 20'),(5,11,NULL,20,'2020-12-04 14:30:34','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36','d80c12d8-3a84-48ee-aeff-7ad5516bba3d',0,'QmeVcbYAxC6LJRd3k3GF7D1GbxEoWZCb4m4B8oBzJjSH2B','0x1a5dcd68a4351a507ea209529c1b17117bb4791c2f12614383e02ad52bf816e8','2020-12-04 14:30:47',2,'21-30');
/*!40000 ALTER TABLE `survey_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey_person_answer`
--

LOCK TABLES `survey_person_answer` WRITE;
/*!40000 ALTER TABLE `survey_person_answer` DISABLE KEYS */;
INSERT INTO `survey_person_answer` VALUES (1,1,11,'Re-opening schools'),(2,1,11,'Second Amendment Rights'),(3,1,11,'Supporting law enforcement'),(4,1,12,'Not that confident'),(5,1,13,'Somewhat disapprove'),(6,1,14,'OPPOSE'),(7,1,15,'Somewhat oppose'),(8,1,16,'Strongly oppose'),(9,1,17,'Good job'),(10,1,18,'About Right'),(11,1,19,'Somewhat More Likely'),(12,1,20,'Strongly oppose'),(13,1,21,'Somewhat support'),(14,1,22,'Google should not be allowed to censor and remove content because they are a publisher'),(15,1,23,'Unsure'),(16,1,24,'Somewhat disagree'),(17,1,25,'Unsure'),(18,1,26,'Not that important'),(19,1,27,'Female'),(20,1,28,'Strongly agree'),(21,1,29,'18-25'),(22,2,35,'JCU Website'),(23,2,36,'Standoff and Protecting Intellectual Property Rights'),(24,2,37,'IT'),(25,2,38,'I don\'t know'),(26,2,39,'Slightly Support'),(27,3,35,'Word Of Mouth'),(28,3,36,'Culture and Virtues'),(29,3,37,'Governmental Organizational Reform'),(30,3,38,'Oppose'),(31,3,39,'Slightly Support'),(32,4,35,'Word Of Mouth'),(33,4,36,'Energy Geopolitics at a Crossroads'),(34,4,37,'Digitalization of Government'),(35,4,38,'I don\'t know'),(36,4,39,'Slightly Support'),(37,5,35,'Other'),(38,5,36,'Post-Corona and Japan Future'),(39,5,37,'IT'),(40,5,38,'Support'),(41,5,39,'Oppose');
/*!40000 ALTER TABLE `survey_person_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey_question`
--

LOCK TABLES `survey_question` WRITE;
/*!40000 ALTER TABLE `survey_question` DISABLE KEYS */;
INSERT INTO `survey_question` VALUES (1,1,'From the following list of issue areas, please indicate the TOP THREE that are most important to you',2,'',NULL,'{\"max\": 3}',0,NULL),(11,8,'From the following list of issue areas, please indicate the TOP THREE that are most important to you',2,NULL,NULL,'{\"max\":3}',0,NULL),(12,8,'How confident are you that President Trump will win re-election and defeat Joe Biden ?',1,NULL,NULL,NULL,0,NULL),(13,8,'Do you approve or disapprove of the job that Donald Trump is doing as President ?',1,NULL,NULL,NULL,0,NULL),(14,8,'Which of the following comes closest to your own personal opinion ?',1,NULL,NULL,NULL,0,NULL),(15,8,'Do you support or oppose President Trump\'s Supreme Court nominee Amy Coney Barrett having a confirmation vote before the presidential election ?',1,NULL,NULL,NULL,0,NULL),(16,8,'Do you support or oppose a nationwide mask mandate, which would require all Americans to wear masks indoors during public gatherings ?',1,NULL,NULL,NULL,0,NULL),(17,8,'The Trump Administration launched operation Warp Speed to develop a coronavirus vaccine. Do you think President Trump did a very good job, a good Job, a bad job or a very bad job on the process of developing a coronavirus vaccine ?',1,NULL,NULL,NULL,0,NULL),(18,8,'In response to the coronavirus, have local and state Governments been to slow to open up, too fast to open up or about right in opening up in response to the coronavirus ?',1,NULL,NULL,NULL,0,NULL),(19,8,'Switching to some different issues now ... <br/><br/>\n\nWould you be more likely or lesss likely to support a company that donates money to the organization Black Lives Matter Incorporated ?',1,NULL,NULL,NULL,0,NULL),(20,8,'If coronavirus case increase rapidly, do you support or oppose another economic shutdown to try to stop the spread of the virus ?',1,NULL,NULL,NULL,0,NULL),(21,8,'Due to the Coronavirus Pandemic there has been growing push by Democrat Governors to conduct the presidential election largely by mail-in voter. Do you support or oppose of states mostly using mail-in voting insteead of in person voting for elections this year ?',1,NULL,NULL,NULL,0,NULL),(22,8,'Section 230 of the Communications Decency Act gives Google immunity because they are a platform and not considered a publisher of content. Some claim that Google acts as a publisher because they remove content and censor information. Do you think that Google should be protected by Section 230 and should be treated as a platform, or should they not allowed to censor and remove content because they are a publisher ?',1,NULL,NULL,NULL,0,NULL),(23,8,'If Socialist Democrats succeed in defunding our police departments, it is likely that you will have to be your own first responder in an emergency. In this possible scenario do you think the Government should increase gun restrictions, decrease gun restrictions, or keep gun laws as they are now ?',1,NULL,NULL,NULL,0,NULL),(24,8,'Please indicate if you agree or disagree with the following statement<br/><br/>It\'s is important for Israel to maintain control of the \"West Bank\" in order to ensure peace and security in the Middle East, especially for Judeo-Christian heritage sites ?',1,NULL,NULL,NULL,0,NULL),(25,8,'And lastly, switching topics now to Israel and the Middle East ... <br/>As you may know, President Trump negotiated a peace deal between Israel and the Muslim countries of the United Arab Emirates and Bahrain. As of result of this historic diplomatic achievement, do you think President Trump should receive the Nobel Peace Prize ?',1,NULL,NULL,NULL,0,NULL),(26,8,'For the safety and security of the Middle East, how important is it to you that Israel assert and maintain sovereignty over the country\'s strategic high ground and Judeo-Christian heritage sites ?',1,NULL,NULL,NULL,0,NULL),(27,8,'What is your gender ?',1,NULL,NULL,NULL,0,_binary ''),(28,8,'Please indicate if you agree or disagree with the following statement<br/> Palestinians would protect freedom of religion and freedom of worship for all faiths in the Middle East',1,NULL,NULL,NULL,0,NULL),(29,8,'Before we finish, please answer a few short demographic questions for classification purposes only. <br/>Into which of the following categoriees does your age fall ?',1,NULL,NULL,NULL,0,_binary ''),(30,10,'CPAC Japan2020のことはどこで知りましたか',1,NULL,NULL,NULL,0,NULL),(31,10,'CPAC Japan2020で期待しているセッションはなんですか',1,NULL,NULL,NULL,0,NULL),(32,10,'日本が現在抱える問題で最も重視するものはなんですか',1,NULL,NULL,NULL,0,NULL),(33,10,'アメリカ大統領選挙において、ジョー・バイデンを打ち負かしてトランプ大統領が再選することを支持しますか',1,NULL,NULL,NULL,0,NULL),(34,10,'コロナウィルスが今以上に急速に拡大した場合、緊急事態宣言を再び行うことを支持しますか',1,NULL,NULL,NULL,0,NULL),(35,11,'CPAC Japan2020のことはどこで知りましたか',1,NULL,NULL,NULL,0,NULL),(36,11,'CPAC Japan2020で期待しているセッションはなんですか',1,NULL,NULL,NULL,0,NULL),(37,11,'日本が現在抱える問題で最も重視するものはなんですか',1,NULL,NULL,NULL,0,NULL),(38,11,'アメリカ大統領選挙において、ジョー・バイデンを打ち負かしてトランプ大統領が再選することを支持しますか',1,NULL,NULL,NULL,0,NULL),(39,11,'コロナウィルスが今以上に急速に拡大した場合、緊急事態宣言を再び行うことを支持しますか',1,NULL,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `survey_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey_question_answer`
--

LOCK TABLES `survey_question_answer` WRITE;
/*!40000 ALTER TABLE `survey_question_answer` DISABLE KEYS */;
INSERT INTO `survey_question_answer` VALUES (1,11,'Healthcare Reform','Healthcare Reform'),(1,12,'Very confident','Very confident'),(1,13,'Strongly approve','Strongly approve'),(1,14,'Republicans in Congress should be doing more to SUPPORT President Trump','SUPPORT'),(1,15,'Strongly support','Strongly support'),(1,16,'Strongly support','Strongly support'),(1,17,'Very good job','Very good job'),(1,18,'Too Slow','Too Slow'),(1,19,'Much More Likely','Much More Likely'),(1,20,'Strongly support','Strongly support'),(1,21,'Strongly support','Strongly support'),(1,22,'Google should be protected by Section 230 and treated as a platform','Google should be protected by Section 230 and treated as a platform'),(1,23,'Increase Gun Restrictions','Increase Gun Restrictions'),(1,24,'Strongly agree','Strongly agree'),(1,25,'Yes','Yes'),(1,26,'Very important','Very important'),(1,27,'Male','Male'),(1,28,'Strongly agree','Strongly agree'),(1,29,'Under 18','Under 18'),(1,30,'JCUインサイト','JCU Insight'),(1,31,'オープニング/民主主義を守り抜け！','Opening/Fighting for Election Integrity'),(1,32,'共和党員とのアポイントメント','Declining Birthrate'),(1,33,'支持する','Support'),(1,34,'支持する','Support'),(1,35,'JCUインサイト','JCU Insight'),(1,36,'オープニング/民主主義を守り抜け！','Opening/Fighting for Election Integrity'),(1,37,'共和党員とのアポイントメント','Declining Birthrate'),(1,38,'支持する','Support'),(1,39,'支持する','Support'),(2,11,'Re-opening schools','Re-opening schools'),(2,12,'Somewhat confident','Somewhat confident'),(2,13,'Somewhat approve','Somewhat approve'),(2,14,'Republicans in Congress should be doing more to OPPOSE President Trump','OPPOSE'),(2,15,'Somewhat support','Somewhat support'),(2,16,'Somewhat support','Somewhat support'),(2,17,'Good job','Good job'),(2,18,'Too Fast','Too Fast'),(2,19,'Somewhat More Likely','Somewhat More Likely'),(2,20,'Somewhat support','Somewhat support'),(2,21,'Somewhat support','Somewhat support'),(2,22,'Google should not be allowed to censor and remove content because they are a publisher','Google should not be allowed to censor and remove content because they are a publisher'),(2,23,'Decrease Gun Restrictions','Decrease Gun Restrictions'),(2,24,'Somewhat agree','Somewhat agree'),(2,25,'No','No'),(2,26,'Somewhat important','Somewhat important'),(2,27,'Female','Female'),(2,28,'Somewhat agree','Somewhat agree'),(2,29,'18-25','18-25'),(2,30,'知人','Word Of Mouth'),(2,31,'インド太平洋の安定に向けて～安全保障の未来～','The Future of Security Policy'),(2,32,'少子化','Education'),(2,33,'やや支持する','Slightly Support'),(2,34,'やや支持する','Slightly Support'),(2,35,'知人','Word Of Mouth'),(2,36,'インド太平洋の安定に向けて～安全保障の未来～','The Future of Security Policy'),(2,37,'少子化','Education'),(2,38,'やや支持する','Slightly Support'),(2,39,'やや支持する','Slightly Support'),(3,11,'Second Amendment Rights','Second Amendment Rights'),(3,12,'Not that confident','Not that confident'),(3,13,'Somewhat disapprove','Somewhat disapprove'),(3,14,'Republicans in Congress are doing ENOUGH TO SUPPORT President Trump','ENOUGH'),(3,15,'Somewhat oppose','Somewhat oppose'),(3,16,'Somewhat oppose','Somewhat oppose'),(3,17,'Bad Job','Bad Job'),(3,18,'About Right','About Right'),(3,19,'Somewhat Less Likely','Somewhat Less Likely'),(3,20,'Somewhat oppose','Somewhat oppose'),(3,21,'Somewhat oppose','Somewhat oppose'),(3,22,'Unsure','Unsure'),(3,23,'Keep Gun Laws as they are now','Keep Gun Laws as they are now'),(3,24,'Somewhat disagree','Somewhat disagree'),(3,25,'Unsure','Unsure'),(3,26,'Not that important','Not that important'),(3,28,'Somewhat disagree','Somewhat disagree'),(3,29,'26-40','26-40'),(3,30,'JCU公式HP','JCU Website'),(3,31,'米中対立の今！！〜知的財産の問題を中心に〜','Standoff and Protecting Intellectual Property Rights'),(3,32,'教育','Digitalization of Government'),(3,33,'あまり支持しない','Slightly Oppose'),(3,34,'あまり支持しない','Slightly Oppose'),(3,35,'JCU公式HP','JCU Website'),(3,36,'米中対立の今！！〜知的財産の問題を中心に〜','Standoff and Protecting Intellectual Property Rights'),(3,37,'教育','Digitalization of Government'),(3,38,'あまり支持しない','Slightly Oppose'),(3,39,'あまり支持しない','Slightly Oppose'),(4,11,'Immigration and building the border wall','Immigration and building the border wall'),(4,12,'Not at all confident','Not at all confident'),(4,13,'Strongly disapprove','Strongly disapprove'),(4,14,'Unsure','Unsure'),(4,15,'Strongly oppose','Strongly oppose'),(4,16,'Strongly oppose','Strongly oppose'),(4,17,'Very Bad Job','Very Bad Job'),(4,18,'Unsure','Unsure'),(4,19,'Much Less Likely','Much Less Likely'),(4,20,'Strongly oppose','Strongly oppose'),(4,21,'Strongly oppose','Strongly oppose'),(4,23,'Unsure','Unsure'),(4,24,'Strongly disagree','Strongly disagree'),(4,26,'Not at all important','Not at all important'),(4,28,'Strongly disagree','Strongly disagree'),(4,29,'41-55','41-55'),(4,30,'その他','Other'),(4,31,'文化と美徳','Culture and Virtues'),(4,32,'IT','IT'),(4,33,'非常に支持しない','Oppose'),(4,34,'支持しない','Oppose'),(4,35,'その他','Other'),(4,36,'文化と美徳','Culture and Virtues'),(4,37,'IT','IT'),(4,38,'非常に支持しない','Oppose'),(4,39,'支持しない','Oppose'),(5,11,'Criminal Justice Reform','Criminal Justice Reform'),(5,12,'Unsure','Unsure'),(5,13,'Unsure','Unsure'),(5,15,'Unsure','Unsure'),(5,16,'Unsure','Unsure'),(5,17,'Unsure','Unsure'),(5,19,'No difference','No difference'),(5,20,'Unsure','Unsure'),(5,21,'Unsure','Unsure'),(5,24,'Unsure','Unsure'),(5,26,'Unsure','Unsure'),(5,28,'Unsure','Unsure'),(5,29,'56-65','56-65'),(5,31,'リレー・スピーチ　ポストコロナと日本の未来','Post-Corona and Japan Future'),(5,32,'外交','Foreign Affairs'),(5,33,'わかならい','I don\'t know'),(5,34,'わからない','I don\'t know'),(5,36,'リレー・スピーチ　ポストコロナと日本の未来','Post-Corona and Japan Future'),(5,37,'外交','Foreign Affairs'),(5,38,'わかならい','I don\'t know'),(5,39,'わからない','I don\'t know'),(6,11,'Supporting law enforcement','Supporting law enforcement'),(6,19,'Unsure','Unsure'),(6,29,'66-75','66-75'),(6,31,'トランプorバイデン　岐路に立つエネルギー地政学','Energy Geopolitics at a Crossroads'),(6,32,'経済','The Economy'),(6,36,'トランプorバイデン　岐路に立つエネルギー地政学','Energy Geopolitics at a Crossroads'),(6,37,'経済','The Economy'),(7,11,'Energy and Environment issues','Energy and Environment issues'),(7,29,'Over 75','Over 75'),(7,31,'DX時代の最先端セキュリティ～デジタル通貨覇権・不正選挙～','The digital transformation-era, cryptocurrency'),(7,32,'行政改革','Governmental Organizational Reform'),(7,36,'DX時代の最先端セキュリティ～デジタル通貨覇権・不正選挙～','The digital transformation-era, cryptocurrency'),(7,37,'行政改革','Governmental Organizational Reform'),(8,11,'Human Dignity and Pro-Life issues','Human Dignity and Pro-Life issues'),(8,31,'特になし','Unknown'),(8,32,'その他','Other'),(8,36,'特になし','Unknown'),(8,37,'その他','Other'),(9,11,'Privacy and Government Data Collection','Privacy and Government Data Collection'),(10,11,'The Supreme Court and other judicial positions','The Supreme Court and other judicial positions'),(11,11,'Taxes, Budget and Spending','Taxes, Budget and Spending'),(12,11,'Education and School Choice','Education and School Choice'),(13,11,'Re-opening the economy','Re-opening the economy'),(14,11,'National Security and Foreign Policy','National Security and Foreign Policy'),(15,11,'Unsure','Unsure');
/*!40000 ALTER TABLE `survey_question_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey_question_answer_i18n`
--

LOCK TABLES `survey_question_answer_i18n` WRITE;
/*!40000 ALTER TABLE `survey_question_answer_i18n` DISABLE KEYS */;
INSERT INTO `survey_question_answer_i18n` VALUES (30,1,1,'JCU Insight'),(30,2,1,'Word Of Mouth'),(30,3,1,'JCU Website'),(30,4,1,'Other'),(31,1,1,'Opening / Fighting for Election Integrity'),(31,2,1,'Toward Stability in Indo-Pacific~The Future of Security Policy'),(31,3,1,'The U.S.-China Standoff and Protecting Intellectual Property Rights'),(31,4,1,'Culture and Virtues'),(31,5,1,'Keynote Session: Post-Corona and Japan\'s Future'),(31,6,1,'Energy Geopolitics at a Crossroads'),(31,7,1,'The digital transformation-era, cryptocurrency system hegemony, and election fraud (Liberty)'),(31,8,1,'I don\'t know'),(32,1,1,'Declining Birthrate'),(32,2,1,'Education'),(32,3,1,'Digitalization of Government'),(32,4,1,'IT'),(32,5,1,'Foreign Affairs'),(32,6,1,'The Economy'),(32,7,1,'Governmental Organizational Reform'),(32,8,1,'Other'),(33,1,1,'Support'),(33,2,1,'Slightly Support'),(33,3,1,'Slightly Oppose'),(33,4,1,'Oppose'),(33,5,1,'I don\'t know'),(34,1,1,'Support'),(34,2,1,'Slightly Support'),(34,3,1,'Slightly Oppose'),(34,4,1,'Oppose'),(34,5,1,'I don\'t know'),(35,1,1,'JCU Insight'),(35,2,1,'Word Of Mouth'),(35,3,1,'JCU Website'),(35,4,1,'Other'),(36,1,1,'Opening / Fighting for Election Integrity'),(36,2,1,'Toward Stability in Indo-Pacific~The Future of Security Policy'),(36,3,1,'The U.S.-China Standoff and Protecting Intellectual Property Rights'),(36,4,1,'Culture and Virtues'),(36,5,1,'Keynote Session: Post-Corona and Japan\'s Future'),(36,6,1,'Energy Geopolitics at a Crossroads'),(36,7,1,'The digital transformation-era, cryptocurrency system hegemony, and election fraud (Liberty)'),(36,8,1,'I don\'t know'),(37,1,1,'Declining Birthrate'),(37,2,1,'Education'),(37,3,1,'Digitalization of Government'),(37,4,1,'IT'),(37,5,1,'Foreign Affairs'),(37,6,1,'The Economy'),(37,7,1,'Governmental Organizational Reform'),(37,8,1,'Other'),(38,1,1,'Support'),(38,2,1,'Slightly Support'),(38,3,1,'Slightly Oppose'),(38,4,1,'Oppose'),(38,5,1,'I don\'t know'),(39,1,1,'Support'),(39,2,1,'Slightly Support'),(39,3,1,'Slightly Oppose'),(39,4,1,'Oppose'),(39,5,1,'I don\'t know');
/*!40000 ALTER TABLE `survey_question_answer_i18n` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `survey_question_i18n`
--

LOCK TABLES `survey_question_i18n` WRITE;
/*!40000 ALTER TABLE `survey_question_i18n` DISABLE KEYS */;
INSERT INTO `survey_question_i18n` VALUES (30,1,'Where did you find out about CPAC Japan 2020?',NULL),(31,1,'What is the most  expecting session?',NULL),(32,1,'What is the most pressing issue facing Japan?',NULL),(33,1,'Do you support the reelection of President Trump?',NULL),(34,1,'If COVID-19 cases spike compared to current rates, do you support that the government issuing another state of emergency (in Japan)?',NULL),(35,1,'Where did you find out about CPAC Japan 2020?',NULL),(36,1,'What is the most  expecting session?',NULL),(37,1,'What is the most pressing issue facing Japan?',NULL),(38,1,'Do you support the reelection of President Trump?',NULL),(39,1,'If COVID-19 cases spike compared to current rates, do you support that the government issuing another state of emergency (in Japan)?',NULL);
/*!40000 ALTER TABLE `survey_question_i18n` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `system_property`
--

LOCK TABLES `system_property` WRITE;
/*!40000 ALTER TABLE `system_property` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tagging`
--

LOCK TABLES `tagging` WRITE;
/*!40000 ALTER TABLE `tagging` DISABLE KEYS */;
/*!40000 ALTER TABLE `tagging` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tagging_item`
--

LOCK TABLES `tagging_item` WRITE;
/*!40000 ALTER TABLE `tagging_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `tagging_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tagging_item_type`
--

LOCK TABLES `tagging_item_type` WRITE;
/*!40000 ALTER TABLE `tagging_item_type` DISABLE KEYS */;
INSERT INTO `tagging_item_type` VALUES (1,'Purchase Order'),(2,'Sale Order'),(3,'Warehouse Good Receipt'),(4,'Warehouse Good Issue'),(5,'Receipt Voucher'),(6,'Payment Voucher'),(7,'Person'),(8,'Company');
/*!40000 ALTER TABLE `tagging_item_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
INSERT INTO `template` VALUES (5,1,1,'Học phí hàng tháng','<h1 style=\"text-align: center;\">Harmony Waldorf-inspired Homeschooling</h1>\n<h3 style=\"text-align: center;\">Th&ocirc;ng b&aacute;o học ph&iacute; th&aacute;ng <span class=\"badge badge-info\">{{studentFee.monthFee}}-<span class=\"badge badge-info\">{{studentFee.yearFee}}</span></span></h3>\n<p>&nbsp;</p>\n<p><span class=\"badge badge-info\"><span class=\"badge badge-info\">K&iacute;nh gửi: </span></span></p>\n<p style=\"padding-left: 40px;\"><span class=\"badge badge-info\"><span class=\"badge badge-info\">&Ocirc;ng: <span class=\"badge badge-info\">{{father.firstName}} <span class=\"badge badge-info\">{{father.lastName}}</span></span></span></span></p>\n<p style=\"padding-left: 40px;\"><span class=\"badge badge-info\"><span class=\"badge badge-info\">B&agrave;: <span class=\"badge badge-info\">{{mother.firstName}} <span class=\"badge badge-info\">{{mother.lastName}}</span></span></span></span></p>\n<p style=\"padding-left: 40px;\"><span class=\"badge badge-info\"><span class=\"badge badge-info\">Phụ huynh b&eacute;: <span class=\"badge badge-info\">{{student.firstName}} <span class=\"badge badge-info\">{{student.lastName}}</span></span>&nbsp;</span></span></p>\n<p style=\"padding-left: 40px;\"><span class=\"badge badge-info\"><span class=\"badge badge-info\">Nh&agrave; trường tr&acirc;n trọng gửi đến Qu&yacute; Phụ Huynh bảng chi tiết học ph&iacute; như sau:</span></span></p>\n<table style=\"border-collapse: collapse; width: 100%; height: 84px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 21px;\">\n<td style=\"width: 2.9866%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 33.2657%; height: 21px;\">G&oacute;i học ph&iacute;</td>\n<td style=\"width: 36.1784%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 24.1638%; height: 21px;\">&nbsp;</td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 2.9866%; height: 21px;\">1</td>\n<td style=\"width: 33.2657%; height: 21px;\">Học ph&iacute;</td>\n<td style=\"width: 36.1784%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 24.1638%; height: 63px;\" rowspan=\"3\"><span class=\"badge badge-info\">{{studentFee.remark}}</span></td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 2.9866%; height: 21px;\">2</td>\n<td style=\"width: 33.2657%; height: 21px;\">Ăn xế</td>\n<td style=\"width: 36.1784%; height: 21px;\">&nbsp;</td>\n</tr>\n<tr style=\"height: 21px;\">\n<td style=\"width: 2.9866%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 33.2657%; height: 21px;\">&nbsp;</td>\n<td style=\"width: 36.1784%; height: 21px;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>',2,'2020-11-14 10:20:07','','2020-12-05 18:12:57',1),(9,1,1,'Test email 1','<p>tetsing sfj;dkfajsofijoew;f ef</p>',2,'2020-12-06 17:20:45','Test email 1','2020-12-06 17:20:45',2),(10,1,1,'test 2','<p>dfsdfdf</p>',2,'2020-12-06 17:21:14','tstet2','2020-12-06 17:21:14',2),(11,1,1,'tets3','<p>tetsstests</p>',2,'2020-12-06 17:23:08','teteest','2020-12-06 17:23:08',2);
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `template_plugin_variables`
--

LOCK TABLES `template_plugin_variables` WRITE;
/*!40000 ALTER TABLE `template_plugin_variables` DISABLE KEYS */;
INSERT INTO `template_plugin_variables` VALUES (1,'Student Fee','[{\"key\":\"studentFee.monthFee\", \"value\":\"{{studentFee.monthFee}}\", \"remark\":\"Học phí tháng\"},{\"key\":\"studentFee.yearFee\", \"value\":\"{{studentFee.yearFee}}\", \"remark\":\"Học phí năm\"},{\"key\":\"studentFee.scholarShip\", \"value\":\"{{studentFee.scholarShip}}\", \"remark\":\"Học bổng\"},{\"key\":\"studentFee.scholarShipPercent\", \"value\":\"{{studentFee.scholarShipPercent}}\", \"remark\":\"Học bổng (%)\"},{\"key\":\"studentFee.scholarFee\", \"value\":\"{{studentFee.scholarFee}}\", \"remark\":\"Số tiền 1 tháng\"},{\"key\":\"studentFee.mealFee\", \"value\":\"{{studentFee.mealFee}}\", \"remark\":\"Tiền ăn\"},{\"key\":\"studentFee.absentDate\", \"value\":\"{{studentFee.absentDate}}\", \"remark\":\"Số ngày vắng\"},{\"key\":\"studentFee.deduceTuition\", \"value\":\"{{studentFee.deduceTuition}}\", \"remark\":\"Giảm trừ học phí\"},{\"key\":\"studentFee.busFee\", \"value\":\"{{studentFee.busFee}}\", \"remark\":\"Phí xe bus\"},{\"key\":\"studentFee.beginningYearFee\", \"value\":\"{{studentFee.beginningYearFee}}\", \"remark\":\"Phí đầu năm\"},{\"key\":\"studentFee.otherFee\", \"value\":\"{{studentFee.otherFee}}\", \"remark\":\"Phí khác\"},{\"key\":\"studentFee.otherDeduceFee\", \"value\":\"{{studentFee.otherDeduceFee}}\", \"remark\":\"Phí giảm trừ khác\"},{\"key\":\"studentFee.debt\", \"value\":\"{{studentFee.debt}}\", \"remark\":\"Nợ\"},{\"key\":\"studentFee.remark\", \"value\":\"{{studentFee.remark}}\", \"remark\":\"Mô tả thêm\"}]'),(2,'Student','[{\"key\":\"student.firstName\", \"value\":\"{{student.firstName}}\", \"remark\":\"Họ học sinh\"},{\"key\":\"student.lastName\", \"value\":\"{{student.lastName}}\", \"remark\":\"Tên học sinh\"},{\"key\":\"student.gsm\", \"value\":\"{{student.gsm}}\", \"remark\":\"Số Điện Thoại học sinh\"},{\"key\":\"student.email\", \"value\":\"{{student.email}}\", \"remark\":\"Email học sinh\"},{\"key\":\"student.address\", \"value\":\"{{student.address}}\", \"remark\":\"Địa chỉ học sinh\"},{\"key\":\"student.birthday\", \"value\":\"{{student.birthday}}\", \"remark\":\"Ngày sinh nhật học sinh\"},{\"key\":\"student.sex\", \"value\":\"{{student.sex}}\", \"remark\":\"Giới tính học sinh\"},{\"key\":\"student.remark\", \"value\":\"{{student.remark}}\", \"remark\":\"Mô tả học sinh\"}]'),(3,'Father','[{\"key\":\"father.firstName\", \"value\":\"{{father.firstName}}\", \"remark\":\"Họ cha\"},{\"key\":\"father.lastName\", \"value\":\"{{father.lastName}}\", \"remark\":\"Tên cha\"},{\"key\":\"father.gsm\", \"value\":\"{{father.gsm}}\", \"remark\":\"Số điện thoại cha\"},{\"key\":\"father.email\", \"value\":\"{{father.email}}\", \"remark\":\"Email của cha\"},{\"key\":\"father.address\", \"value\":\"{{father.address}}\", \"remark\":\"Địa chỉ của cha\"},{\"key\":\"father.birthday\", \"value\":\"{{father.birthday}}\", \"remark\":\"Ngày sinh nhật cha\"},{\"key\":\"father.sex\", \"value\":\"{{father.sex}}\", \"remark\":\"Giới tính cha\"},{\"key\":\"father.remark\", \"value\":\"{{father.remark}}\", \"remark\":\"Mô tả của cha\"}]'),(4,'Mother','[{\"key\":\"mother.firstName\", \"value\":\"{{mother.firstName}}\", \"remark\":\"Họ của mẹ\"},{\"key\":\"mother.lastName\", \"value\":\"{{mother.lastName}}\", \"remark\":\"Tên của mẹ\"},{\"key\":\"mother.gsm\", \"value\":\"{{mother.gsm}}\", \"remark\":\"Số điện thoại của mẹ\"},{\"key\":\"mother.email\", \"value\":\"{{mother.email}}\", \"remark\":\"Email của mẹ\"},{\"key\":\"mother.address\", \"value\":\"{{mother.address}}\", \"remark\":\"Địa chỉ của mẹ\"},{\"key\":\"mother.birthday\", \"value\":\"{{mother.birthday}}\", \"remark\":\"Ngày sinh nhật của mẹ\"},{\"key\":\"mother.sex\", \"value\":\"{{mother.sex}}\", \"remark\":\"Giới tính của mẹ\"},{\"key\":\"mother.remark\", \"value\":\"{{mother.remark}}\", \"remark\":\"Mô tả về mẹ\"}]');
/*!40000 ALTER TABLE `template_plugin_variables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `template_type`
--

LOCK TABLES `template_type` WRITE;
/*!40000 ALTER TABLE `template_type` DISABLE KEYS */;
INSERT INTO `template_type` VALUES (1,'Student Monthly Fee');
/*!40000 ALTER TABLE `template_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `template_type_plugin`
--

LOCK TABLES `template_type_plugin` WRITE;
/*!40000 ALTER TABLE `template_type_plugin` DISABLE KEYS */;
INSERT INTO `template_type_plugin` VALUES (1,1),(1,2),(1,3),(1,4);
/*!40000 ALTER TABLE `template_type_plugin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'lephuoccanh@gmail.com',NULL,NULL,'$2b$10$mOJ5exSmFzW1xO5CEkmX9epeuQR6uliHXjicZscXBpD6JCyGgvuHK',1,NULL,3,NULL,NULL,1,'2020-07-03 18:32:04',0),(2,'admin@gmail.com',NULL,NULL,'$2b$10$eHoDo7izZTKp8sFJ/Oabju9G70Px3vQqWsV73PLwp3IOTrO69dU12',1,NULL,3,NULL,NULL,1,NULL,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_activate`
--

LOCK TABLES `user_activate` WRITE;
/*!40000 ALTER TABLE `user_activate` DISABLE KEYS */;
INSERT INTO `user_activate` VALUES (1,1,'a2ce39bfdbe9eadc61e1073d5bcf5b40','2020-07-03 18:32:04'),(2,2,'819ad08b8a8c0768e42c60cd8d79cbdc','2020-08-04 03:01:23');
/*!40000 ALTER TABLE `user_activate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_company`
--

LOCK TABLES `user_company` WRITE;
/*!40000 ALTER TABLE `user_company` DISABLE KEYS */;
INSERT INTO `user_company` VALUES (2,1);
/*!40000 ALTER TABLE `user_company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_configure`
--

LOCK TABLES `user_configure` WRITE;
/*!40000 ALTER TABLE `user_configure` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_configure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_reset_password`
--

LOCK TABLES `user_reset_password` WRITE;
/*!40000 ALTER TABLE `user_reset_password` DISABLE KEYS */;
INSERT INTO `user_reset_password` VALUES (1,1,'f6d56c675e72897e05387ea3c3eb441d','2020-09-07 15:12:49',1,'2020-09-07 04:18:51');
/*!40000 ALTER TABLE `user_reset_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_shop`
--

LOCK TABLES `user_shop` WRITE;
/*!40000 ALTER TABLE `user_shop` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `warehouse`
--

LOCK TABLES `warehouse` WRITE;
/*!40000 ALTER TABLE `warehouse` DISABLE KEYS */;
INSERT INTO `warehouse` VALUES (1,'test','32943434',1,'2020-09-04 08:46:44',2,NULL,NULL),(2,'Kho 1','kiểm tra thử',1,'2020-09-04 08:57:27',2,NULL,NULL),(3,'tét','tếttet',1,'2020-10-30 15:41:43',2,NULL,NULL),(5,'kho 4','',1,'2020-11-30 07:47:40',2,NULL,NULL),(6,'kho 5','',1,'2020-11-30 07:47:42',2,NULL,NULL),(7,'kho o6','',1,'2020-11-30 07:47:43',2,NULL,NULL),(8,'kho 7','',1,'2020-11-30 07:47:45',2,NULL,NULL),(9,'kho 8','',1,'2020-11-30 07:47:46',2,NULL,NULL),(10,'kho 9','',1,'2020-11-30 07:47:47',2,NULL,NULL),(11,'kho 10','',1,'2020-11-30 07:47:48',2,NULL,NULL);
/*!40000 ALTER TABLE `warehouse` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-09 15:53:18
