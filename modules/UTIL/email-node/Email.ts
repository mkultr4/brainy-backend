import { EmailHandler } from '../../../src/handlers/EmailHandler';
import { EmailService } from '../../../src/services/EmailService';
import { ErrorCode } from '../../../src/util/errors/ErrorCode';
import { Handler, ApiContext, ApiCallback } from '../../../src/interfaces/Api';
import ResponseBuilder from '../../../src/util/builders/ResponseBuilder';

const _emailService: EmailService = new EmailService();

/**
 * This class represents endpoint for all email access
 * @param emailRequest
 * @param context
 * @param callback
 */
export const send: Handler = (emailRequest: EmailHandler, context: ApiContext, callback: ApiCallback): void => {
    console.log(emailRequest);
    if (emailRequest.subject === undefined || emailRequest.template === undefined || emailRequest.to === undefined) {
      return ResponseBuilder.badRequest(ErrorCode.GeneralError, 'Invlid params',  callback);
    }
    if (emailRequest.path !== undefined) {
      _emailService.sendEmailWithPath(emailRequest.to, emailRequest.body, emailRequest.subject, emailRequest.type, emailRequest.path);
    }
    if (emailRequest.template !== undefined) {
      _emailService.sendEmail(emailRequest.to, emailRequest.body, emailRequest.subject, emailRequest.type, emailRequest.template);
    }
    return ResponseBuilder.ok('OK', callback);
};

