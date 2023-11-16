import * as jwt from 'jsonwebtoken';
import logger from '../../logger';
import { ExpirationTokenException, JsonWebTokenException } from '../errors/Error';
import { JsonToken } from '../../statics';
const fs = require('fs');

export default {

};

export class JsonWebToken {
  constructor() {}

  static encode(object: any, expire: any) {
    const cert = fs.readFileSync(JsonToken.path + JsonToken.keys.private);
    const token = jwt.sign(object, cert, {
      algorithm: 'RS256',
      expiresIn: expire
    });

    return token;
  }

  static decode(token: string) {
    let decoded: any;
    try {
      const cert = fs.readFileSync(JsonToken.path + JsonToken.keys.public);  // get public key
      decoded = jwt.verify(token, cert);
      console.log('token decoded value: ', decoded);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        logger.error('TokenExpiredError: ', err);
        throw new ExpirationTokenException(err);
      } else if (err.name === 'JsonWebTokenError') {
        throw new JsonWebTokenException(err);
      }
    }
    return decoded;
  }
}
