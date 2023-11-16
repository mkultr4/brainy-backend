
import * as dynamoose from 'dynamoose';
import db from '../dbconf';
import UserModel, {User} from './auth-permissions/User';
import RoleModel, {Role} from './auth-permissions/Role';
import WorkspaceModel, {Workspace} from './workspace/Workspace';
import InvitationModel, {Invitation} from './invitations/Invitation';
import WSA, {WorkspaceAccess} from './workspace/access/WorkspaceAccess';
import WSACategory, {WorkspaceAccessCategory} from './workspace/access/WorkspaceAccessCategory';
import ParticipantModel, { Participant } from './pin/Participant';
import ParticipantTypeModel, { ParticipantType } from './pin/ParticipantType';
import PinModel, { Pin } from './pin/Pin';
import PinTypeModel, { PinType } from './pin/PinType';
import CommentModel, { Comment } from './comment/Comment';
import CommentTypeModel, { CommentType } from './comment/CommentType';
import ThreadCommentModel, { ThreadComment } from './comment/ThreadComment';
import CoreModel, { Core } from './core/Core';
import CA, { CoreAccess } from './core/core-access/CoreAccess';
import CORESTATUS, { CoreStatus } from './core/CoreStatus';
import CORETYPE, { CoreType } from './core/CoreType';
import BRAND, { Brand } from './brand/Brand';
import PROJECT, { Project } from './project/Project';
import GROUP, {Group} from './auth-permissions/Group';
import COREFUNCTION, {CoreFunction} from './Core/core-access/CoreFunction';
import PIECE, {Piece} from './feedback-piece/Piece';

db.config();

class ModelConstructor<M> {
  constructor() {}

  register(name: String, schema: dynamoose.Schema, models: Array<any>) {
    // console.log('load models');
    const model = dynamoose.model<M, {}>(name as string, schema);
    models.push({key: name, model: model});
  }
}

export const orm = {
  models: new Array<any>(),
  init: function() {
    // console.log('init orm');
    this.loadModels();
  },
  loadModels() {
    // console.log('load models');
    // console.log('models: ', CoreModel);
    new ModelConstructor<User>().register(UserModel.name, UserModel.schema, this.models);
    new ModelConstructor<Role>().register(RoleModel.name, RoleModel.schema, this.models);
    new ModelConstructor<Workspace>().register(WorkspaceModel.name, WorkspaceModel.schema, this.models);
    new ModelConstructor<WorkspaceAccess>().register(WSA.name, WSA.schema, this.models);
    new ModelConstructor<WorkspaceAccessCategory>().register(WSACategory.name, WSACategory.schema, this.models);

    new ModelConstructor<Participant>().register(ParticipantModel.name, ParticipantModel.schema, this.models);
    new ModelConstructor<ParticipantType>().register(ParticipantTypeModel.name, ParticipantTypeModel.schema, this.models);
    new ModelConstructor<Pin>().register(PinModel.name, PinModel.schema, this.models);
    new ModelConstructor<PinType>().register(PinTypeModel.name, PinTypeModel.schema, this.models);

    new ModelConstructor<Comment>().register(CommentModel.name, CommentModel.schema, this.models);
    new ModelConstructor<CommentType>().register(CommentTypeModel.name, CommentTypeModel.schema, this.models);
    new ModelConstructor<ThreadComment>().register(ThreadCommentModel.name, ThreadCommentModel.schema, this.models);
    // console.log('models: ', this.models);
    new ModelConstructor<Core>().register(CoreModel.name, CoreModel.schema, this.models);
    new ModelConstructor<CoreAccess>().register(CA.name, CA.schema, this.models);
    new ModelConstructor<CoreStatus>().register(CORESTATUS.name, CORESTATUS.schema, this.models);
    new ModelConstructor<CoreType>().register(CORETYPE.name, CORETYPE.schema, this.models);
    new ModelConstructor<Brand>().register(BRAND.name, BRAND.schema, this.models);
    new ModelConstructor<Project>().register(PROJECT.name, PROJECT.schema, this.models);
    new ModelConstructor<Invitation>().register(InvitationModel.name, InvitationModel.schema, this.models);

    new ModelConstructor<Group>().register(GROUP.name, GROUP.schema, this.models);
    new ModelConstructor<CoreFunction>().register(COREFUNCTION.name, COREFUNCTION.schema, this.models);

    new ModelConstructor<Piece>().register(PIECE.name, PIECE.schema, this.models);
  },
  getModel(key: String) {
    console.log('search: ' + key);
    // console.log('model found: ' + this.models.filter((model: any) => model.key === key));
    return this.models.filter((model: any) => model.key === key)[0].model;
  }
};

