import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { isArrayHasLength } from '../../util/func.util';

export function listNoteCompany(user, query) {
  const { companyId } = query;
  return db.CompanyNote.findAll({
    where: {
      companyId: companyId
    },
    include: [
      {
        model: db.Note,
        as: 'note',
        include: [{
          model: db.User,
          as: 'createdBy',
          attributes: ['id', 'displayName', 'email']
        }]
      }
    ]
  }).then((resp) => {
    return resp.map(t => t.note);
  });
}

export async function getNoteCompany(user, nId) {
  const note = await db.Note.findOne({
    where: {
      id: nId
    },
    include: [
      {
        model: db.Asset,
        as: 'assets'
      }
    ]
  });
  if (!note) {
    throw badRequest('note', FIELD_ERROR.INVALID, 'note not found');
  }
  return note;
}

export async function createNoteCompany(user, createForm) {
  const transaction = await db.sequelize.transaction();

  try {
    const newNote = await db.Note.create(
      {
        note: createForm.note,
        createdById: user.id,
        createdDate: new Date()
      },
      { transaction }
    );

    if (isArrayHasLength(createForm.assets)) {
      await db.NoteAsset.bulkCreate(
        createForm.assets.map((t) => ({
          noteId: newNote.id,
          assetId: t.id
        })),
        { transaction }
      );
    }
    if (createForm.companyId) {
      await db.CompanyNote.create(
        {
          companyId: createForm.companyId,
          noteId: newNote.id
        },
        { transaction }
      );
    }
    await transaction.commit();

    return newNote;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateNoteCompany(noteId, user, updateForm) {
  const checkNote = await db.Note.findByPk(noteId);
  if (!checkNote) {
    throw badRequest('note', FIELD_ERROR.INVALID, 'Note not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await checkNote.update(
      {
        note: updateForm.note.trim()
      },
      transaction
    );

    await db.CompanyNote.destroy(
      {
        where: {
          noteId: checkNote.id
        }
      },
      { transaction }
    );
    await db.NoteAsset.destroy(
      {
        where: {
          noteId: checkNote.id
        }
      },
      { transaction }
    );

    if (isArrayHasLength(updateForm.assets)) {
      await db.NoteAsset.bulkCreate(
        updateForm.assets.map((t) => ({
          noteId: noteId,
          assetId: t.id
        })),
        { transaction }
      );
    }
    if (updateForm.companyId) {
      await db.CompanyNote.create(
        {
          companyId: updateForm.companyId,
          noteId: noteId
        },
        { transaction }
      );
    }

    await transaction.commit();

    return checkNote;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
export async function removeNoteCompany(user, noteId) {
  const checkNote = await db.Note.findByPk(noteId);
  if (!checkNote) {
    throw badRequest('note', FIELD_ERROR.INVALID, 'Note not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await db.CompanyNote.destroy(
      {
        where: {
          noteId: checkNote.id
        }
      },
      { transaction }
    );
    await db.NoteAsset.destroy(
      {
        where: {
          noteId: checkNote.id
        }
      },
      { transaction }
    );
    await checkNote.destroy({ transaction });
    await transaction.commit();
    return checkNote;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

