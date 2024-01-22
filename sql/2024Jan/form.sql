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

create index form_register_createdDate_index
  on yocto_erp.form_register (createdDate desc);

create index form_register_name_phone_email_index
  on yocto_erp.form_register (name, phone, email);



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
  paymentTypeId           int          not null,
  partnerRequestId        varchar(64)  not null,
  constraint _paymentTypeId_partnerRequestId_uindex
    unique (paymentTypeId, partnerRequestId),
  constraint payment_request_partner_confirm_payment_request_partner_id_fk
    foreign key (paymentRequestPartnerId) references payment_request_partner (id)
      on update cascade on delete cascade,
  constraint payment_request_partner_confirm_payment_type_id_fk
    foreign key (paymentTypeId) references payment_type (id)
      on update cascade on delete cascade
);

insert into template_type (id, name)
  value (3, 'Register Form Type');

INSERT INTO template_plugin_variables (id, name, variables)
VALUES (5, 'Form Register',
        '[{"key":"name","value":"{{name}}","remark":"Họ và Tên"},{"key":"ip","value":"{{ip}}","remark":"Địa chỉ IP"},{"key":"url","value":"{{url}}","remark":"Web coi thông tin đăng ký"},{"key":"classes","value":"{{classes}}","remark":"Danh sách đăng ký lớp học"},{"key":"products","value":"{{products}}","remark":"Danh sách đăng ký sản phẩm"},{"key":"description","value":"{{description}}","remark":"Góp ý của khách hàng"},{"key":"totalAmount","value":"{{totalAmount}}","remark":"Tổng số tiền"},{"key":"registerData","value":"{{registerData}}","remark":"Thông tin khác"},{"key":"form.name","value":"{{form.name}}","remark":"Tên mẫu đăng ký"}]');

INSERT INTO template_type_plugin (templateTypeId, templatePluginId)
VALUES (3, 5);
