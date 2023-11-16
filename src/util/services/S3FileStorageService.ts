import * as AWS from 'aws-sdk';
import logger from '../../logger';

const s3 = new AWS.S3();

AWS.config.update({
    region: 'us-east-1'
});

export enum Operation {
  putObject = 'putObject',
  getObject = 'getObject',
  objectExists = 'objectExists'
}
export enum OperationBucketWait {
  objectExists = 'objectExists',
  bucketNotExists = 'bucketNotExists'
}

/**
 * In order to have acces control to S3 controls limits and so on
 * @author Fidel Saldivar Sanchez
 */
export class S3FileStorageService {

  private encoding = 'base64';
  private defaultTime: number = 60 * 2;
  constructor() {}

  /**
   * Creates a post pre-signed
   * @param bucketName Name of bucket not public
   * @param path  every file in our buecket it could be by user
   * @param operation it cout be putObject or gutObject
   * @param expires
   * @returns presing or null
   * if presigned success return url and fields into fields return bucket ans policy
   */
  async createUrlPreSigned(
    bucketName: string, path: string, operation: Operation.getObject | Operation.putObject, expires: number | null
  ): Promise<any | null> {
    return new Promise<any | null>(async (resolve, rejected) => {
      if (bucketName === undefined || path === undefined || operation === undefined) {
        logger.error('Invalid params');
        rejected(null);
      } else {
        const params = {
            Bucket: bucketName,
            Key: path,
            Expires: expires ? this.defaultTime :  expires

        };
        s3.getSignedUrl(operation, params, (error, data) => {
          if (error) {
            logger.error('Could not generate presignet', error);
            rejected(null);
          } else {
            // console.info('Url', data);
            resolve(data);
          }
        });
      }
    });
  }

  /**
   *
   * @param bucketName string name of bucket pass by argument
   * @param path path where want to store file
   * @param file string Element base 64
   * @param contentType img fomat png jpg so on
   * @returns data = {
   *   ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
   * ServerSideEncryption: "AES256",
   * VersionId: "Ri.vC6qVlA4dEnjgRV4ZHsHoFIjqEMNt"
   * }
   */
  async upload(bucketName: string, path: string, file: string | Buffer, contentType: string, acl: string | null): Promise<any | null>  {
    return new Promise<any | null>(async (resolve, rejected) => {
      if (bucketName === undefined || path === undefined || file === undefined || contentType === undefined) {
        logger.error('Invalid params');
        rejected(null);
      } else {
        let body = file;
        if (typeof file === 'string') {
          body = new Buffer(file, this.encoding);
        }

        let params;
        params = {
          Bucket: bucketName,
          Key: path,
          Body: body,
          ContentEncoding: this.encoding,
          ContentType: contentType,
          ACL: this.getACL(acl)
        };

        s3.putObject(params, (err: any, data: any) => {
          if (err) {
            logger.error('Could not upload file', err);
            rejected(null);
          } else {
            logger.debug('upload', data);
            resolve(data);
          }
        });

      }
    });

  }
  private getACL(acl: string | null): string {
    const _acl = 'private';
    if (acl == null) {
      return _acl;
    }
    return acl;
  }

  /**
   *
   * @param bucketName where i want to get
   * @param path Aour file
   * @param versionId Version it could be null
   */
  async download(bucketName: string, path: string, versionId: string | null): Promise<any | null> {
    return new Promise<any | null>(async (resolve, rejected) => {
      if (bucketName === undefined || path === undefined) {
        logger.error('Invalid params');
        rejected(null);
      }
      let params;
      if (versionId == null) {
        params = {
          Bucket: bucketName,
          Key: path
        };
      } else {
        params = {
          Bucket: bucketName,
          Key: path,
          VersionId: versionId
        };
      }

      s3.getObject(params, (err, data) => {
        if (err) {
          logger.error('Could not get file', err);
          rejected(null);
        } else {
          logger.debug('get', data);
          resolve(data);
        }
      });
    });
  }

  async create(bucketName: string, path: string): Promise<any | null> {
    return new Promise<any | null>(async (resolve, rejected) => {
      if (bucketName === undefined || path === undefined) {
        logger.error('Invalid params');
        rejected(null);
      }
      path = path.trim();

      if (path.indexOf('/') !== -1) {
        console.log('path names cannot contain slashes.');
        rejected(null);
      }
      const params = {
        Bucket: bucketName,
        Key: path
      };
      s3.headObject(params, (error, data) => {
        if (error) {
          console.log(error);
          rejected(null);
        }
        s3.putObject(params, (errPut, dataPut) => {
          if (errPut) {
            console.log(errPut);
            rejected(null);
          }
          resolve(dataPut);
        });
      });
    });
  }

  /**
   *
   * @param bucketSource
   * @param bucketTarget
   * @param path
   * @param acl  private | public-read | public-read-write | authenticated-read
   * | aws-exec-read | bucket-owner-read | bucket-owner-full-control
   */
  async copy(bucketSource: string, bucketTarget: string, path: string, acl: string | null): Promise<any | null> {
    return new Promise<any | null>(async (resolve, rejected) => {
      if (bucketSource === undefined || bucketTarget === undefined || path === undefined) {
        logger.error('Invalid params');
        rejected(null);
      }
      const lastChart = bucketSource.substring(bucketSource.length - 1, bucketSource.length);
      const source = lastChart !== '/' ? bucketSource  + '/' + path : bucketSource  + path;

      const params = {
        Bucket: bucketTarget,
        CopySource: source,
        Key: path,
        ACL: this.isValidACL(acl)
      };
      s3.copyObject(params, (err, data) => {
        if (err) {
          logger.error('Could not copy file', err);
          rejected(null);
        } else {
          logger.debug('copy', data);
          resolve(data);
        }
      });
    });
  }

  async delete(bucketName: string, path: string, version: string): Promise<any | null> {
    return new Promise<any | null>(async (resolve, rejected) => {
        if (bucketName === undefined || path === undefined) {
            logger.error('Invalid params');
            rejected(null);
        }
        const params = {
            Bucket: bucketName,
            Key: path,
            VersionId: version
        };
        s3.deleteObject(params, (error, data) => {
            if (error) {
                console.log(error);
                rejected(null);
            }
            resolve(data);
        });
    });
  }

  async waitForObjectExits(bucketName: string, path: string, operation: OperationBucketWait): Promise<any | null> {
    return new Promise<any | null>(async (resolve, rejected) => {
      if (bucketName === undefined || path === undefined) {
        logger.error('Invalid params');
        rejected(null);
      }
      const params = {
        Bucket: bucketName,
        Key: path
      };
      s3.waitFor('objectExists', params, (error, data) => {
        if (error) {
          console.log(error);
          rejected(null);
        }
        resolve(data);
      });
    });
  }

  /**
   *
   * @param bucketName Bucket that wants version
   */
  async checkBucketVerion(bucketName: string): Promise<any | null> {
    return new Promise<any | null>(async (resolve, rejected) => {
      if (bucketName === undefined) {
        logger.error('Invalid params');
        rejected(null);
      }
      const params = {
        Bucket: bucketName
      };
      s3.getBucketVersioning(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          rejected(null);
        }
        resolve(data);
      });
    });
  }

  /**
   * Clecks valid ACL
   * @param acl Validate ACL
   */
  private isValidACL(acl: string | null): string {
    if (acl == null) {
      return 'private';
    }
    if (
      acl === 'private' || acl === 'public-read' || acl === 'public-read-write' ||
      acl === 'authenticated-read' || acl === 'aws-exec-read' || acl === 'bucket-owner-read' ||
      acl === 'bucket-owner-full-control'
    ) {
      return acl;
    } else {
      return 'private';
    }
  }

}
