alter table student_monthly_fee
	add feePerMonth decimal(12,2) null;
alter table student_monthly_fee
	add daysOfMonth int null;
alter table student_monthly_fee
	add absentDayFee decimal(10,2) null,
    add trialDateFee decimal(10,2) null;
alter table student_monthly_fee
	add totalAmount decimal(12,2);
alter table student_monthly_fee
	add lastUpdatedDate datetime null;
alter table student_monthly_fee
	add lastUpdatedById int null;
