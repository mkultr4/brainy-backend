import FloatingNote from '../models/FloatingNote';
import FloatingNoteRepository from '../repositories/FloatingNoteRepository';


export default class FloatingNoteService {

    private floatingNoteRepository: FloatingNoteRepository;

    /**
     * Constructor
     */
    constructor() {
        this.floatingNoteRepository = new FloatingNoteRepository();
    }

    // /**
    //  * Create a floating note
    //  * @param floatingNote :FloatingNote
    //  */
    // create(floatingNote: FloatingNote) {
    //     this.floatingNoteRepository.create(floatingNote);
    // }

    // /**
    //  * Update a floating note
    //  * @param floatingNote :FloatingNote
    //  */
    // update(floatingNote: FloatingNote) {
    //     this.floatingNoteRepository.update(floatingNote);
    // }

    // /**
    //  * Delete a floating note
    //  * @param uid : string
    //  */
    // delete(uid: string) {
    //     this.floatingNoteRepository.delete(uid);
    // }

    // //Retrieve

    // /**
    //  *  Get floating note by id
    //  * @param uid 
    //  */
    // get(uid: string) {
    //     return this.floatingNoteRepository.get(uid);

    // }
    
    // /**
    //  * Find all floating note
    //  * @param limit 
    //  */
    // list(limit: number = 0) {
    //     return this.floatingNoteRepository.list(limit);
    // }


}
