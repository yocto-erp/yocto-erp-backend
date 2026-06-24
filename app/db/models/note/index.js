import Note from './note';
import CompanyNote from './company-note';
import NoteAsset from './note-asset';

export const initNoteModel = sequelize => ({
  Note: Note.init(sequelize),
  CompanyNote: CompanyNote.init(sequelize),
  NoteAsset: NoteAsset.init(sequelize)
});
