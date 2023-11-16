import config from './src/conf';
import { AnalysisSchemeStatusList } from 'aws-sdk/clients/cloudsearch';
const AWS = require("aws-sdk");
const fs = require('fs');

const configUpdate:any  = {
    region: config.DB_REGION
}

if (config.DB_LOCAL) {
    configUpdate.endpoint = config.DB_HOST + ':' + config.DB_PORT
}

AWS.config.update(configUpdate);

export default (() => {
    
    var _docClient = new AWS.DynamoDB.DocumentClient();

    function _parseSeed(seed: any): any{
        console.log(`parsing data...`);
        var params = {};
        var itemsParsed:any = [];
        var items: any = JSON.parse(fs.readFileSync(seed.filePath, 'utf8'));
        console.log(`Data file data: ${items}`);
        items.forEach((item: any) => {
            params = {
                TableName: seed.tableName,
                Item: item
            };
            console.log(`Item parse :`, params);
            itemsParsed.push(params);
        });
        
        return itemsParsed;
    }

    function _putItems(items: any): Promise<any>{
        return new Promise<any>((resolve, reject) => {
            var itemPromises = new Array<Promise<any[]>>();
            items.forEach((item: any) => {
                itemPromises.push(_docClient.put(item).promise());
            });

            Promise.all(itemPromises).then(results => {
                resolve(results);
            }).catch(err => {
                reject(err);
            })
        });
    }
    
    return {
        seed: (seeds: Array<any>): Promise<any> => {
            return new Promise<any>((resolve, reject) => {
                console.log("Importing seeds into DynamoDB. Please wait.");
                
                var promises = new Array<Promise<any>>();
                seeds.forEach(seed => {
                    console.log(`Seed found  '${seed.filePath}'`);
                    const itemsParsed = _parseSeed(seed);
                    console.log(`inserting item into dynamodb.`);
                    promises.push(_putItems(itemsParsed));
                });
                
                Promise.all(promises).then(results => {
                    console.log(results);
                    resolve(results);
                }).catch(errs => {
                    reject(new Error("Error insertando item"));  
                });
            });
        }
    }
})();
