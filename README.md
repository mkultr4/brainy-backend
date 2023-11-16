# Brainy2.0
## Modulos

- Autenticación
- core
    - brief

#### Creacion de un nuevo proyecto de serverless
``` serverless create --template aws-nodejs-typescript --path ${path} ```

``` sls create --template aws-nodejs-typescript --path ${path} ```


## Getting Started
## Prerequisites

- nodej newer than version 6.0
- serverless


## Installing
## Running the tests
## Deployment
## Built
## Versioning
## Authors
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

Run your serverless and deploy tour aws-lambda
- sls deploy -s dev

Run seeds/
- add your table and rute into schema.ts
- npm run-script build
- NODE_ENV=dev node dist/schema.js
