import dynamodbSchema from 'dynamodb-schema';
import config from './src/conf';
import seeder from './seeder';

const dataSeeds = [
  {
      tableName: config.DB_PREFIX + 'role' + config.DB_SUBFIX,
      filePath: './seeds/roles.json'
  },
  {
      tableName: config.DB_PREFIX + 'core_type' + config.DB_SUBFIX,
      filePath: './seeds/core/core-type.json'
  },
  {
      tableName: config.DB_PREFIX + 'core_status' + config.DB_SUBFIX,
      filePath: './seeds/core/core-status.json'
  },
  {
    tableName: config.DB_PREFIX + 'pin_type' + config.DB_SUBFIX,
    filePath: './seeds/pin/pin-type.json'
  },
  {
    tableName: config.DB_PREFIX + 'participant_type' + config.DB_SUBFIX,
    filePath: './seeds/pin/participant-type.json'
  },
  {
    tableName: config.DB_PREFIX + 'core_function' + config.DB_SUBFIX,
    filePath: './seeds/core-access/functions.json'
  },
  {
    tableName: config.DB_PREFIX + 'group' + config.DB_SUBFIX,
    filePath: './seeds/auth-permissions/group.json'
  },
];

dynamodbSchema.config({
    override: true,
    preffix: config.DB_PREFIX,
    subffix: config.DB_SUBFIX,
    // skipTables: ['name1', 'name2'],
    // schema: []
});

// dynamodbSchema.schema([
//   {
//     name: 'table1',
//     attributtes: [
//       { name: 'name',  type: 'String' },
//       { name: 'name2', type: 'Boolean' },
//       { name: 'name3', type: 'Map' },
//       { name: 'name4', type: 'Number' }
//     ],
//     keys: [
//       { name: 'name',  type: 'HASH' },
//       { name: 'name', type: 'RANGE' }
//     ]
//   }
// ]);

// dynamodbSchema.createSchema();
seeder.seed(dataSeeds).then(results => {
  console.log('Results: ', results);
}).catch(error => {
  console.error('Something wrong: ', error);
});

// dynamodbSchema.dropSchema();
// dynamodbSchema.updateSchema('tableName',  {
//   name: 'table1',
//   attributtes: [
//       { name: 'name',  type: 'String' },
//       { name: 'name2', type: 'Boolean' },
//       { name: 'name3', type: 'Map' },
//       { name: 'name4', type: 'Number' }
//   ],
//   keys: [
//       { name: 'name',  type: 'HASH' },
//       { name: 'name', type: 'RANGE' }
//   ]
//  });

