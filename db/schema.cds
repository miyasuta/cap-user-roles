using {managed} from '@sap/cds/common';

namespace miyasuta.users;

entity Users : managed {
    key id         : UUID;
        externalId : String;
        userName   : String;
        familyName : String;
        givenName  : String;
}

entity RoleCollections : managed {
    key name              : String;
    key roleTemplateAppId : String;
    key roleTemplateName  : String;
    key roleName          : String;
}

entity Roles : managed {
    key roleTemplateName  : String;
    key roleTemplateAppId : String;
    key roleName          : String;
    key scopeName         : String;
}

view RoleCollectionToScopes as
    select distinct
        key col.name,
        key col.roleTemplateName,
        key col.roleTemplateAppId,
        key col.roleName,
        key Roles.scopeName
    from RoleCollections as col
    left join Roles
        on  col.roleTemplateAppId = Roles.roleTemplateAppId
        and col.roleTemplateName  = Roles.roleTemplateName
        and col.roleName          = Roles.roleName;
