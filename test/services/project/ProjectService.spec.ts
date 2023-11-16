// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";
// import { expect } from 'chai';
// import * as assert from 'assert';
// import * as AWS from "aws-sdk";

// import * as DynamoDbLocal from 'dynamodb-local';

// import ProjectService from '../../../src/services/project/ProjectService';
// import { Project } from '../../../src/models/project/Project';

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

//         let projectService = new ProjectService();

//         let model: Project = {
//             brand_id:"111",
//             name: "test project",
//             active: true,
//             owner_id:"aaa",
//             create_timestamp: now,
//             deleted: false,
//             last_modified_timestamp:  now
//         };

//         describe('save brand', () => {
//             it('should return assert', () => {
//                 assert.equal(-1, -1);
//             });
//             it('should return complete', (done) => {
//                 projectService.save(model).then( brand => {
//                     console.log(brand)
//                     assert.ok(true)
//                     done();
//                 }).catch( err => {
//                     console.error(err);
//                 });
//             });


//             it('should be call error promise complete', (done) => {
//                 projectService.save({} as Project).then(project => {
//                     console.log(project)
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
