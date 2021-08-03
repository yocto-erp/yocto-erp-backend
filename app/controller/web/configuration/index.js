import { initCompanyConfigurationController } from './company-configure.controller';
import { initEmailConfigurationController } from './email.controller';

export function initConfigureController(app){
  initCompanyConfigurationController(app)
  initEmailConfigurationController(app)
}
