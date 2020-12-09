import Mustache from 'mustache';
import fs from 'fs';
import path from 'path'
import db from "../../db/models";
import {formatDateTime} from "./template.util";

const puppeteer = require('puppeteer');


const RENDER_FOLDER = path.resolve(__dirname, '..', '..', 'renderFolder');
const CONTENT_CSS = path.resolve(__dirname, 'print', 'content.min.css');
if (!fs.existsSync(`${RENDER_FOLDER}/`)) {
  fs.mkdirSync(`${RENDER_FOLDER}/`);
}

export async function templateRender(templateId, object) {
  const rs = await db.Template.findOne({
    where: {
      id: templateId
    },
    include: [
      {
        model: db.User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      }, {
        model: db.TemplateType, as: 'templateType'
      }
    ]
  });

  const renderHtml = Mustache.render(rs.content, object);
  const templateHTML = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'UTF-8');
  return Mustache.render(templateHTML, {body: renderHtml});
}

export async function printTemplateRender(templateId, object) {
  const rs = await db.Template.findOne({
    where: {
      id: templateId
    },
    include: [
      {
        model: db.User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      }, {
        model: db.TemplateType, as: 'templateType'
      }
    ]
  });

  const renderHtml = Mustache.render(rs.content, object);
  const templateHTML = fs.readFileSync(path.resolve(__dirname, 'print_template.html'), 'UTF-8');
  return {
    template: rs,
    body: Mustache.render(templateHTML, {body: renderHtml})
  }
}

export async function templateRenderPDF(templateId, object, name) {
  const template = await printTemplateRender(templateId, object);
  const templateLastUpdated = formatDateTime(template.template.lastUpdatedDate);
  const fileName = `${RENDER_FOLDER}/${name}_${templateLastUpdated}.pdf`;
  if (fs.existsSync(fileName)) {
    console.log('FileExisted')
    return fileName;
  }
  return Promise.all([puppeteer.launch(), printTemplateRender(templateId, object)])
    .then(async ([browser, print]) => {
      const page = await browser.newPage();
      await page.setContent(print.body, {waitUntil: 'networkidle0'})
      console.log(CONTENT_CSS);
      await page.addStyleTag({path: CONTENT_CSS})
      await page.pdf({path: fileName, format: 'a4'});
      await browser.close();
      return fileName;
    })
}
