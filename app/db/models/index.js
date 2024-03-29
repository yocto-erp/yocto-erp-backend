import Sequelize from 'sequelize';
import User from './user/user';
import EmailSend from './email/email-send';
import ACLAction from './acl/acl-action';
import ACLGroup from './acl/acl-group';
import ACLGroupAction from './acl/acl-group-action';
import ACLGroupActionShop from './acl/acl-group-action-shop';
import ACLModule from './acl/acl-module';
import UserActivate from './user/user-activate';
import SystemProperty from './system-property';
import databaseConfig from '../../config/database';
import UserResetPassword from './user/user-reset-password';
import Company from './company/company';
import CompanyPerson from './company/company-person';
import CompanyShop from './company/company-shop';
import Cost from './cost/cost';
import CostPurpose from './cost/cost-purpose';
import CostAsset from './cost/cost-asset';
import Inventory from './inventory/inventory';
import InventoryDetail from './inventory/inventory-detail';
import InventoryPurpose from './inventory/inventory-purpose';
import InventorySummary from './inventory/inventory-summary';
import Person from './person';
import Shop from './shop';
import UserCompany from './user/user-company';
import UserShop from './user/user-shop';
import WareHouse from './warehouse';
import Audit from './audit';
import InventoryDetailSerial from './inventory/inventory-detail-serial';
import BusinessAction from './business-action';
import InventorySummarySerial from './inventory/inventory-summary-serial';
import Tagging from './tagging/tagging';
import TaggingItem from './tagging/tagging-item';
import TaggingItemType from './tagging/tagging-item-type';
import CompanyConfigure from './company/company-configure';
import Template from './template/template';
import TemplateType from './template/template-type';
import TemplateTypePlugin from './template/template-type-plugin';
import TemplatePluginVariables from './template/template-plugin-variables';
import EmailCompany from './email/email-company';
import EmailAttachment from './email/email-attachment';
import Survey from './survey/survey';
import SurveyPerson from './survey/survey-person';
import SurveyPersonAnswer from './survey/survey-person-answer';
import SurveyQuestion from './survey/survey-question';
import SurveyQuestionAnswer from './survey/survey-question-answer';
import OTP from './otp';
import SurveyI18N from './survey/survey_i18n';
import SurveyQuestionI18N from './survey/survey-question-i18n';
import SurveyQuestionAnswerI18N from './survey/survey-question-answer-i18n';
import Language from './language';
import EmailTemplate from './email/email-template';
import ReportCostDaily from './cost/report-cost-daily';
import { initEcommerceModel } from './ecommerce';
import { initDebtModel } from './debt';
import { initStudentModel } from './student';
import { initPaymentModel } from './payment';
import { initSaleModel } from './sale';
import { initTaxModel } from './tax';
import { initOrderModel } from './order';
import { initPartnerModel } from './partner';
import { initScope } from './scope';
import { initAssetModel } from './asset';
import { initProviderModel } from './provider';
import Comment from './comment/comment';
import { initProductModel } from './product';
import { initProjectModel } from './project';
import { initFormModel } from './form';


const env = process.env.NODE_ENV || 'development';

const config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  ...databaseConfig[env]
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
  // ACL
  ACLAction: ACLAction.init(sequelize),
  ACLGroup: ACLGroup.init(sequelize),
  ACLGroupAction: ACLGroupAction.init(sequelize),
  ACLGroupActionShop: ACLGroupActionShop.init(sequelize),
  ACLModule: ACLModule.init(sequelize),

  // Company
  Company: Company.init(sequelize),
  CompanyPerson: CompanyPerson.init(sequelize),
  CompanyShop: CompanyShop.init(sequelize),
  CompanyConfigure: CompanyConfigure.init(sequelize),

  // Cost
  Cost: Cost.init(sequelize),
  CostPurpose: CostPurpose.init(sequelize),
  CostAsset: CostAsset.init(sequelize),
  ReportCostDaily: ReportCostDaily.init(sequelize),
  // Email
  EmailSend: EmailSend.init(sequelize),
  EmailCompany: EmailCompany.init(sequelize),
  EmailAttachment: EmailAttachment.init(sequelize),
  EmailTemplate: EmailTemplate.init(sequelize),

  // Inventory
  Inventory: Inventory.init(sequelize),
  InventoryDetail: InventoryDetail.init(sequelize),
  InventoryPurpose: InventoryPurpose.init(sequelize),
  InventorySummary: InventorySummary.init(sequelize),
  InventorySummarySerial: InventorySummarySerial.init(sequelize),
  InventoryDetailSerial: InventoryDetailSerial.init(sequelize),

  // Order
  ...initOrderModel(sequelize),

  // Partner
  ...initPartnerModel(sequelize),

  // Product
  ...initProductModel(sequelize),

  // User
  User: User.init(sequelize),
  UserActivate: UserActivate.init(sequelize),
  UserResetPassword: UserResetPassword.init(sequelize),
  UserCompany: UserCompany.init(sequelize),
  UserShop: UserShop.init(sequelize),

  // Asset
  ...initAssetModel(sequelize),

  // Form
  ...initFormModel(sequelize),

  // BusinessAction
  BusinessAction: BusinessAction.init(sequelize),

  // Audit
  Audit: Audit.init(sequelize),

  // Person
  Person: Person.init(sequelize),

  // Shop
  Shop: Shop.init(sequelize),

  // SystemProperty
  SystemProperty: SystemProperty.init(sequelize),

  // Tagging
  Tagging: Tagging.init(sequelize),
  TaggingItem: TaggingItem.init(sequelize),
  TaggingItemType: TaggingItemType.init(sequelize),

  // Student
  ...initStudentModel(sequelize),

  // WareHouse
  WareHouse: WareHouse.init(sequelize),

  // Template
  Template: Template.init(sequelize),
  TemplateType: TemplateType.init(sequelize),
  TemplateTypePlugin: TemplateTypePlugin.init(sequelize),
  TemplatePluginVariables: TemplatePluginVariables.init(sequelize),

  // Survey
  Survey: Survey.init(sequelize),
  SurveyI18N: SurveyI18N.init(sequelize),
  SurveyPerson: SurveyPerson.init(sequelize),
  SurveyPersonAnswer: SurveyPersonAnswer.init(sequelize),
  SurveyQuestion: SurveyQuestion.init(sequelize),
  SurveyQuestionI18N: SurveyQuestionI18N.init(sequelize),
  SurveyQuestionAnswer: SurveyQuestionAnswer.init(sequelize),
  SurveyQuestionAnswerI18N: SurveyQuestionAnswerI18N.init(sequelize),

  // OTP
  OTP: OTP.init(sequelize),

  Language: Language.init(sequelize),

  // SALE
  ...initSaleModel(sequelize),

  // ECOMMERCE
  ...initEcommerceModel(sequelize),
  // Debt
  ...initDebtModel(sequelize),
  // Payment
  ...initPaymentModel(sequelize),
  // Tax
  ...initTaxModel(sequelize),

  // Provider
  ...initProviderModel(sequelize),

  // Comment
  Comment: Comment.init(sequelize),

  // Project
  ...initProjectModel(sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

initScope(models);

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
