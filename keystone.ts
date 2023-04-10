// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';
import dotenv from 'dotenv';
dotenv.config();

const {
  S3_BUCKET_NAME = 'keystone-test',
  S3_REGION = 'ap-southeast-2',
  S3_ACCESS_KEY_ID = 'keystone',
  S3_SECRET_ACCESS_KEY = 'keystone',
} = process.env;

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    storage: {
      s3: {
        kind: 's3',
        type: 'image',
        bucketName: S3_BUCKET_NAME,
        region: S3_REGION,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      },
      local: {
        kind: 'local',
        type: 'image',
        generateUrl: (path) => `http://localhost:3000/images/${path}`,
        serverRoute: {
          path: '/images/',
        },
        storagePath: 'public/images',
      },
    },
    lists,
    session,
  })
);
