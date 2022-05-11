create table provider
(
    id               bigint auto_increment,
    companyId        bigint   not null,
    partnerId        bigint   null,
    rating           int      null,
    createdDate      datetime null,
    createdById      bigint   null,
    lastModifiedDate datetime null,
    lastModifiedById bigint   null,
    status           int      null comment 'Flow:
PENDING (1) ==> PROCESSING (2) ==> APPROVED (3)
==> EXPIRED (4) ==> CANCEL (5)',
    approvedDate     datetime null,
    approvedById     bigint   null,
    constraint provider_pk
        primary key (id)
);

alter table provider
    add contractStartDate datetime null;

alter table provider
    add contractEndDate datetime null;

create table provider_product
(
    providerId bigint not null,
    productId  bigint not null,
    constraint provider_product_pk
        primary key (providerId, productId)
);

