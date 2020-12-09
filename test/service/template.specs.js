import {templateRender, templateRenderPDF} from "../../app/service/template/template-render.service";

describe('template', () => {
  it('Render Template', async function renderTemplate() {
    console.log(await templateRender(5, {}))
  });
  it('Render Template PDF', async function renderTemplate() {
    console.log(await templateRenderPDF(5, {}, 'test'))
  });
});
