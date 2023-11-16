/*
  * Returns an IAM policy document for a given user and resource.
  *
  * @method buildIAMPolicy
  * @param {String} userId - user id
  * @param {String} effect  - Allow / Deny
  * @param {String} resource - resource ARN
  * @param {String} context - response context
  * @returns {Object} policyDocument
  */
export default class IAMPolicyAuth {
    
    private username:string;

    private effect:string;

    private resource:string;

    private context:object;


    constructor(username: string,  effect:string, resource:string , context: object){
        this.username = username;
        this.effect = effect;
        this.resource = resource;
        this.context = context;
    }

    get(){
        return {
            principalId: this.username,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: this.effect,
                        Action: [
                            'execute-api:Invoke'
                        ],
                        Resource: [
                            this.resource
                        ]
                    },
                ],
            },
            context: this.context
        };
    }
}
