INSERT INTO template_type (id, name) VALUES (1, 'Student Monthly Fee');
alter table template modify id bigint auto_increment;

create index template_companyId_templateTypeId_index
	on template (companyId, templateTypeId);

alter table template
	add remark text null;

insert into acl_group_action(groupId, actionId, type)
    SELECT id, 44, 3 from acl_group where createdById = 0
UNION SELECT id, 45, 3 from acl_group where createdById = 0
UNION SELECT id, 46, 3 from acl_group where createdById = 0
UNION SELECT id, 47, 3 from acl_group where createdById = 0;
