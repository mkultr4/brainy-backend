import * as AWS from 'aws-sdk';
import * as mustache from 'mustache'; // bring in mustache template engine
import { EmailBuilder } from '../util/builders/EmailBuilder';
import { EmailHandler } from '../handlers/EmailHandler';

const ses = new AWS.SES({
    region: 'us-east-1',
    apiVersion: '2010-12-01',
    accessKeyId: 'AKIAION22MFVGQXSZW6A',
    secretAccessKey: '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'
});
const s3 = new AWS.S3();

export class EmailService {

  constructor() { }

  sendEmail(to: Array<string> | EmailHandler, body?: any, subject?: string, type?: string, template?: string) {
    if ('to' in to) {
      const path = EmailBuilder.getPath(to.template);
      console.log(to.type);
      this.send(to.to, to.body, to.subject, path);
    } else {
      const path = EmailBuilder.getPath((template) ? template : '');
      console.log(type);
      this.send(to, body, (subject) ? subject : '', path);
    }
  }

  sendEmailWithPath(to: Array<string>, body: any, subject: string, type: string, path: string) {
    console.log(type);
    this.send(to, body, subject, path);
  }

  /**
   *
   * @param to who send email
   * @param body Object typeof map or Json has elements
   * @param subject Titlle of
   * @param path where i can find my template in to S3
   */
  private send(to: Array<string>, body: any, subject: string, path: string) {
    this.getTemplatesFromS3(path, body).then(html => {
      to.forEach(it => {
        const htmlRequest = this.buildEmailrequest(subject, it, html);
        ses.sendEmail(htmlRequest).promise().then(data => {
          console.log('Success', data);
        }).catch(error => {
          console.log('Error', error);
          error.push(htmlRequest);
        });
      });
    }).catch(error => {
        console.log('error', error);
    });
  }

  /**
   *
   * @param emailRequest
   * @param email
   * @param html
   */
  private buildEmailrequest(subject: string, email: string, html: any): any {
    return {
      Destination: { /* required */
        ToAddresses: [email]
      },
      Message: {
        Body: { /* required */
          Html: {
            Charset: 'UTF-8',
            Data: html
          },
          Text: {
            Charset: 'UTF-8',
            Data: 'text/html'
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      },
      Source: 'no-reply@teamknowlogy.com' /* required */
    };
  }


  /**
   *
   * @param path
   * @param file
   */
  private async getTemplatesFromS3(path: string, body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const params = { Bucket: 'brainy-email-templates', Key: path };
        const data = await s3.getObject(params).promise();
        const html = data.Body ? data.Body.toString() : undefined;
        const template = this.getTemplate(body, html);
        resolve(template);
      } catch (error) {
        console.log('Could not get data from S3', error);
        reject(error);
      }
    });
  }

  /**
  *
  * @param emailRequest
  */
  private getTemplate(body: any, html: any): any {
    console.log(body);
    return mustache.to_html(html, body);
  }


  builder(emailTo: String, subject: String, template: String, body: Object, type: String = 'online' ) {
    let emailHandler: EmailHandler;
    // Email Configuration
    emailHandler = {
      subject: subject as string,
      to: this.createTo(emailTo) as Array<string>,
      body: body,
      template: template as string,
      path: undefined,
      type: type
    };

    return emailHandler;
  }

  private createTo(emailTo: String) {
    const to: String[] = [];
    to.push(emailTo);
    return to;
  }
}
