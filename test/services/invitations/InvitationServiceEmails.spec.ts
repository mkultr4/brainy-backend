// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";
// import InvitationService from '../../../src/services/invitations/InvitationService';
// import { Invitation } from '../../../src/models/invitations/Invitation';
// import { InvitationLevel } from '../../../src/models/invitations/InvitationLevel';
// import * as assert from 'assert';
// import { expect } from 'chai';
// import * as uuid from 'uuid/v4';
// import {User} from '../../../src/models/auth-permissions/User';
// import { cat } from 'shelljs';
// describe('Invitation service test', () => {
//     // Command
//     // npm test -- test/services/invitations/InvitationServiceEmails.spec.ts
//     // Test
//     process.env.NODE_ENV = 'Test';
//     let invitationService = new InvitationService();
//     describe("Send email invitation", () => {
//         it('send email invitation and wait response', async () => {
//                 let to = 'ariel.lopez@teamknowlogy.com';
//                 let currentUser:User = new User();
//                 currentUser.email ='ariel.lopez@gmail.com';
//                 currentUser.photoUrl = 'http://brainy-img.s3.amazonaws.com/mails/avatar_2.jpg';
//                 currentUser.acronym = 'A';
//                 let send = '';
//                 try{
//                  await invitationService.sendEmailInvitationTeamMember(to, currentUser,'asas');
//                  send = 'send';
                 
//                 }catch (error){
//                 }
//                 expect(send).to.equal('send');
                
                

//         });
//     });
// })
