import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const EMAIL_ATTACHMENT_TYPE = {
  ASSET: 1,
  REMOTE: 2
}

export default class EmailAttachment extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        emailId: {type: DataTypes.BIGINT, primaryKey: true},
        id: {type: DataTypes.INTEGER, primaryKey: true},
        type: {type: DataTypes.TINYINT},
        data: {type: DataTypes.STRING(512)}
      },
      {
        tableName: 'email_attachment',
        modelName: 'emailAttachment',
        timestamps: false, ...opts,
        sequelize
      }
    );
  }
}
