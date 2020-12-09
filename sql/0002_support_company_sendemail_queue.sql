create table email_company
(
    emailId     bigint unsigned not null,
    companyId   bigint not null,
    userId      bigint not null,
    createdDate datetime        null,
    constraint email_company_pk
        primary key (emailId, companyId, userId),
    constraint email_company_email_send_id_fk
        foreign key (emailId) references email_send (id),
    constraint email_company_company_id_fk
        foreign key (companyId) references company (id),
    constraint email_company_user_id_fk
        foreign key (userId) references user (id)
);

alter table email_send modify status tinyint null;

create table email_attachment
(
	emailId bigint unsigned not null,
	id int not null,
	type tinyint null,
	data varchar(512) null,
	constraint email_attachment_pk primary key (emailId, id),
  constraint email_attachment_email_send_fk foreign key (emailId) references email_send (id)
);

