import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

// CURRENT MAX 135

export const PERMISSION = {
  PRODUCT: {
    CREATE: 1,
    READ: 2,
    UPDATE: 3,
    DELETE: 4
  },
  CUSTOMER: {
    CREATE: 5,
    READ: 6,
    UPDATE: 7,
    DELETE: 8
  },
  ORDER: {
    SALE: {
      CREATE: 9,
      READ: 10,
      UPDATE: 11,
      DELETE: 12
    },
    PURCHASE: {
      CREATE: 25,
      READ: 26,
      UPDATE: 27,
      DELETE: 28,
      PROVIDER: 125, // Permission allow user set purchase from which provider,
      AMOUNT: 126, // Permission allow user set amount,
      SHOP: 127 // Permission allow user set shop
    }
  },
  INVENTORY: {
    GOODS_RECEIPT: {
      CREATE: 13,
      READ: 14,
      UPDATE: 15,
      DELETE: 16
    },
    GOODS_ISSUE: {
      CREATE: 21,
      READ: 22,
      UPDATE: 23,
      DELETE: 24
    },
    READ: 38
  },
  WAREHOUSE: {
    CREATE: 17,
    READ: 18,
    UPDATE: 19,
    DELETE: 20
  },
  COST: {
    CREATE: 29,
    READ: 30,
    UPDATE: 31,
    DELETE: 32
  },
  PERSON: {
    CREATE: 33,
    READ: 34,
    UPDATE: 35,
    DELETE: 36
  },
  COMPANY: {
    CREATE: 39,
    READ: 40,
    UPDATE: 41,
    DELETE: 42
  },
  ASSET: {
    READ: 37,
    CREATE: 86,
    DELETE: 87
  },
  CONFIGURATION: 43,
  TEMPLATE: {
    CREATE: 44,
    READ: 45,
    UPDATE: 46,
    DELETE: 47
  },
  EMAIL: {
    SEND: 48,
    READ: 49
  },
  LOGIN: 50,
  AUDIT: 51,
  USER: {
    CREATE: 52,
    READ: 53,
    UPDATE: 54,
    DELETE: 55
  },
  SURVEY: {
    CREATE: 56,
    READ: 57,
    UPDATE: 58,
    DELETE: 59
  },
  ECOMMERCE: {
    PRODUCT: {
      CREATE: 60,
      READ: 61,
      UPDATE: 62,
      DELETE: 63
    },
    ORDER: {
      READ: 64,
      UPDATE: 65,
      DELETE: 66
    },
    SETTING: 67
  },
  SETTING: {
    COMPANY: 68
  },
  SHOP: {
    READ: 69,
    CREATE: 70,
    UPDATE: 71,
    DELETE: 72
  },
  PAYMENT: {
    READ: 73,
    CREATE: 74,
    UPDATE: 75,
    DELETE: 76
  },
  POS: {
    READ: 77,
    CREATE: 78,
    UPDATE: 79,
    DELETE: 80,
    ORDER: 81
  },
  TAX: {
    READ: 82,
    CREATE: 83,
    UPDATE: 84,
    DELETE: 85
  },
  DEBT: {
    READ: 88,
    CREATE: 89,
    UPDATE: 90,
    DELETE: 91
  },
  PROVIDER: {
    READ: 92,
    CREATE: 93,
    UPDATE: 94,
    DELETE: 95,
    APPROVE: 96
  },
  COMMENT: {
    READ: 97,
    CREATE: 98,
    DELETE: 99,
    UPDATE: 100
  },
  STUDENT: {
    READ: 101,
    CREATE: 102,
    DELETE: 103,
    UPDATE: 104,
    CONFIGURE: 124,
    MONTHLY_FEE: {
      READ: 105,
      CREATE: 106,
      DELETE: 107,
      UPDATE: 108,
      PAID: 109
    },
    BUS: {
      READ: 110,
      CREATE: 111,
      DELETE: 112,
      UPDATE: 113,
      PAID: 114
    },
    CLASS: {
      READ: 115,
      CREATE: 116,
      DELETE: 117,
      UPDATE: 118,
      PAID: 119
    },
    DAILY_TRACKING: {
      READ: 120,
      CREATE: 121,
      SIGN: 122,
      UPDATE: 123
    }
  },
  PROJECT: {
    READ: 128,
    CREATE: 129,
    DELETE: 130,
    UPDATE: 131
  },
  PROJECT_TASK: {
    READ: 132,
    CREATE: 133,
    DELETE: 134,
    UPDATE: 135
  }
};

export const ALL_PERMISSIONS = [
  PERMISSION.PRODUCT.CREATE, PERMISSION.PRODUCT.READ, PERMISSION.PRODUCT.UPDATE, PERMISSION.PRODUCT.DELETE,
  PERMISSION.CUSTOMER.CREATE, PERMISSION.CUSTOMER.READ, PERMISSION.CUSTOMER.UPDATE, PERMISSION.CUSTOMER.DELETE,
  PERMISSION.ORDER.SALE.CREATE, PERMISSION.ORDER.SALE.READ, PERMISSION.ORDER.SALE.UPDATE, PERMISSION.ORDER.SALE.DELETE,

  // PURCHASE
  PERMISSION.ORDER.PURCHASE.CREATE, PERMISSION.ORDER.PURCHASE.READ, PERMISSION.ORDER.PURCHASE.UPDATE, PERMISSION.ORDER.PURCHASE.DELETE,
  PERMISSION.ORDER.PURCHASE.SHOP, PERMISSION.ORDER.PURCHASE.PROVIDER, PERMISSION.ORDER.PURCHASE.AMOUNT,

  PERMISSION.INVENTORY.READ, PERMISSION.INVENTORY.GOODS_ISSUE.CREATE, PERMISSION.INVENTORY.GOODS_ISSUE.READ,
  PERMISSION.INVENTORY.GOODS_ISSUE.UPDATE, PERMISSION.INVENTORY.GOODS_ISSUE.DELETE,
  PERMISSION.INVENTORY.GOODS_RECEIPT.CREATE, PERMISSION.INVENTORY.GOODS_RECEIPT.READ,
  PERMISSION.INVENTORY.GOODS_RECEIPT.UPDATE, PERMISSION.INVENTORY.GOODS_RECEIPT.DELETE,
  PERMISSION.WAREHOUSE.CREATE, PERMISSION.WAREHOUSE.READ, PERMISSION.WAREHOUSE.UPDATE, PERMISSION.WAREHOUSE.DELETE,
  PERMISSION.COST.CREATE, PERMISSION.COST.READ, PERMISSION.COST.UPDATE, PERMISSION.COST.DELETE,
  PERMISSION.COMPANY.CREATE, PERMISSION.COMPANY.READ, PERMISSION.COMPANY.UPDATE, PERMISSION.COMPANY.DELETE,
  PERMISSION.ASSET.READ, PERMISSION.ASSET.CREATE, PERMISSION.ASSET.DELETE,
  PERMISSION.CONFIGURATION,
  PERMISSION.TEMPLATE.CREATE, PERMISSION.TEMPLATE.READ, PERMISSION.TEMPLATE.UPDATE, PERMISSION.TEMPLATE.DELETE,
  PERMISSION.EMAIL.SEND, PERMISSION.EMAIL.READ, PERMISSION.AUDIT,
  PERMISSION.USER.CREATE, PERMISSION.USER.READ, PERMISSION.USER.UPDATE, PERMISSION.USER.DELETE,
  PERMISSION.SURVEY.CREATE, PERMISSION.SURVEY.READ, PERMISSION.SURVEY.UPDATE, PERMISSION.SURVEY.DELETE,

  // ECOMMERCE
  PERMISSION.ECOMMERCE.PRODUCT.CREATE, PERMISSION.ECOMMERCE.PRODUCT.READ, PERMISSION.ECOMMERCE.PRODUCT.UPDATE, PERMISSION.ECOMMERCE.PRODUCT.DELETE,
  PERMISSION.ECOMMERCE.ORDER.UPDATE, PERMISSION.ECOMMERCE.ORDER.READ, PERMISSION.ECOMMERCE.ORDER.DELETE,
  PERMISSION.ECOMMERCE.SETTING,
  // SHOP
  PERMISSION.SHOP.CREATE, PERMISSION.SHOP.UPDATE, PERMISSION.SHOP.READ, PERMISSION.SHOP.DELETE,

  PERMISSION.PAYMENT.CREATE, PERMISSION.PAYMENT.UPDATE, PERMISSION.PAYMENT.READ, PERMISSION.PAYMENT.DELETE,
  PERMISSION.POS.CREATE, PERMISSION.POS.UPDATE, PERMISSION.POS.READ, PERMISSION.POS.DELETE, PERMISSION.POS.ORDER,

  // TAX
  PERMISSION.TAX.CREATE, PERMISSION.TAX.UPDATE, PERMISSION.TAX.READ, PERMISSION.TAX.DELETE,

  // DEBT
  PERMISSION.DEBT.CREATE, PERMISSION.DEBT.UPDATE, PERMISSION.DEBT.READ, PERMISSION.DEBT.DELETE,

  // PROVIDER
  PERMISSION.PROVIDER.CREATE, PERMISSION.PROVIDER.READ, PERMISSION.PROVIDER.UPDATE, PERMISSION.PROVIDER.DELETE, PERMISSION.PROVIDER.APPROVE,

  // COMMENT
  PERMISSION.COMMENT.CREATE, PERMISSION.COMMENT.READ, PERMISSION.COMMENT.UPDATE, PERMISSION.COMMENT.DELETE,

  // STUDENT
  PERMISSION.STUDENT.CREATE, PERMISSION.STUDENT.READ, PERMISSION.STUDENT.UPDATE, PERMISSION.STUDENT.DELETE, PERMISSION.STUDENT.CONFIGURE,
  PERMISSION.STUDENT.MONTHLY_FEE.CREATE, PERMISSION.STUDENT.MONTHLY_FEE.READ, PERMISSION.STUDENT.MONTHLY_FEE.UPDATE, PERMISSION.STUDENT.MONTHLY_FEE.DELETE, PERMISSION.STUDENT.MONTHLY_FEE.PAID,
  PERMISSION.STUDENT.CLASS.CREATE, PERMISSION.STUDENT.CLASS.READ, PERMISSION.STUDENT.CLASS.UPDATE, PERMISSION.STUDENT.CLASS.DELETE,
  PERMISSION.STUDENT.BUS.CREATE, PERMISSION.STUDENT.BUS.READ, PERMISSION.STUDENT.BUS.UPDATE, PERMISSION.STUDENT.BUS.DELETE,
  PERMISSION.STUDENT.DAILY_TRACKING.CREATE, PERMISSION.STUDENT.DAILY_TRACKING.READ, PERMISSION.STUDENT.DAILY_TRACKING.UPDATE, PERMISSION.STUDENT.DAILY_TRACKING.SIGN,

  // PROJECT
  PERMISSION.PROJECT.CREATE, PERMISSION.PROJECT.READ, PERMISSION.PROJECT.UPDATE, PERMISSION.PROJECT.DELETE,
  PERMISSION.PROJECT_TASK.CREATE, PERMISSION.PROJECT_TASK.READ, PERMISSION.PROJECT_TASK.UPDATE, PERMISSION.PROJECT_TASK.DELETE
];

export default class ACLAction extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        moduleId: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING(255) },
        remark: { type: DataTypes.TEXT }
      },
      {
        tableName: "acl_action",
        modelName: "aclAction",
        timestamps: false,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.ACLGroupAction, {
      through: models.ACLGroupAction,
      foreignKey: "actionId",
      otherKey: "groupId"
    });
    this.belongsTo(models.ACLModule, { foreignKey: "moduleId", as: "modules" });
  }
}
