create view yocto_erp.tagging_product as
	select taggingId, itemId from tagging_item where itemType = 9;
