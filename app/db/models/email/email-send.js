import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const EMAIL_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAIL: 2
}

export default class EmailSend extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        from: {type: DataTypes.STRING(150)},
        to: {type: DataTypes.TEXT},
        cc: {type: DataTypes.TEXT},
        bcc: {type: DataTypes.TEXT},
        subject: {type: DataTypes.STRING(512)},
        content: {type: DataTypes.TEXT},
        status: {type: DataTypes.TINYINT},
        retry: {type: DataTypes.INTEGER},
        api_response: {type: DataTypes.TEXT},
        sent_date: {type: DataTypes.DATE},
        totalAttach: {type: DataTypes.INTEGER}
      },
      {
        tableName: 'email_send',
        modelName: 'email_send',
        timestamps: false, ...opts,
        sequelize
      }
    );
  }

  static associate(models) {
    this.hasMany(models.EmailAttachment, {foreignKey: 'emailId', as: 'attachments'});
  }
}
