// import { instance, mock, reset, when } from 'ts-mockito';
// import { describe } from "mocha";

// import WorkspaceService from '../../../src/services/WorkspaceService';
// import { Workspace } from '../../../src/models/workspace/Workspace';
// import * as assert from 'assert';
// import { expect } from 'chai';

// describe('Workspace', () => {

//   let now = new Date().getTime();

//   let workspaceService = new WorkspaceService();

//   let workspaceTest: Workspace;

//   let json: Workspace = {
//     name: 'Work for 2018',
//     active: false,
//     owner_id: "bbb",
//     create_timestamp: now,
//     deleted: false,
//     last_modified_timestamp: now,
//     config: { image: "some path to image" }
//   }

//   describe("save function", () => {
//     it('save object and review result',async () => {
//       console.log(json);
//       let obj = await workspaceService.save(json);
//       console.log(obj);
//       expect(obj.name).to.equals(json.name);
//       expect(obj.active).to.equals(json.active);
//       expect(obj.owner_id).to.equals(json.owner_id);
//       expect(obj.deleted).to.equals(json.deleted);
//     });
//   });
// });
