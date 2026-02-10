package src/models/Note.js
/** @typedef {Object} NoteData
 * @property {string} title
 * @property {Date|Object} dateTime
 * @property {string} [content]
 * @property {string} [imageUrl]
 * @property {Array<string>} [attachments]
 */
export { NoteData };
class Note {
  /**
   * @param {NoteData} data
   */
  constructor(data) {
    this.title = data.title;
    this.dateTime = data.dateTime;
    this.content = data.content;
    this.imageUrl = data.imageUrl;
    this.attachments = data.attachments !== undefined ? data.attachments : undefined;
  }
  static fromJson(json) {
    if (!json) json = {};
    const title = json.title ?? '';
    const dateTime = json.dateTime ?? new Date();
    const content = json.content;
    const imageUrl = json.imageUrl;
    const attachments = json.attachments ?? undefined;
    return new Note({ title, dateTime, content, imageUrl, attachments });
  }
  toJson() {
    const obj = {
      title: this.title,
      dateTime: this.dateTime,
    };
    if (this.content !== undefined) obj.content = this.content;
    if (this.imageUrl !== undefined) obj.imageUrl = this.imageUrl;
    if (this.attachments !== undefined) obj.attachments = this.attachments;
    return obj;
  }
}
export default Note;