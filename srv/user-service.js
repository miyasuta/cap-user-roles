const SapCfAxios = require('sap-cf-axios').default;
const axios = SapCfAxios('AuthAndTrustManagement');

module.exports = async function () {
    this.on('loadUsers', async(req) => {
        const { Users } = cds.entities
        const response = await axios({
            method: 'GET',
            url: '/Users',
            headers: {
                accept: 'application/json'
            }
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