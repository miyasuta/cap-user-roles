const core = require('@sap-cloud-sdk/core')

module.exports = async function () {
    this.on('loadUsers', async(req) => {
        console.log('authorization ===>', req.headers.authorization)
        const { Users } = cds.entities
        const response = await core.executeHttpRequest({ destinationName: 'AuthAndTrustManagement'},{
            method: 'GET',
            url: '/Users'
        })

        const users = response.data.resources.map((user)=> {
            return {
                id: user.id,
                externalId: user.externalId,
                userName: user.userName,
                familyName: user.name.familyName,
                givenName: user.name.givenName
            }
        })

        if (users.length > 0) {
            await DELETE.from(Users)
            await INSERT (users) .into (Users)
            return `${users.length} records have been inserted.`
        }
        else {
            req.error({
                message: 'User data could not be fetched!'
            })
        }       
    })

    this.on('loadRoleCollections', async(req) => {
        const { RoleCollections } = cds.entities
        const response = await core.executeHttpRequest({ destinationName: 'AuthAndTrustManagement'},{
            method: 'GET',
            url: '/sap/rest/authorization/v2/rolecollections'
        })  
        
        const data = response.data
        let rolecollections = []              
        for (let i = 0; i < data.length; i++) {
            let roleCollection = data[i]
            let counter = roleCollection.roleReferences ? roleCollection.roleReferences.length : 0
            for (let j = 0; j < counter; j++) {
                let roleReference = roleCollection.roleReferences[j]
                let insertData = {
                    name: roleCollection.name,
                    roleTemplateAppId: roleReference.roleTemplateAppId,
                    roleTemplateName: roleReference.roleTemplateName,
                    roleName: roleReference.name
                }
                rolecollections.push(insertData)
            }
        }

        if (rolecollections.length > 0) {
            await DELETE.from(RoleCollections)
            await INSERT (rolecollections) .into (RoleCollections)
            return `${rolecollections.length} records have been inserted.`
        }
        else {
            req.error({
                message: 'RoleCollection data could not be fetched!'
            })
        }          
    })

    this.on('loadRoles', async(req) => {
        const { Roles } = cds.entities
        const response = await core.executeHttpRequest({ destinationName: 'AuthAndTrustManagement'},{
            method: 'GET',
            url: '/sap/rest/authorization/v2/roles'
        })  
        
        const data = response.data  
        let roles = []              
        for (let i = 0; i < data.length; i++) {
            let role = data[i]
            let counter = role.scopes ? role.scopes.length : 0
            for (let j = 0; j < counter; j++) {
                let scope = role.scopes[j]
                let insertData = {
                    roleTemplateAppId: role.roleTemplateAppId,
                    roleTemplateName: role.roleTemplateName,
                    roleName: role.name,
                    scopeName: scope.name
                }
                roles.push(insertData)
            }
        }  
        
        if (roles.length > 0) {
            await DELETE.from(Roles)
            await INSERT (roles) .into (Roles)
            return `${roles.length} records have been inserted.`
        }
        else {
            req.error({
                message: 'Role data could not be fetched!'
            })
        }         
    })

    this.on('userHasScope', async(req) => {
        const userId = req.data.userId
        const scope = req.data.scope

        //step1. get user's uuid
        const { Users, RoleCollectionToScopes } = cds.entities
        const user = await SELECT.one.from(Users).columns `{id}` 
                        .where({userName: userId})
        if (!user) {
            req.error({
                message: 'User does not exist in subaccount'
            })
        }

        //step2. get role collections the user is assined
        const response = await core.executeHttpRequest({ destinationName: 'AuthAndTrustManagement'},{
            method: 'GET',
            url: `/Users/${user.id}`
        })

        const groups = response.data.groups.map(group => group.value)
        console.log(groups)

        //step3. check scope
        const { count } = await SELECT.one.from(RoleCollectionToScopes).columns `{count(scopeName) as count}`
                            // .where `${whereClause}`
                            .where `name in ${groups} and scopeName = ${scope}`
        console.log(`count: `, count)

        const result = count > 0 ? true : false       
        return result
    })
}