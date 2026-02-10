package
const { Query } = require('firebase-admin/firestore');

const NoteQuery = Object.freeze({
  titleAsc: 'titleAsc',
  titleDesc: 'titleDesc',
  dateAsc: 'dateAsc',
  dateDesc: 'dateDesc',
});

function applyNoteQuery(query, noteQuery) {
  if (!(query instanceof Query)) {
    throw new Error('First argument must be a Firestore Query');
  }
  switch (noteQuery) {
    case NoteQuery.titleAsc:
      return query.orderBy('title');
    case NoteQuery.titleDesc:
      return query.orderBy('title', 'desc');
    case NoteQuery.dateAsc:
      return query.orderBy('dateTime');
    case NoteQuery.dateDesc:
      return query.orderBy('dateTime', 'desc');
    default:
      return query;
  }
}

module.exports = { NoteQuery, applyNoteQuery };