#!/bin/bash

# Set PATH include mysql client:
#  example:
#   - export PATH=$PATH:/usr/local/mysql-8.0.16-macos10.14-x86_64/bin
#  set ENV for mysql user, pass
#   - export MYSQL_USER=root
#   - export MYSQL_PASS=12345678
#
PASSWORD=$MYSQL_PASS
HOST=127.0.0.1
USER=$MYSQL_USER
DATABASE=yocto_erp
DB_FILE=sql/init.sql
EXCLUDED_TABLES=(
company_configure
email_send
)
echo "Remove Old File"
rm ${DB_FILE}

IGNORED_TABLES_STRING=''
for TABLE in "${EXCLUDED_TABLES[@]}"
do :
   IGNORED_TABLES_STRING+=" --ignore-table=${DATABASE}.${TABLE}"
done

echo "Dump structure"
mysqldump --host=${HOST} --user=${USER} --password=${PASSWORD} --default-character-set=utf8mb4 --single-transaction --no-data --routines ${DATABASE} -r ${DB_FILE}

echo "Dump content"
mysqldump --host=${HOST} --user=${USER} --password=${PASSWORD} ${DATABASE} --no-create-info --skip-triggers --default-character-set=utf8mb4 ${IGNORED_TABLES_STRING} >> ${DB_FILE}
