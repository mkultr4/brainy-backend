// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";
// import InvitationService from '../../../src/services/invitations/InvitationService';
// import Model, { Invitation } from '../../../src/models/invitations/Invitation';
// import { InvitationLevel } from '../../../src/models/invitations/InvitationLevel';
// import * as assert from 'assert';
// import { expect } from 'chai';
// import * as uuid from 'uuid/v4';
// import config from '../../../src/conf';
// import dbconf from '../../../src/dbconf';
// import { cat } from 'shelljs';
// describe('Invitation service test', () => {
//     // Command
//     // npm test -- test/services/invitations/InvitationService.spec.ts
//     // Test
//     // Service
    
//     const invitationService: InvitationService = new InvitationService();
//     const invitationUid = '1';
    
    // let invitationTest: Invitation;
    // let token = '';
    // let decoded: any;
    // let json: Invitation = {
    //     email: 'ariel.lopez@teamknowlogy.com',
    //     roleId: '4',
    //     levelId: InvitationLevel.Core,
    //     // Reference to the level
    //     referenceId: '1',
    //     active: false
    // }
    // let invitations: Array<Invitation> = new Array<Invitation>();

//     // describe("batch Save function", () => {
//     //     it('batch save object and review unproccesedItems', async () => {

//     //         for (let i = 0; i < 6; i++) {
//     //             const invitationAux = Object.assign({}, json);
//     //             invitationAux.uid = uuid();
//     //             invitations.push(invitationAux);
//     //         }
//     //         const unproccesedItems = await invitationService.saveAll(invitations);

//     //         expect(unproccesedItems.length).to.equals(undefined);

//     //     });
//     // });
//     // describe("Save function", () => {
//     //     it('save object and review result', async () => {
//     //         try{
//     //         invitationTest = await invitationService.create(json);
//     //         expect(invitationTest.email).to.equals(json.email);
//     //         }catch(err){
//     //             console.log(err);
//     //         }
//     //     });
//     // });
//     describe("Get by id", () => {
//         it('get object and review result', async () => {
//             const invitationTestGet = await invitationService.getById('9cd127f1-044e-42a1-86e4-96216bb5e958');
//             console.log(invitationTestGet);
//             expect(invitationTestGet.uid).to.equals(invitationTest.uid);
//         });
//     });
//     // describe("Generate token", () => {
//     //     it('generate token and review result', async () => {
//     //         try {
//     //             token = InvitationService.createToken(invitationTest);
//     //             expect(token).not.empty
//     //         } catch (ex) {
//     //             expect(token).not.empty
//     //         }

//     //     });
//     // })
//     // describe("Verify token", () => {
//     //     it('verify token and review result', async () => {
//     //         try {
//     //             decoded = InvitationService.verifyToken(token);
//     //             expect(decoded).not.empty
//     //             expect(decoded['invitation'].email).to.equals(invitationTest.email);
//     //         } catch (ex) {
//     //             expect(decoded).not.empty
//     //         }

//     //     });
//     // })
//     // describe("Confirm token", () => {
//     //     it('Confirm token and review result', async () => {

//     //         const decodedInvitation = <Invitation>decoded['invitation'];
//     //         console.log(decodedInvitation);
//     //         const confirm = await invitationService.confirm(decodedInvitation);
//     //         expect(confirm.email).to.equals(invitationTest.email);
//     //         expect(confirm.active).to.equals(true);


//     //     });
//     // })
//     // describe("delete by id", () => {
//     //     it('delete object and review result', async () => {
//     //         let obj = await invitationService.delete(invitationTest.uid);
//     //         expect(obj.uid).to.equals(invitationTest.uid);
//     //     });
//     // });


// });
