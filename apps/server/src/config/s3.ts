// @ts-ignore
import AWS from 'aws-sdk';
import config from './config';

export const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
 });