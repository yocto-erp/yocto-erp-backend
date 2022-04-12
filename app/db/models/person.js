import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const GENDER = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2
}

export const getGenderStr = (gender) => {
  switch (gender) {
    case GENDER.MALE:
      return 'MALE';
    case GENDER.FEMALE:
      return 'FEMALE';
    default:
      return 'OTHER';
  }
}

export default class Person extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        firstName: {type: DataTypes.STRING(150)},
        lastName: {type: DataTypes.STRING(150)},
        gsm: {type: DataTypes.STRING(20)},
        email: {type: DataTypes.STRING(150)},
        address: {type: DataTypes.STRING(250)},
        birthday: {type: DataTypes.DATEONLY},
        sex: {type: DataTypes.TINYINT},
        remark: {type: DataTypes.TEXT},
        createdById: {type: DataTypes.INTEGER},
        createdDate: {type: DataTypes.DATE},
        fullName: {
          type: DataTypes.STRING(250)
        },
        name: {
          type: DataTypes.VIRTUAL,
          get() {
            return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
          }
        }
      },
      {
        tableName: 'person',
        modelName: 'person',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.hasMany(models.PartnerPerson, {foreignKey: 'personId', as: 'partnerPerson'});
    this.hasOne(models.Subject, {foreignKey: 'personId', as: 'subject'})
  }
}
