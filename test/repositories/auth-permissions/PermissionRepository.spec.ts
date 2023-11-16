import { instance, mock, reset, when } from 'ts-mockito';
import { describe } from "mocha";
import { expect } from 'chai';
import * as assert from 'assert';
import * as AWS from "aws-sdk";
import PermissionRepository from '../../../src/repositories/auth-permissions/PermissionRepository';
import { Permission } from '../../../src/models/auth-permissions/Permission';

    
describe('Permission Repository', async () => {
        
  let now = new Date().getTime();
          
  let pr = new PermissionRepository();
          
  let model: Permission = {
      permission: 'READ'
  };
          
  describe('save permission', () => { 
    it('should return assert', () => {
        assert.equal(-1, -1);
    });

    it('should return complete',  async () => {
        try {
            const user = await pr.save(model);

            console.log('user', user);
            assert.ok(true)
        } catch (error) {
           console.error(error) 
        }
        
    });
      
    it('should be call error promise complete', async () => {
        try{
            const user = await pr.save({} as Permission);
        }catch(err) {
            expect(err.message).to.be.equal('Required value missing: permission');
        }
    });

  });
       
});
