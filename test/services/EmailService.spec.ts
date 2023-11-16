// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";

// import { EmailHandler } from '../src/handlers/EmailHandler';
// import { EmailService } from "../src/services/EmailService";
// import UserService from "../src/services/UserService";
// import { EmailKey } from '../src/util/builders/EmailBuilder';

// describe('Email Users', () => {
//     let userService: UserService = new UserService();


//     let to = 'ariel.lopez@teamknowlogy.com';



//     describe('sendEmail Function', () => {
//         userService.sendEmailValidateAccount(to, 'https://prueba.squiintapp.com/public/confirm-email/:token');
//         userService.sendEmailActivatedAccount(to, 'https://prueba.squiintapp.com/public/login');
//         userService.sendEmailWelcomeThanks(to, { name: 'Ariel' });
//         //Without name
//         userService.sendEmailWelcomeThanks(to, { name: undefined });

//         userService.sendEmailWelcome(to, { name: 'Ariel' });
//         //Without name
//         userService.sendEmailWelcome(to, { name: undefined });
//     });
// });

// /**
//  * awesome test in TS
//  */
// describe('Email validate account', () => {
//     let emailService: EmailService = new EmailService();
//     let emailHandler: EmailHandler;
//     let to: Array<string> = new Array<string>();
//     beforeEach(() => {
//         to.push('ariel.lopez@teamknowlogy.com')
//         let _body = { urlConfirm: 'https://prueba.squiintapp.com/public/confirm/askalskaop8989' };

//         emailHandler = {
//             subject: 'Activar cuenta',
//             to: to,
//             body: _body,
//             template: EmailKey.accounValidation.toString(),
//             path: undefined,
//             type: 'online'
//         }



//         describe('sendEmail Function', () => {
//             when(emailService.sendEmail(emailHandler.to, emailHandler.body, emailHandler.subject, emailHandler.type, emailHandler.template));//.thenReturn(Promise.resolve<boolean>(true)));
//         });
//     });
// });

// describe('Email account activate', () => {
//     let emailService: EmailService = new EmailService();
//     let emailHandler: EmailHandler;
//     let to: Array<string> = new Array<string>();

//     to.push('ariel.lopez@teamknowlogy.com')
//     let _body = { urlLogin: 'https://prueba.squiintapp.com/public/login' };

//     emailHandler = {
//         subject: 'Su cuenta ha sido activada',
//         to: to,
//         body: _body,
//         template: EmailKey.accounActivate.toString(),
//         path: undefined,
//         type: 'online'
//     }



//     describe('sendEmail Function', () => {
//         when(emailService.sendEmail(emailHandler.to, emailHandler.body, emailHandler.subject, emailHandler.type, emailHandler.template));//.thenReturn(Promise.resolve<boolean>(true)));
//     });
// });

// describe('Email Welcome', () => {
//     let emailService: EmailService = new EmailService();
//     let emailHandler: EmailHandler;
//     let to: Array<string> = new Array<string>();

//     to.push('ariel.lopez@teamknowlogy.com')
//     let _body = { name: 'Fidel' };

//     emailHandler = {
//         subject: 'Bienvenido a Brainy',
//         to: to,
//         body: _body,
//         template: EmailKey.welcome.toString(),
//         path: undefined,
//         type: 'online'
//     }



//     describe('sendEmail Function', () => {
//         when(emailService.sendEmail(emailHandler.to, emailHandler.body, emailHandler.subject, emailHandler.type, emailHandler.template));//.thenReturn(Promise.resolve<boolean>(true)));
//     });
// });

// describe('Email Welcome Thanks', () => {
//     let emailService: EmailService = new EmailService();
//     let emailHandler: EmailHandler;
//     let to: Array<string> = new Array<string>();

//     to.push('ariel.lopez@teamknowlogy.com')
//     let _body = { name: 'Fidel' };

//     emailHandler = {
//         subject: 'Bienvenido a Brainy',
//         to: to,
//         body: _body,
//         template: EmailKey.welcomeThanks.toString(),
//         path: undefined,
//         type: 'online'
//     }



//     describe('sendEmail Function', () => {
//         when(emailService.sendEmail(emailHandler.to, emailHandler.body, emailHandler.subject, emailHandler.type, emailHandler.template));//.thenReturn(Promise.resolve<boolean>(true)));
//     });
// });
