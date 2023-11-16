// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";
// import { expect } from 'chai';
// import * as assert from 'assert';
// import * as AWS from "aws-sdk";

// import * as DynamoDbLocal from 'dynamodb-local';

// import BrandService from '../../src/services/brand/BrandService';
// import { Brand } from '../../src/models/brand/Brand';

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

    
//     describe('Brand Service', async () => {
        
//         let now = new Date().getTime();
        
//         let brandService = new BrandService();
        
//         let model: Brand = {
//             workspace_id:"aaa",
//             name: "test brand",
//             active: true,
//             owner_id:"111",
//             create_timestamp: now,
//             deleted: false,
//             last_modified_timestamp:  now
//         };
        
//         describe('save brand', () => { 
//             it('should return assert', () => {
//                 assert.equal(-1, -1);
//             });
//             it('should return complete', (done) => {
//                 brandService.save(model).then( brand => {
//                     console.log(brand)
//                     assert.ok(true)
//                     done();
//                 }).catch( err => {
//                     console.error(err);
//                 });
//             });


//             it('should be call error promise complete', (done) => {
//                 brandService.save({} as Brand).then(brand => {
//                     console.log(brand)
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
