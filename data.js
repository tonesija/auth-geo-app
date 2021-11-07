// Contains logic for fake db holding the last 5 users.


lastFiveUsers = []


function addUserToLastFiveList(user) {
    index = lastFiveUsers.findIndex(u => u.name === user.name).length
    if (index != -1) {
        lastFiveUsers.splice(index, 1)
        lastFiveUsers.push(user)
    } else {
        if (lastFiveUsers.lenght < 5) {
            lastFiveUsers.push(user)
        } else {
            lastFiveUsers.splice(0, 1)
            lastFiveUsers.push(user)
        }
    }
}

function getLastFiveUsers() {
    return lastFiveUsers
}

module.exports = {addUserToLastFiveList, getLastFiveUsers}