import PIECE, { Piece } from '../../models/feedback-piece/Piece';
import logger from '../../logger';
import Repository from '../Repository';
import {orm} from '../../models/index';

/**
 * Store al pice that have every core-feedback
 */
export class FeedbackPieceRepository extends Repository<Piece>  {

    constructor() {
        orm.init();
      super(orm.getModel(PIECE.name));
    }
    /**
     * Gets all piece by box core Id
     * @param coreId Id of index query
     */
    getAllByCore(coreId: string): Promise<Array<Piece>> | undefined {
        return new Promise<Array<Piece>>((resolve, rejected) => {
            try {
                logger.info('Start getAllByCore', coreId);
                this.Model.scan('coreId')
                     .contains(coreId)
                     .where('status').eq('ENABLED')
                     .exec((err: any, obj: Array<Piece>) => {
                    if (err != null) {
                        logger.error('Error on getAllByCore', err);
                        rejected (err);
                    } else {
                        logger.info('Our data in database is', obj);
                        resolve(obj);
                    }
                });
            } catch (error) {
                logger.error('an Error ocurred', error);
                rejected(error);
            }
        });
    }

    /**
     * In order to keep one piece many versions of the same piece
     * PieceId<uid> is repeteable
     * @param pieceId Uid our piece
     */
    getAllByPiceId(pieceId: string): Promise<Array<Piece>> {
        return new Promise<Array<Piece>>((resolve, rejected) => {
            try {
                logger.debug('Start getAllByPiceId', pieceId);
                this.Model.scan('uid')
                    .contains(pieceId)
                    .where('status').eq('ENABLED')
                    .exec((err: any, obj: Piece[]) => {
                    if (err != null) {
                      logger.error('error getAllByPiceId', err);
                      rejected (err);
                    } else {
                      logger.debug('resolve getAllByPiceId', obj);
                      resolve(obj);
                    }
                });
            } catch (error) {
                logger.error('an Error ocurred', error);
                rejected(error);
            }
        });
    }

     /**
     * In order to keep one piece many versions of the same piece
     * PieceId<uid> is repeteable
     * @param pieceId Uid our piece
     */
    getAllVersions(pieceId: string): Promise<Piece[]> {
        return new Promise<Piece[]>((resolve, rejected) => {
            try {
                logger.debug('Start getAllByPiceId', pieceId);
                this.Model.scan('uid')
                    .contains(pieceId)
                    .exec((err: any, obj: Piece[]) => {
                    if (err != null) {
                      rejected (err);
                    } else {
                      resolve(obj);
                    }
                });
            } catch (error) {
                logger.error('an Error ocurred', error);
                rejected(error);
            }
        });
    }

}
