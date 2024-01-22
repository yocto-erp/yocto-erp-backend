import queue from "fastq";
import db from "../db/models";
import {eventLog} from "../config/winston";
import {sendErrorMessage} from "../service/partner/telegram";

async function worker(tagging, cb) {
  console.log('Update counting tagging', tagging)
  const where = {};
  if (tagging && tagging.length) {
    where.taggingId = {
      [db.Sequelize.Op.in]: tagging
    };
  }
  try {
    const taggingSummary = await db.TaggingItem.findAll({
      attributes: ['taggingId', [db.Sequelize.fn('count', db.Sequelize.col('*')), 'total']],
      group: ['taggingId'],
      where,
      raw: true
    });

    // console.log(taggingSummary);
    if (taggingSummary && taggingSummary.length) {
      for (let i = 0; i < taggingSummary.length; i += 1) {
        const {taggingId, total} = taggingSummary[i];
        db.Tagging.update({
          total,
          lastUpdatedDate: new Date()
        }, {
          where: {
            id: taggingId
          },
          fields: ['total']
        })
      }
    }
    cb(null, taggingSummary);
  } catch (e) {
    eventLog.error(e.message, e);
    sendErrorMessage(e.stack).then();
  }
}

export const TaggingQueue = queue(worker, 1);

export function addTaggingQueue(tagging, cb = () => {
}) {
  return TaggingQueue.push(tagging, cb)
}
