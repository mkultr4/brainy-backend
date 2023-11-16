// import FloatingNote from "../models/FloatingNote";

/**
 * Floating Note Repository
 */
export default class FloatingNoteRepository {

    // private floatingNote: FloatingNote;

    constructor() {
        // this.floatingNote = new FloatingNote();
    }

    /**
    //  * Save a floating note
    //  * @param item : FloatingNote
    //  */
    // create(item: FloatingNote) {
    //     let currentTimestamp = (new Date()).getTime();
    //     item.createdTimestamp = currentTimestamp;
    //     item.updatedTimestamp = currentTimestamp;
    //     return item.save();
    // }
    // /**
    //  * Delete a floating note logic
    //  * @param floatingNoteId
    //  */
    // delete(uid: string) {
    //     const floatingNote = new FloatingNote();
    //     floatingNote.uid = uid;
    //     floatingNote.deleted = true;
    //     floatingNote.updatedTimestamp = (new Date()).getTime();
    //     FloatingNote.writer.put(floatingNote);
    // }
    // /**
    //  * Update a floating note
    //  * @param item :Floating note
    //  */
    // update(item: FloatingNote) {
    //     let currentTimestamp = (new Date()).getTime();
    //     item.updatedTimestamp = currentTimestamp;

    //     FloatingNote.writer.put(item);
    // }

    // //Retrieve functions

    // /**
    //  *  Get a floating note by id
    //  * @param uid :string
    //  * @returns floatingNote:FloatingnOte
    //  */
    // get(uid: string) {
    //     return FloatingNote.primaryKey.get(uid);
    // }
    // /**
    //  * Get all floating notes
    //  * @param limit
    //  */
    // list(limit: number) {
    //     FloatingNote.primaryKey.scan({ FilterExpression: ' deleted = 0' }).then(resultset => {
    //         return resultset.records;
    //     })
    // }
}
