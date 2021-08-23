using { miyasuta.users as db } from '../db/schema';

service UserService {
    entity Users as projection on db.Users
    action loadUsers() returns String
}