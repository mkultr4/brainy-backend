// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";
// import { expect } from 'chai';
// import * as assert from 'assert';
// import * as AWS from "aws-sdk";
// import RoleService from '../../../src/services/auth-permissions/RoleService';
// import Model, { Role } from '../../../src/models/auth-permissions/Role';
// import config from '../../../src/conf'



// describe('Role  Service', async () => {

//     let now = new Date().getTime();

//     let rs= new RoleService();

//     let model: Role = {
//         name: 'TeamTest',
//         description: 'TeamTest Rol',
//         permissions: [],
//     }

//     let currentRole:Role;

//     describe('Save Role Services', () => {
//         it('should return complete then', (done) => {
//             rs.save(model).then(role => {
//                 assert.ok(true)
//                 currentRole = role;
//                 done();
//             }).catch(err => {
//                 console.error(err);
//                 done();
//             });
//         });

//     });

//     describe('List Role service', () => {

//         it('should return assert', () => {
//             assert.equal(-1, -1);
//         });

//         it('should return complete', async () => {

//             let items = await rs.getAll()

//             console.log("items", items);
//         });
//     });

//     describe('Update Role service', () => {

//         it('should return Role updated', async () => {
//             model.name = 'TeamTest'
//             let item: any = await rs.getById(currentRole.uid as string)
//             console.log("item", item);
//             delete item.createdAt;
//             delete item.updatedAt;
//             item.name = 'TeamTestModified'
//             let obj = await rs.update(item)
//             console.log("obje: ", obj);
//         });
//     });


//     describe('Get Role service', () => {

//         it('should return Role getted', async () => {
//             let item = await rs.getById(currentRole.uid as string)
//             console.log("item", item);
//         });
//     });

//     describe('delete Role service', () => {
//         it('should delete role', async () => {

//             let item = await rs.getById(currentRole.uid as string)
//             console.log("item", item);
//             try {
//                 const deleted = await rs.delete(item.uid as string);
//             } catch (error) {
//                 console.error(error)
//             }
//         });
//     });


// });
