const db = require("./Database.js");

test();

async function test(){
    // await db.registerAccount("liamholland02", "2002", "liamholland02@gmail.com");
    // await db.registerAccount("definitely_not_liam", "2001", "liam.holland5@nuigalway.ie");
    const id = await db.getID("liamholland02");
    db.updateProfile(id, "name", "Liam Holland");
    db.updateProfile(id, "bio", "I am a user");
    db.updateProfile(id, "dob", "07/04/2002");
    console.log(await db.getProfileInfo(id), await db.getProfileInfo(id, "name"), await db.getProfileInfo(id, "dob"));
}