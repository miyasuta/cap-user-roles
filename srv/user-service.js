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
}