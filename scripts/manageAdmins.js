//TODO 

const config = require('./../config');
const readline = require('readline-sync');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./../models/Users');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

mongoose.connect(config.mongodb.connection).then(() => {
    let resp = readline.question("Do you want to create, list, or delete a site administrator? (create/list/delete)\n")
    switch (resp.toLowerCase()) {
        case "create":
            createSiteAdmin();
            break;
        case "list":
            listSiteAdmins();
            break;
        case "delete":
            deleteSiteAdmin();
            break;
        default:
            console.log("Unknown selection, Exiting Script.");
            readline.close();
            process.exit()
    }

}).catch((error) => console.error("Error:", error));



async function createSiteAdmin() {
    try {
        const firstname = readline.question("First Name: ");
        const lastname = readline.question("Last Name: ");
        const username = readline.question("Username: ");

        const pw = await readline.question("Password: ", { hideEchoBack: true });
        const pwC = await readline.question("Confirm Password: ", { hideEchoBack: true });

        if (pw === pwC) {
            const hash = await bcrypt.hash(pw, 10) 
            const newUser = await new User({
                firstname,
                lastname,
                role: "systemAdministrator",
                username,
                password: hash,
                accountLocked: false,
                logins: [],
                studies: []
            });

            await newUser.save()
            console.log("Created new admin account");
        } else {
            console.log("Passwords must match.")
        }

    } catch (error) {
        console.log("Error:", error);
    } finally {
        process.exit()
    }
}

async function listSiteAdmins() {
    try {
        let admins = await User.find({ role: "systemAdministrator" }, {
            username: 1,
            firstname: 1,
            lastname: 1
        }); if (admins.length === 0) {
            console.log("No Site Admins Found!");
        } else {
            console.log("---Current Site Admins---")
            let i = 1;
            admins.forEach(adm => {
                console.log(`${i}: ${adm.username} - ${adm.firstname} ${adm.lastname}`);
                i += 1;
            });
        }
    } catch (error) {
        console.log("Error:", error);
    } finally {
        process.exit()
    }
}

async function deleteSiteAdmin() {
    try {
        let admins = await User.find({ role: "systemAdministrator" });
        if (admins.length === 0) {
            console.log("No Site Admins Found!");
        } else {
            console.log("---Current Site Admins---")
            let i = 1;
            admins.forEach(adm => {
                console.log(`${i}: ${adm.username} - ${adm.firstname} ${adm.lastname}`);
                i += 1;
            });
            const siteAdmin = readline.question("Which Site Admin would you like to delete? (1,2,3...)\n")
            if (!isNaN(siteAdmin)) {
                let sa = Number.parseInt(siteAdmin) - 1;
                if (sa >= 0 && sa < admins.length) {
                    let _username = admins[sa].username;
                    const del = await User.deleteOne({ "_id": admins[sa]._id });
                    if (del.deletedCount === 1) {
                        console.log(`Successfully deleted ${_username}`);
                    } else {
                        console.log("No users were deleted.");
                    }
                } else {
                    console.log("Invalid ID")
                }
            } else {
                console.log("Invalid ID")
            }
        }
    } catch (error) {
        console.log("Error:", error);
    } finally {
        process.exit()
    }
}
