// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";
// import { expect } from 'chai';
// import * as assert from 'assert';
// import * as AWS from "aws-sdk";
// import MemberAccessService, { Permission } from '../../../src/services/member-access/MemberAccessService';
// import { MemberAccess } from '../../../src/models/member-access/MemberAccess';
// import RoleService from '../../../src/services/auth-permissions/RoleService';
// import RolModel, { Role } from '../../../src/models/auth-permissions/Role';
// var colors = require('colors');
// var beautify = require("json-beautify");

// colors.setTheme({
//   silly: 'rainbow',
//   input: 'grey',
//   verbose: 'cyan',
//   prompt: 'grey',
//   info: 'green',
//   data: 'grey',
//   help: 'cyan',
//   warn: 'yellow',
//   debug: 'blue',
//   error: 'red'
// })

// describe('Member Access Service', async () => {

//     let now = new Date().getTime();

//     let mar = new MemberAccessService();

//     let rs = new RoleService();

//     let current: Permission;

//     describe('Member Access create workespace access', () => {

//         it('expect permission ALLOWED ', async () => {
//             let permission;
//             try {
//                 permission = await mar.grantPermission({
//                     type: 'ALLOW',
//                     user: {
//                         uid: "user.UID",
//                         email: "o.cordobam@hotmail.com"
//                     },
//                     role: 'Administrator',
//                     access: {
//                         level: 'WORKSPACE',
//                         reference: "workspace.uid"
//                     }
//                 });

//                 current = permission;
//                 console.log("Permission :", beautify(permission, null, 2, 80));
//             } catch (error) {
//                 console.error(colors.error("Error :"), beautify(error, null, 2, 80));
//             }

//             expect(permission.permissionStatus).eq('ALLOWED');
//         });

//     });

//     describe('Member Access get list workespace access', () => {
//         it('expect array permissions', async () => {
//             try {
//                 let permissions = await mar.getPermissions('WORKSPACE', current.permission.userId);
//                 console.log(colors.debug("Permissions : \n "), beautify(permissions, null, 2, 80));
//                 expect(permissions.length).greaterThan(0);
//             } catch (error) {
//                 console.error(colors.error("Error : \n"), beautify(error, null, 2, 80));
//             }
//         });
//     });


//     describe('Member Access revoke permission workespace access', () => {
//         it('expect permission deleted permissions', async () => {
//             try {
//                 let permission = await mar.revokePermission(current.permission.uid);
//                 console.log(colors.debug("permission revoke status: \n "), beautify(permission, null, 2, 80));
//                 expect(permission.permissionStatus).eq("REVOKED");
//             } catch (error) {
//                 console.error(colors.error("Error : \n"), beautify(error, null, 2, 80));
//             }
//         });
//     });

// });
