import logger from '../../src/logger';
import { S3FileStorageService } from '../../src/util/services/S3FileStorageService';

// dependencies
var async     = require('async')
    , AWS     = require('aws-sdk')
    , gm      = require('gm').subClass({ imageMagick: true }) // Enable ImageMagick integration.
    , util    = require('util')
    , request = require('request')
    , config  = require('config');

    const s3FileStorageService: S3FileStorageService = new S3FileStorageService();
// constants
var S_MAX_WIDTH  = 220 //800
  , S_MAX_HEIGHT = 420;//520
  var B_MAX_WIDTH  = 1000 //
  , B_MAX_HEIGHT = 520;//
// get reference to S3 client 

var s3 = new AWS.S3();
var imgs: Array<any> = Array<any>();

export const createThumbnail = async function(event, context) {
  // Read options from the event.
  logger.info("Reading options from event:\n", util.inspect(event, {depth: 5}));
  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey    = event.Records[0].s3.object.key;
  
  var dstBucket = srcBucket + "-thumbnails";
  var arre = srcKey.split('/');
  var _img = arre.slice(arre.length - 1, arre.length)[0]; 
  var img = _img.split('.');
  var small_dstKey  =   img[0] + '-small.' + img[1];
  var big_dstKey    =  img[0] + '-large.' + img[1];

  logger.debug('_img ', _img);
  logger.debug('img split', img);
  logger.info("Key begen in dstKey:\n", small_dstKey, ' big_dstKey ', big_dstKey);
  
  // Sanity check: validate that source and destination are different buckets.
  if (srcBucket == dstBucket) {
    logger.error("Destination bucket must not match source bucket.");
    return;
  }

  // Infer the image type.
  var typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    logger.error('unable to infer image type for key ' + srcKey);
    return;
  }

  var validImageTypes = ['png', 'jpg', 'jpeg', 'gif'];
  var imageType = typeMatch[1];
  if (validImageTypes.indexOf(imageType.toLowerCase()) < 0) {
    logger.info('skipping non-image ' + srcKey);
    return;
  }

  const _imgLas = await s3FileStorageService.download(srcBucket, srcKey, null);
  const imgBig = await _resizesImg(_imgLas, imageType, B_MAX_WIDTH, B_MAX_HEIGHT, big_dstKey);
  const imgSmall = await _resizesImg(_imgLas, imageType, S_MAX_WIDTH, S_MAX_HEIGHT, small_dstKey);
  logger.debug('imgBig', imgBig.length, 'imgSmall', imgSmall.length);
  const _saveS3B = await  s3FileStorageService.upload(dstBucket, big_dstKey, imgBig, imageType, 'public-read');
  const _saveS3S = await  s3FileStorageService.upload(dstBucket, small_dstKey, imgSmall, imageType, 'public-read');
  logger.debug('_saveS3S', _saveS3S, '_saveS3B', _saveS3B);
};

var  _resizesImg = (response, imageType, w, h, typeImg): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    //logger.info('response', response);
    gm(response.Body).size(function(err, size) {
      logger.info('size [', size, '] typeImg', typeImg);
      // Infer the scaling factor to avoid stretching the image unnaturally.
      var scalingFactor = Math.min(
        w / size.width,
        h / size.height
      );
      var width  = scalingFactor * size.width;
      var height = scalingFactor * size.height;
      //  sform the image buffer in memory.
      this.resize(width, height, '!')
        .toBuffer(imageType, function(err, buffer) {
          if (err) {
            logger.error('toBuffer occured an error', err)
            reject(err);
          } else {
            logger.debug('Actual img ', imgs.length);
            logger.debug('Actual img => typeImg ', typeImg);
            imgs.push({
              imgType: typeImg,
              buffer: buffer,
              contentType: response.ContentType
            });
            resolve(buffer);
          }
        });
    });
  });
}
