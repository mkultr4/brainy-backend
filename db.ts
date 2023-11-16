import config from './src/conf';
// import * as DynamoDbLocal from 'dynamodb-local';

(() => {
    const DynamoDbLocal = require('dynamodb-local');
    const colors = require('colors');
    colors.setTheme({
        silly: 'rainbow',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    });

    const dynaPort = 3089;
    let db;
    const exec = process.argv[2];

    switch (exec) {
        case 'start':
            console.log(colors.info('init dynamo local database... port:' + config.DB_PORT));
            DynamoDbLocal.configureInstaller({
                installPath: './db-bin',
                downloadUrl: 'https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz'
            });
            try {
                initDb().then((database: any) => {
                    console.log(colors.info(`data base PID informacion: ${database.pid}`) );
                    process.exit();
                }).catch(err => {
                    console.error(colors.error(`error:  ${err} trying to up dynamodb local service`));
                    process.exit(1);
                });
            } catch (error) {
                console.error(colors.error(`error:  ${error} trying to up dynamodb local service`));
                process.exit(1);
            }
            break;
        case 'stop':
            console.log(colors.warn(`stoping dynamo local database...`));
            DynamoDbLocal.stop(config.DB_PORT);
            process.exit();
            break;

        default:
            console.error(colors.error(`param ${exec} isn't valid, check reference, sorry`));
            process.exit(1);
            break;
    }


    async function initDb(): Promise<any> {
        console.log('init on_: ');
        db = await DynamoDbLocal.launch(config.DB_PORT, null, ['-inMemory'], false);
        return db;
    }

})();
