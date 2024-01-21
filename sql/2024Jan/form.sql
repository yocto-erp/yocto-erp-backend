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
  id               int auto_increment
    primary key,
  publicId         varchar(64)                 not null,
  ip               varchar(100)                null,
  userAgent        text                        null,
  userId           int                         null,
  registerData     json                        null,
  createdDate      datetime                    null,
  totalAmount      decimal(14, 2) default 0.00 null,
  lastModifiedDate datetime                    null,
  lastModifiedById bigint                      null,
  isConfirmed      tinyint(1)                  null,
  status           tinyint                     null comment '1: REQUEST
2: CONFIRMED
3: PAID
4: CANCEL',
  formId           int                         not null,
  name             varchar(100)                not null,
  phone            varchar(20)                 null,
  email            varchar(150)                null,
  constraint publicId
    unique (publicId),
  constraint form_register_form_id_fk
    foreign key (formId) references form (id)
      on update cascade on delete cascade
);

create table form_register_asset
(
  formRegisterId int not null,
  formAssetId    int not null,
  primary key (formRegisterId, formAssetId)
);

alter table payment_method_setting
  modify setting json null;

create table form_register_payment
(
  formRegisterId   int not null,
  paymentRequestId int not null,
  constraint form_register_payment_form_register_id_fk
    foreign key (formRegisterId) references form_register (id)
      on update cascade on delete cascade
);

create table payment_request
(
  id                int auto_increment
    primary key,
  companyId         bigint         null,
  publicId          varchar(64)    not null,
  name              varchar(250)   null,
  remark            text           null,
  createdById       bigint         null,
  createdDate       int            null,
  status            tinyint        null comment 'PENDING: 1
CONFIRMED: 2
REJECT: 3',
  lastConfirmedDate datetime       null,
  ip                varchar(100)   null,
  userAgent         text           null,
  totalAmount       decimal(14, 2) null,
  paymentMethodId   bigint         null,
  source            int            null comment 'PUBLIC REGISTER: 1
OTHER: 1000',
  constraint publicId
    unique (publicId),
  constraint payment_request_payment_method_setting_id_fk
    foreign key (paymentMethodId) references payment_method_setting (id)
);



create table payment_request_partner
(
  id               int auto_increment
    primary key,
  createdDate      datetime     null,
  response         json         null,
  confirmData      json         null,
  confirmedDate    datetime     null,
  confirmFromIP    varchar(100) null,
  paymentRequestId int          null,
  requestData      json         null,
  partnerId        varchar(64)  not null,
  constraint partnerId
    unique (partnerId),
  constraint payment_request_payos_payment_request_id_fk
    foreign key (paymentRequestId) references payment_request (id)
      on update cascade on delete cascade
);

create table payment_request_partner_confirm
(
  id                      int auto_increment
    primary key,
  paymentRequestPartnerId int          not null,
  confirmedData           json         null,
  confirmedDate           datetime     null,
  confirmedFromIP         varchar(100) null,
  paymentTypeId           int          null,
  constraint payment_request_partner_confirm_payment_request_partner_id_fk
    foreign key (paymentRequestPartnerId) references payment_request_partner (id)
      on update cascade on delete cascade,
  constraint payment_request_partner_confirm_payment_type_id_fk
    foreign key (paymentTypeId) references payment_type (id)
      on update cascade on delete cascade
);





create table cost_payment_request
(
  costId           bigint not null,
  paymentRequestId int    not null,
  constraint cost_payment_request_cost_id_fk
    foreign key (costId) references cost (id)
      on update cascade on delete cascade,
  constraint cost_payment_request_payment_request_id_fk
    foreign key (paymentRequestId) references payment_request (id)
      on update cascade on delete cascade
);

insert into template_type (id, name)
  value (3, 'Register Form Type')
