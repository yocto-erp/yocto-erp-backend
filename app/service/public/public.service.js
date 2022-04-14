import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {isArray} from '../../util/func.util';

const {Op} = db.Sequelize;

export async function listPublicECommerceProducts(query, order, offset, limit) {
  const {tagging, search, publicId} = query;
  const company = await db.Company.findOne({where: {publicId}});
  if (!company) {
    throw badRequest('company', FIELD_ERROR.INVALID, 'company not found');
  }
  const where = {companyId: company.id};
  if (search && search.length) {
    where[Op.or] = [
      {
        webDisplayName: {
          [Op.like]: `%${search}%`
        }
      },
      {
        description: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  const whereTagging = {};
  let isTaggingRequired = false;
  if (tagging && tagging.id) {
    whereTagging.taggingId = {
      [Op.in]: isArray(tagging.id) ? tagging.id : [tagging.id]
    };
    isTaggingRequired = true;
  }
  return db.EcommerceProduct.findAndCountAll({
    order,
    where,
    include: [
      {
        model: db.Product, as: 'product', required: true,
        include: [{
          model: db.TaggingItem,
          required: isTaggingRequired,
          as: 'taggingItems',
          where: whereTagging
        }]
      },
      {
        model: db.Asset, as: "thumbnail", include: [
          { model: db.AssetIpfs, as: "ipfs" }
        ]
      },
      { model: db.Tagging, as: "tagging" },
      { model: db.TaxSet, as: "taxSet" },
      { model: db.ProductUnit, as: "unit", where: { productId: { [Op.col]: "ecommerceProduct.productId" } } }
    ],
    offset,
    limit,
    group: ['id']
  }).then(async (resp) => {
    const newRows = [];
    for (let i = 0; i < resp.rows.length; i += 1) {
      const item = resp.rows[i];
      newRows.push({
        ...item.get({plain: true})
      });
    }
    return ({
      count: resp.count.length,
      rows: newRows
    });
  });
}

export function getListTags(query, order, offset, limit) {
  const {search} = query;
  const where = {};
  if (search && search.length) {
    where.label = {
      [Op.like]: `%${search}%`
    };
  }
  return db.Tagging.findAndCountAll({
    order,
    where,
    include: [{
      model: db.User, as: 'createdBy'
    }],
    offset,
    limit
  });
}
