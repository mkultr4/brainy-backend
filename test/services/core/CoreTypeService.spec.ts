// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";
// import { expect } from 'chai';
// import * as assert from 'assert';
// import * as AWS from "aws-sdk";

// import * as DynamoDbLocal from 'dynamodb-local';

// import CoreTypeService from '../../src/services/core/CoreTypeService';
// import { CoreType } from '../../src/models/core/CoreType';

// const dynaPort = 8000;
// describe('database Connection Local', async () => {
    
//     let db:any;

//     before(async () => {
//         // runs before all tests in this block
//         DynamoDbLocal.configureInstaller({
//             installPath: './db-bin',
//             downloadUrl: 'https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz'
//         });
//         db = await DynamoDbLocal.launch(dynaPort, null, ['-inMemory'], false); // must be wrapped in async function
//         console.log("dynamo run");
//     });

    
//     describe('Core Service', async () => {
        
//         let now = new Date().getTime();
        
//         let coreTypeService = new CoreTypeService();
        
//         let model: CoreType = {
//             name: "test coreType",
//             active: true,
//             create_timestamp: now,
//             last_modified_timestamp:  now
//         };
        
//         describe('save core', () => { 
//             it('should return assert', () => {
//                 assert.equal(-1, -1);
//             });
//             it('should return complete', (done) => {
//                 coreTypeService.save(model).then( brand => {
//                     console.log(brand)
//                     assert.ok(true)
//                     done();
//                 }).catch( err => {
//                     console.error(err);
//                 });
//             });


//             it('should be call error promise complete', (done) => {
//                 coreTypeService.save({} as CoreType).then(coreType => {
//                     console.log(coreType)
//                 }).catch(err => {
//                     expect(err.message).to.be.equal('The conditional request failed');
                    
//                 }).then(() =>{
//                     done();
//                 });
//             });
//         });

//     });
    
//     after(async () => {
//         // runs after all tests in this block
        
//         await DynamoDbLocal.stop(dynaPort);
//         console.log("dynamo db stoped");
//     });
// });
