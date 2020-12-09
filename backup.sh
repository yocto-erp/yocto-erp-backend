DATE=$(date +'%m_%d_%Y')
BACKUP_FILE="yocto_database_$DATE.sql"
echo "Backup file $BACKUP_FILE"
mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD yocto_erp > $BACKUP_FILE
tar -czvf "$BACKUP_FILE.tar.gz" $BACKUP_FILE
echo "Upload to google"
rclone -v copy "$BACKUP_FILE.tar.gz" google:/yocto/backup-database
echo "Send Email"
curl -s --user $MAILGUN_APIKEY \
    https://api.mailgun.net/v3/mg.yoctoerp.com/messages \
    -F from='Info Yocto <info@yoctoerp.com>' \
    -F to=lephuoccanh@gmail.com \
    -F subject="Backup YOCTO $DATE done" \
    -F text='Backup data success.'
rm $BACKUP_FILE
rm "$BACKUP_FILE.tar.gz"
