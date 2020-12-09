create table survey
(
	id bigint auto_increment
		primary key,
	companyId bigint default 0 not null,
	name varchar(250) null,
	remark text null,
	createdDate datetime null,
	createdById bigint default 0 not null,
	lastModifiedDate datetime null,
	lastModifiedById bigint default 0 not null,
	totalAnswer int null,
	lastAnsweredDate datetime null,
	type int null comment '1: Public
2: Need email Verify
3: Need SMS Verify'
);

create index survey_companyId_createdByIdid_index
	on yocto_erp.survey (companyId, createdById);

create table survey_person
(
	id bigint auto_increment
		primary key,
	surveyId bigint not null,
	createdDate datetime null,
	personId bigint null,
	submittedDate datetime null,
	IP varchar(64) null,
	clientAgent text null,
	clientId varchar(64) null,
	companyId bigint default 0 not null,
	ipfsId text null,
	blockchainId varchar(250) null,
	lastUpdatedDate datetime null,
	constraint survey_person_surveyId_personId_uindex
		unique (surveyId, personId)
);

create table survey_person_answer
(
	id bigint auto_increment
		primary key,
	surveyPersonId bigint not null,
	questionId bigint not null,
	answer text not null,
	constraint survey_person_answer_survey_question_id_fk
		foreign key (questionId) references yocto_erp.survey_question (id)
			on delete cascade
);



create table survey_question
(
	id bigint auto_increment
		primary key,
	surveyId bigint null,
	content text null,
	type int null,
	rightAnswer varchar(512) null,
	introduction text null,
	data text null,
	priority int default 0 not null
);

create table survey_question_answer
(
	id int not null,
	questionId bigint not null,
	content text null,
	`key` varchar(250) null,
	primary key (id, questionId),
	constraint survey_question_answer_questionId_key_uindex
		unique (questionId, `key`),
	constraint survey_question_answer_survey_question_id_fk
		foreign key (questionId) references yocto_erp.survey_question (id)
);

create table otp
(
	clientId varchar(64) not null,
	code varchar(64) not null,
	createdDate datetime null,
	expiredDate datetime null,
	verifiedDate datetime null,
	status tinyint default 0 null,
	target varchar(250) not null,
  targetType int not null,
	primary key (clientId, code, target)
)
comment 'One Time Password';

create table survey_person_answer
(
  id bigint auto_increment
  primary key,
  surveyPersonId bigint not null,
  questionId bigint not null,
  answer text not null,
constraint survey_person_answer_survey_question_id_fk
    foreign key (questionId) references yocto_erp.survey_question (id)
  on delete cascade
);

create table language
(
	id int not null,
	code varchar(3) not null,
	name varchar(50) null,
	constraint language_pk
		primary key (id)
);

create unique index language_code_uindex
	on language (code);

create table survey_question_i18n
(
	surveyQuestionId bigint not null,
	languageId int not null,
	content text null,
	constraint survey_question_i18n_pk
		primary key (surveyQuestionId, languageId)
);

create table survey_question_answer_i18n
(
	surveyQuestionId bigint not null,
	surveyQuestionAnswerId int not null,
	languageId int not null,
	content text null,
	constraint survey_question_answer_i18n_pk
		primary key (surveyQuestionId, surveyQuestionAnswerId, languageId)
);
create table survey_i18n
(
	surveyId bigint not null,
	languageId int not null,
	name text null,
	remark text null,
	constraint survey_i18n_pk
		primary key (surveyId, languageId)
);

alter table survey_person
	add languageId int null;


insert into language(id, code, name)
values(1, 'en', 'English'), (2, 'ja', 'Japanese');
