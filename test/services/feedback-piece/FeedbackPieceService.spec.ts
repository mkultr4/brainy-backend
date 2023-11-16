
// import { FeedbackPieceService } from '../../../src/services/feedback-piece/FeedbackPieceService';
// import { describe } from "mocha";
// import * as assert from 'assert';

// describe('Piece', () => {
//     let feedbackPieceService: FeedbackPieceService = new FeedbackPieceService();
//     //let db: any;
//     let _piece = {
//         coreId: '121-121212-121212-1212',
//         userCreated: 'asfsaf-asfasf-asf-safsaf-asfaf',
//         type_store: 'VIDEO',
//         pieces: [
//             {properties: [
//                 {name: 'Avatar.jpg'},
//                 {heigh: 'Avatar.jpg'},
//                 {width: 'Avatar.jpg'},
//                 {previewUrl: 'https://s3.amazonaws.com/brainy-img/img/home/logo_brainy.png'}
//             ]},{properties: [
//                 {name: 'Avatar.jpg'},
//                 {heigh: 'Avatar.jpg'},
//                 {width: 'Avatar.jpg'},
//                 {previewUrl: 'https://s3.amazonaws.com/brainy-img/img/home/logo_brainy.png'}
//             ]}
//         ]

//     }
//     let _pieceVersion = {
//         id: '7487a20c-c6bd-46c5-b8de-f0df42cabcfd',
//         coreId: '121-121212-121212-1212',
//         userCreated: 'asfsaf-asfasf-asf-safsaf-asfaf',
//         type_store: 'VIDEO',
//         pieces: [
//             {properties: [
//                 {name: 'Avatar.jpg'},
//                 {heigh: 'Avatar.jpg'},
//                 {width: 'Avatar.jpg'},
//                 {previewUrl: 'https://s3.amazonaws.com/brainy-img/img/home/logo_brainy.png'}
//             ]}
//         ]

//     }

//     describe('Save', () => {
//         it('save object and review result',  (done) => {
//             feedbackPieceService.save(_piece).then(data => {
//                 console.log(data);
//                 assert.ok(true);
//                 done();
//             }).catch(err => {
//                 console.error(err);
//                 done();
//             });

//         });
//     });

//     describe('SaveVersion', () => {
//         it('save object and review result',  (done) => {
//             feedbackPieceService.createNewVersion(_pieceVersion).then(data => {
//                 console.log(data);
//                 assert.ok(true);
//                 done();
//             }).catch(err => {
//                 console.error(err);
//                 done();
//             });

//         });
//     });

//     describe('Get', () => {
//         it('Get array of pieces',  (done) => {
//             feedbackPieceService
//                 .findAllByCoreId('121-121212-121212-1212').then(data => {
//                     console.log(data);
//                     assert.ok(true);
//                     done();
//                 }).catch(err => {
//                     console.error(err);
//                     done();
//                 });
//         });
//     });

//     describe('GetAllVersionsIn', () => {
//         it('Get array of pieces',  (done) => {
//             feedbackPieceService
//                 .findAllVersions('7487a20c-c6bd-46c5-b8de-f0df42cabcfd').then(data => {
//                     console.log(data);
//                     assert.ok(true);
//                     done();
//                 }).catch(err => {
//                     console.error(err);
//                     done();
//                 });
//         });
//     });
// });
