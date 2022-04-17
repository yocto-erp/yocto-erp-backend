#!/bin/bash
DATE=$(date +'%m_%d_%Y')
BACKUP_FILE="liberty_database_$DATE.sql"
DATABASE=liberty
PASSWORD="mondex1@#$"
USER=root
EXCLUDED_TABLES=(
user_transaction
user_transaction_backup_2021_06
user_walking
ads_request
app_access
user_app_mileage
user_bonus
user_notification_request_detail
ads_view_reward
event_user_click
post_view
trading_pair_request
video_view
daily_checking_user
)

IGNORED_TABLES_STRING=''
for TABLE in "${EXCLUDED_TABLES[@]}"
do :
   IGNORED_TABLES_STRING+=" --ignore-table=${DATABASE}.${TABLE}"
done

echo "Dump structure"
mysqldump --user=${USER} --password=${PASSWORD} --single-transaction --no-data --routines ${DATABASE} > ${BACKUP_FILE}
echo "Dump content"
mysqldump --user=${USER} --password=${PASSWORD} ${DATABASE} --no-create-info --skip-triggers ${IGNORED_TABLES_STRING} >> ${BACKUP_FILE}

echo "Make tar file"
tar -czvf "$BACKUP_FILE.tar.gz" $BACKUP_FILE
echo "Upload to google"
rclone -v copy "$BACKUP_FILE.tar.gz" storj:/backup-db
echo "Send Notification"
curl -X POST \
     -H 'Content-Type: application/json' \
     -d "{\"chat_id\": \"-417285318\", \"text\": \"Backup File $BACKUP_FILE success at storj:/backup-db/$BACKUP_FILE.tar.gz\", \"disable_notification\": true}" \
     https://api.telegram.org/bot$TELEGRAM_BOT/sendMessage
rm $BACKUP_FILE
rm "$BACKUP_FILE.tar.gz"
