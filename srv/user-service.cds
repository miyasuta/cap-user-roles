using { miyasuta.users as db } from '../db/schema';

service UserService {
    entity Users as projection on db.Users
    entity RoleCollections as projection on db.RoleCollections
    entity Roles as projection on db.Roles
    entity Scopes as projection on db.RoleCollectionToScopes

    action loadUsers() returns String;
    action loadRoleCollections() returns String;
    action loadRoles() returns String;

    //for scope, prefix(appId) is required
    function userHasScope(userId:String, scope:String) returns Boolean;
}