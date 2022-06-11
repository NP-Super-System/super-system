const Roles = require('../models/role/Role');

// TO BE ONLY RUN ONCE

// init course data

const roleList = [
    // Admin Role
    {
        user: "628c5ddf589c03766c446dec",
        roleName: "Admin",
    },
    {
        user: "628c5ddf589c03766c446dec",
        roleName: "Student",
    },
    {
        user: "628c5ddf589c03766c446dec",
        roleName: "Lecturer",
    },
];

// add roles

async function addRoles(){
    for (var roleData of roleList){
        console.log(roleData);
        const role = new Roles(roleData);
        try{
            const result = await role.save();
            console.log(`Added Role: ${result}`)
        }
        catch(err){
            console.log(err);
        }
        finally{
            continue;
        }
    }
}

addRoles();