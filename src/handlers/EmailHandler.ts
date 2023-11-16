
/**
 * @code type S3, File
 */
export interface EmailHandler {
    to: Array<string>;
    body: any;
    template: string;
    path?: string;
    type: any;
    subject: string;
}
