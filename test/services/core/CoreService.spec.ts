
import { describe } from 'mocha';
import * as assert from 'assert';
import CoreService from '../../../src/services/core/CoreService';
import { Core } from '../../../src/models/core/Core';

describe('Core', () => {

  const coreService: CoreService = new CoreService();
  const _core = {
    project_id: 'aaa',
    title: 'test core',
    owner_id:'aaa',
    core_type_id: 'bbb',
    thumbnail: 'path',
    reference_id:  'ccc',
    reference_name: 'reference name',
    parent_id: 'ddd',
    create_timestamp: new Date(),
    last_modified_timestamp: new Date(),
    active: true,
    deleted: false,
    status: 'open',
    user_approved: 'eee',
    user_rejected: 'ddd',
    date_rejected_at: new Date(),
    date_approved_at: new Date()
  };
  const _workspaceAccess = {
    createdAt: '2018-07-13T20:32:03.657Z',
    uid: '22cd96d1-392c-4229-9294-ad233c6c9611',
    workspace: {
      uid: '0744d7a5-2c0f-4561-9c85-f4f6465a80e1'
    },
    role: {
      name: '',
      uid: '4',
      description: 'admin',
      key: 'Admin'
    },
    user: {
      uid: '613b5d2d-f40e-449d-8790-59bcab8ec359'
    }
  };
  describe('Create Service',  () => {
    it('save object and review result',  (done) => {
      coreService.saveAs(_core, _workspaceAccess).then(data => {
        console.log(data);
        assert.ok(true);
        done();
    }).catch(err => {
        console.error(err);
        done();
    });
    });
  });
});
