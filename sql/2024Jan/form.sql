create table form
(
  id          int auto_increment
    primary key,
  companyId   int          not null,
  name        varchar(250) null,
  description text         null,
  createdDate datetime     null,
  createdById int          null,
  status      tinyint      null comment 'ACTIVE: 1
DISABLE: 2',
  setting     json         null
);

create table form_asset
(
  formId     int     not null,
  priority   int     not null,
  type       tinyint null comment 'CLASS: 1
PRODUCT: 2',
  relativeId int     not null,
  primary key (formId, priority)
);

create table form_register
(
  id           int auto_increment
    primary key,
  publicId     varchar(64)  not null,
  ip           varchar(100) null,
  userAgent    text         null,
  userId       int          null,
  registerData json         null,
  createdDate  datetime     null,
  constraint publicId
    unique (publicId)
);

create table form_register_asset
(
  formRegisterId int not null,
  formAssetId    int not null,
  primary key (formRegisterId, formAssetId)
);

