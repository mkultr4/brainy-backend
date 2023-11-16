import { FeedbackPieceRepository } from '../../repositories/feedback-piece/FeedbackPieceRepository';
import { Piece } from '../../models/feedback-piece/Piece';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';
import logger from '../../logger';
import CoreService from '../core/CoreService';
import PinService from '../pin/PinService';
import Service from '../Service';
import { InternalServerErrorResult, CoreAccessPermissionException, NotFoundResult } from '../../util/errors/Error';
import RoleService from '../auth-permissions/RoleService';

enum Type {
    IMG = 'IMG',
    VIDEO = 'VIDEO',
    PDF = 'PDF',
}
enum Status {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED'
}
/**
 *
 */
export class FeedbackPieceService extends Service<FeedbackPieceRepository, Piece> {

    private coreService: CoreService;
    private pinService: PinService;

    constructor() {
        super(new FeedbackPieceRepository());
        this.pinService = new PinService();
        // this.coreService = new CoreService();
    }

    findAllByCoreId(coreId: string, auth?: any): Promise<Piece[]> {
        logger.info('findAllByCoreId with params', coreId);
        return new Promise<Piece[]>(async (resolve, reject) => {
            if (coreId == null) {
                reject(new NotFoundResult(`Search not found with key: ${coreId}`));
            }

            if (!RoleService.canDoAnything(<any>auth.role) || auth.core.uid !== coreId) {
                reject(new CoreAccessPermissionException('Usuario no tiene permisos'));
            }

            try {
                const pieces: any = await this.MRepository.getAllByCore(coreId);
                if (pieces) {
                  resolve(pieces);
                } else {
                  resolve([]);
                }
            } catch (error) {
                logger.error('an Error ocurred', error);
                reject(error);
            }
        });
    }

    findAllVersions(pieceId: string, auth?: any): Promise<Piece[]> {
        logger.info('findAllVersions with params', pieceId);
        return new Promise<Piece[]>(async (resolve, reject) => {
            try {
              const pieces: Piece[] = await this.MRepository.getAllVersions(pieceId);

              const filtered = pieces.filter(element => element.coreId === auth.core.uid);

              resolve(filtered);
            } catch (error) {
                logger.error('an Error ocurred', error);
                reject(error);
            }
        });
    }

    deletePiece(pieceId: string, auth?: any): Promise<Piece[]> {
        logger.info('deletePiece with params', pieceId);
        return new Promise<Piece[]>(async (resolve, reject) => {
            try {
                const pieces: Piece[] = await this.MRepository.getAllByPiceId(pieceId);

                const filteredPieces = pieces.filter(element => element.coreId === auth.core.uid);
                if (filteredPieces == null || filteredPieces === undefined || filteredPieces.length <= 0) {
                  logger.error('No pieces to delete');
                  reject(new Error('No pieces to delete'));
                }
                const pieceKeySchema = {
                    uid: filteredPieces[0].uid,
                    version: filteredPieces[0].version
                };
                logger.info('elelemnt pieceKeySchema', pieceKeySchema);
                const _modifiedOriginal = await this.MRepository.update(pieceKeySchema, {status: 'DISABLED'});
                logger.info('elelemnt _modifiedOriginal on update step 1', _modifiedOriginal);
                const _piecesWithCore: any = await this.MRepository.getAllByCore(filteredPieces[0].coreId as string);
                let piecesWithCore: Piece[] = [];
                if (_piecesWithCore && _piecesWithCore.length) {
                  piecesWithCore = piecesWithCore;
                  piecesWithCore = piecesWithCore.sort((left, rigt): number => {
                    if (left.order > rigt.order) {return -1; }
                    if (left.order < rigt.order) {return 1; }
                    return 0;
                    });
                }
                logger.info('Our current piece is order ', JSON.stringify(piecesWithCore));
                // piecesWithCore.filter(x => x.order > pieces[0].order).forEach(async (_piece) => {
                //     const _pieceVersion = {
                //         uid: _piece.uid,
                //         version: _piece.version
                //     };
                //     const newOrder = _piece.order - 1;
                //     logger.info('elelemnt _pieceVersion', _pieceVersion, ' new order ', newOrder);
                //     const _original = await this.feedbackPieceRepository
                //         .update(pieceKeySchema, {order: newOrder});
                //     logger.info('elelemnt _original on update', _original);
                // });

                resolve(filteredPieces);
            } catch (error) {
                logger.error('an Error ocurred', error);
                reject(error);
            }
        });
    }

    /**
     * If pice containsID means is new version
     */
    saveAs(piece: any, auth?: any): Promise<Array<Piece>> {
        logger.info('save method createPiece:');
        return new Promise<Array<Piece>>(async (resolve, rejected) => {
        try {
            if (piece == null) {
                rejected(new InternalServerErrorResult('Error in function save object null or undefined'));
            }

            logger.debug('Role: ', auth.role);
            logger.debug('Core: ', auth.core);
            logger.debug('Piece', piece);
            logger.debug('Core id piece: ', piece.coreId);
            if (!RoleService.canDoAnything(<any>auth.role) || auth.core.uid !== piece.coreId) {
                rejected(new CoreAccessPermissionException('Usuario no tiene permisos'));
            }

            const _pieces_created: Array<Piece> = new Array<Piece>();
            if (this.isValitToCreate(piece)) {
                logger.log('Is valid');
                const __pieces: any = await this.MRepository.getAllByCore(piece.coreId);
                let pieces: Piece[] = [];
                if (__pieces) {
                  pieces = __pieces;
                }

                logger.info('Our current piece is unorder ', JSON.stringify(pieces));

                if (pieces && pieces.length) {
                    pieces = pieces.sort((left, rigt): number => {
                        if (left.order > rigt.order) {return -1; }
                        if (left.order < rigt.order) {return 1; }
                        return 0;
                    });
                }
                logger.info('Our current piece is order ', JSON.stringify(pieces));
                piece.order = pieces && pieces.length ? pieces[0].order as number + 1 : 1;
                piece.version = 1;
                const _pieces: Array<any> = piece.pieces;
                for (const x of _pieces) {
                    try {
                        const _piece = this.buildModelPiece(piece, x);
                        logger.info('Our current piece is ', _piece);
                        const _saved = await this.MRepository.save(_piece);
                        piece.order = piece.order + 1;
                        logger.info('elelemnt saved', _saved);
                        _pieces_created.push(_saved);
                    } catch (error) {
                        logger.error(error, 'piece[ ', piece, '] params [', x);
                    }
                }
                try {
                    logger.info('Start update core with first piece on aour elements [' + piece.coreId);
                    const _properties: any =  piece.pieces[0].properties;
                    this.coreService.update(piece.coreId, {thumbnail: _properties.previewUrl}).then(data => {
                        logger.info('Updated core');
                    }).catch(error => logger.error('Update not works', error));
                } catch (error) {
                    logger.error('Update core fails trace', error);
                }
                resolve(_pieces_created);
            } else {
                logger.error('Invalid params');
                rejected(new Error('Invalid params'));
            }
        } catch (error) {
            logger.error(error);

            rejected(error);
        }
        });
    }

    createNewVersion(piece: any, keepPins: boolean, auth?: any): Promise<Piece> {
        logger.info('save method createNewVersion:', piece);
        return new Promise<Piece>(async (resolve, rejected) => {
          try {
            if (piece == null) {
                rejected(new InternalServerErrorResult('Error in function create new version object null or undefined'));
            }
            if (!RoleService.canDoAnything(<any>auth.role) || auth.core.uid !== piece.coreId) {
                rejected(new CoreAccessPermissionException('Usuario no tiene permisos'));
            }

            logger.info('Is valid isValitToCreateVerison => piece.id', piece.id);
            if (this.isValitToCreateVerison(piece)) {
              logger.info('Is valid isValitToCreateVerison');
              const pieces_version: Piece[] = await this.MRepository.getAllByPiceId(piece.id);
              logger.info('Is pieces_version', pieces_version);
              if (pieces_version && pieces_version.length) {
                if (pieces_version.length) {
                  pieces_version.sort((left, rigt): number => {
                    if (left.version > rigt.version) { return -1; }
                    if (left.version < rigt.version) { return 1; }
                    return 0;
                  });
                }

                logger.info('Our current pieces_version is unorder ', JSON.stringify(pieces_version));
                piece.order = pieces_version[0].order;
                // tslint:disable-next-line:radix
                piece.version = pieces_version.length ? parseInt(pieces_version[0].version as string) + 1 : 1;
                const pieceKeySchema = {
                  uid: pieces_version[0].uid,
                  version: pieces_version[0].version
                };
                try {
                  const _piece = this.buildModelPieceWithVersion(piece, piece.pieces[0]);
                  logger.info('Our current piece is ', _piece);
                  const _saved = await this.MRepository.save(_piece);
                  logger.info('elelemnt pieceKeySchema', pieceKeySchema);
                  const _modifiedOriginal = await this.MRepository.update(pieceKeySchema, {status: 'DISABLED'});
                  logger.info('elelemnt saved', _saved);
                  logger.info('elelemnt original modified', _modifiedOriginal);
                } catch (error) {
                  logger.error(error, 'piece[ ', piece, '] params [', piece.pieces);
                  rejected(error);
                }
                try {
                  logger.info('Start update core with first piece on aour elements [' + piece.coreId);
                  this.coreService.update(piece.coreId, {thumbnail: piece.pieces[0].properties.previewUrl}).then(data => {
                      logger.info('Updated core');
                  }).catch(error => {
                    logger.error('Update not works', error);
                  });
                } catch (error) {
                  logger.error('Update core fails trace', error);
                }
                try {
                  logger.info('Delete pins [' + piece.coreId);
                  if (!keepPins) {
                    const keySchema = pieceKeySchema.uid + '-' + pieceKeySchema.version;
                    logger.info('keySchema', keySchema);
                    const _pines = await this.pinService.findByOriginReference(pieceKeySchema.uid as string);
                    if (_pines && _pines.length) {
                      logger.info('Pines to deleted', _pines);
                      for (const pin of _pines ) {
                        logger.info('Pine to deleted', pin);
                        this.pinService.logicalDelete(pin.uid);
                      }
                    }
                  }
                } catch (error) {
                  logger.error('Delete pinse', error);
                }
                resolve(piece);
                } else {
                  logger.error('No elements found with argument in orer to create newVersion' + piece.id);
                  rejected(new Error('No elements found with argument in orer to create newVersion' + piece.id));
                }
              } else {
                logger.error('Invalid params');
                rejected(new Error('Invalid params'));
              }
          } catch (error) {
              logger.error(error);
              rejected(error);
          }

      });
    }

    /**
     * The minum attribute to pass
     * @param piece All params useful for create a piece
     */
    private isValitToCreate(piece: any): boolean {
        if (!piece.coreId) {
          return false;
        } else {
          return true;
        }

    }

    /**
     * The minum attribute to pass
     * @param piece All params useful for create a piece
     */
    private isValitToCreateVerison(piece: any): boolean {
        if (piece.id && piece.pieces && piece.pieces.length) {
          return true;
        } else {
          return false;
        }
    }

    private buildModelPiece(piece: any, properties: any ): Piece {
        return {
            uid: uuid(),
            version: piece.version,
            coreId: piece.coreId,
            createdAt: moment().milliseconds(),
            lastModifiedAt: moment().milliseconds(),
            deletedAt: moment().milliseconds(),
            deleted: false,
            userCreated: piece.userCreated,
            status: Status.ENABLED,
            order: piece.order,
            type_store: piece.type_store ? piece.type_store : Type.IMG,
            properties: properties,
            bucketInfo: properties.bucketInfo
        };
    }

    private buildModelPieceWithVersion(piece: any, properties: any ): Piece {
        return {
            uid: piece.id,
            version: piece.version,
            coreId: piece.coreId,
            createdAt: moment().milliseconds(),
            lastModifiedAt: moment().milliseconds(),
            deletedAt: moment().milliseconds(),
            deleted: false,
            userCreated: piece.userCreated,
            status: Status.ENABLED,
            order: piece.order,
            type_store: piece.type_store ? piece.type_store : Type.IMG,
            properties: properties,
            bucketInfo: properties.bucketInfo
        };
    }
}
