create table student_class
(
    id                    bigint auto_increment,
    companyId             bigint         not null,
    name                  varchar(256)   null,
    tuitionFeePerMonth    decimal(12, 2) null,
    absentFeeReturnPerDay decimal(12, 2) null,
    feePerTrialDay        decimal(10, 2) null,
    mealFeePerMonth       decimal(12, 2) null,
    mealFeeReturnPerDay   decimal(10, 2) null,
    lastModifiedDate       datetime       null,
    lastModifiedById       bigint         null,
    constraint student_class_pk
        primary key (id)
);

alter table student
    add classId bigint null;

alter table student
  add toSchoolBusStopId bigint null;

alter table student
    add toHomeBusStopId bigint null;

alter table student_monthly_fee
    add isPaid bit null;

create table student_bus_stop
(
    id               bigint auto_increment,
    companyId        bigint       not null,
    name             varchar(512) null,
    lastModifiedDate datetime     null,
    lastModifiedById bigint       null,
    constraint student_bus_stop_pk
        primary key (id)
);

