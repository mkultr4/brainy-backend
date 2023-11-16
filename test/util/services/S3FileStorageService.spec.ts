// import { S3FileStorageService, Operation } from '../../../src/util/services/S3FileStorageService';
// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe, beforeEach } from "mocha";
// import { expect } from 'chai';
// import * as fs from 'fs';
// const path = require('path');

// describe('S3 file Storage', () => {
//     let s3FileStorageService: S3FileStorageService = new S3FileStorageService();
//     const bucketName = 'brainy-cores';
//     const bucketTarget = 'brainy-cores-firme';
//     let __path='img';
//     let saveLocal = false;
//     let extencion = 'jpg';
//     let operation = Operation.getObject;
//     let data: any;
//     let dataVersion: any;

//     before(() => {
//         const myPath = path.join(__dirname, '../../../assets/img/error.png')
//         console.log('myPath ' + myPath);
//         fs.readFile(myPath, 'base64', (err: any, data: any) => {
//             if (err) { console.error(err); }
//             this.data = data;
//             if (data) {
//                 if(saveLocal) {
//                     var base64Data = data.replace(/^data:image\/png;base64,/, "");
//                     fs.writeFile(myPath, base64Data, 'base64', (err: any) => {
//                     if (err) {
//                         return console.error(err);
//                     }
//                     });
//                 }
//             }
//         });
//         dataVersion = s3FileStorageService.upload(bucketName, __path + '.' + extencion, data, 'image/' + extencion);
                
    
//     });
//     /*describe('S3FileStorageService', () => {
//         it('Should create presignedURL', (done) => {
//             console.log('nada');
//         });
//     });*/
//     describe('S3FileStorageService', () => {
//         it('Should create presignedURL', (done) => {
//             s3FileStorageService.createUrlPreSigned(bucketName, __path, operation, 60 * 3).then(data => {
//                 done();
//             }).catch(error => {
//                 expect(error != null).to.equal(true);
//             });
//         });
//         it('Should PUT Object', (done) => {
//             s3FileStorageService.upload(bucketName, __path + '.' + extencion, data, 'image/' + extencion)
//             .then(data => {
//                 done();
//             }).catch(err => {
//                 expect(err == null).to.equal(true);
//                 done();
//             });
//         });
//         it('Should GET Object with version', (done) => {
//             s3FileStorageService.download(bucketName, __path + '.' + extencion,  dataVersion.VersionId)
//             .then(data => {
//                 done();
//             }).catch(err => {
//                 expect(err == null).to.equal(true);
//                 done();
//             });
//         });
//         it('Should GET Object LAST version', (done) => {
//             s3FileStorageService.download(bucketName, __path + '.' + extencion, null)
//             .then(data => {
//                 done();
//             }).catch(err => {
//                 expect(err == null).to.equal(true);
//                 done();
//             });
//         });
//         it('Should COPY Object With Default ACL', (done) => {
//             s3FileStorageService.copy(bucketName, bucketTarget, __path + '.' + extencion, null)
//             .then(data => {
//                 done();
//             }).catch(err => {
//                 expect(err == null).to.equal(true);
//                 done();
//             });
//         });

//         it('Should COPY Object With private ACL', (done) => {
//             s3FileStorageService.copy(bucketName, bucketTarget, __path + '.' + extencion, 'private')
//             .then(data => {
//                 done();
//             }).catch(err => {
//                 expect(err == null).to.equal(true);
//                 done();
//             });
//         });
//         it('Should COPY Object With Version', (done) => {
//             s3FileStorageService.delete(bucketName, __path  + '.' + extencion,  dataVersion.VersionId)
//             .then(data => {
//                 done();
//             }).catch(err => {
//                 expect(err == null).to.equal(true);
//                 done();
//             });
//         });

//         it('Failures', (done) => {
//             try {
//                 s3FileStorageService.createUrlPreSigned(null, __path, operation, 60 * 3)
//             .then(data => {
//                 done();
//             }).catch(error => {
//                 expect(error).to.be.equal(null);
//                 done();
//             });
//             } catch (error) {
//                 done();
//             }
            
//         });
//     });

// });
