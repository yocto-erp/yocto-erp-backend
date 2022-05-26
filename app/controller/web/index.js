import { initWebAuthController } from "./auth.controller";
import { initWebWarehouseController } from "./warehouse/warehouse.controller";
import { initWebCompanyController } from "./company/company.controller";
import { initWebInventoryController } from "./inventory/inventory.controller";
import { initWebInventoryGoodReceiptController } from "./inventory/goods-receipt.controller";
import { initWebInventoryGoodIssueController } from "./inventory/goods-issue.controller";
import { initWebProductController } from "./product/product.controller";
import { initWebInventorySummaryController } from "./inventory/inventory-summary.controller";
import { initWebOrderPurchaseController } from "./order/purchase.controller";
import { initWebOrderSaleController } from "./order/sale.controller";
import { initWebCostController } from "./cost/cost.controller";
import { initWebAssetController } from "./asset.controller";
import { initWebPersonController } from "./person/person.controller";
import { initTemplateController } from "./template/template.controller";
import { initTemplateTypeController } from "./template/template-type.controller";
import { initSurveyController } from "./survey/survey.controller";
import { initWebSurveyAdminController } from "./survey/survey-admin.controller";
import { initSurveyQuestionAdminController } from "./survey/survey-question-admin.controller";
import { initEmailTemplateController } from "./template/template-email.controller";
import { initWebLogController } from "./log.controller";
import { initEmailController } from "./email.controller";
import { initSummaryController } from "./summary/summary.controller";
import { initManualController } from "./manual/manual.controller";
import { initTaggingController } from "./tagging/tagging.controller";
import { initAuditController } from "./audit/audit.controller";
import { initWebUserController } from "./user/user.controller";
import { initEcommerceController } from "./ecommerce";
import { initConfigureController } from "./configuration";
import { initWebEcommerceShopController } from "./public/ecommerce-shop.controller";
import { initStudentController } from "./student";
import { initWebSaleController } from "./sale";
import { initTaxController } from "./tax";
import { initWebPartnerController } from "./partner/partner.controller";
import { initFinanceController } from "./finance";
import { initWebDebtController } from "./debt/debt.controller";
import { initDashboardController } from "./dashboard";
import { initWebMemberController } from "./user/member.controller";
import { initWebProvidersController } from "./provider";
import { initWebCommentController } from "./comment.controller";
import { initWebWorkspaceController } from "./workspace.controller";

export function initWebController(app) {
  initWebAuthController(app);
  initWebWarehouseController(app);
  initWebCompanyController(app);
  initWebInventoryController(app);
  initWebInventoryGoodReceiptController(app);
  initWebInventoryGoodIssueController(app);
  initWebInventorySummaryController(app);
  initWebProductController(app);
  initWebOrderPurchaseController(app);
  initWebOrderSaleController(app);
  initWebCostController(app);
  initWebPersonController(app);
  initWebAssetController(app);
  initConfigureController(app);
  initStudentController(app);
  initTemplateController(app);
  initTemplateTypeController(app);
  initSurveyController(app);
  initWebSurveyAdminController(app);
  initSurveyQuestionAdminController(app);
  initEmailTemplateController(app);
  initWebLogController(app);
  initEmailController(app);
  initSummaryController(app);
  initManualController(app);
  initTaggingController(app);
  initAuditController(app);
  initWebUserController(app);
  initEcommerceController(app);
  initWebEcommerceShopController(app);
  initWebSaleController(app);
  initTaxController(app);
  initWebPartnerController(app);
  initFinanceController(app);
  initWebDebtController(app);
  initDashboardController(app);
  initWebMemberController(app);
  // initWebDebtCommonController(app);
  initWebProvidersController(app);
  initWebCommentController(app);
  initWebWorkspaceController(app);
}
