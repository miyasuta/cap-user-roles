  
using { cuid, managed, sap } from '@sap/cds/common';
namespace miyasuta.users;

entity Users: managed {
    id: UUID;
    externalId: String;
    userName: String;
    familyName: String;
    givenName: String;
}