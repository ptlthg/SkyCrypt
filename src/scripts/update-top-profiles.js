const cluster = require('cluster');

async function main(){
    const { MongoClient } = require('mongodb');

    const credentials = require('./../../credentials.json');

    const mongo = new MongoClient(credentials.dbUrl, { useUnifiedTopology: true });
    await mongo.connect();

    const db = mongo.db(credentials.dbName);

    let featured = {
        metalcupcake5: {
            position: 1,
            type: "MAINTAINER",
            message: "a dev or something idk"
        },
        MartinNemi03: {
            position: 2,
            type: "MAINTAINER",
            message: "\"lazy dev\" &nbsp; <b>(ﾉ´･ω･)ﾉ ﾐ ┸━┸</b>"
        },
        jjww2: {
            position: 3,
            type: "MAINTAINER",
            message: "bob"
        },
        FantasmicGalaxy: {
            position: 4,
            type: "MAINTAINER",
            message: "afk my melon minions :D"
        },
        Shiiyu: {
            position: 5,
            type: "HOST",
            message: "<span class=\"stat-name\">Last online: </span><span class=\"stat-value\">January 1st, 1970</span>"
        },
    };

    async function updateTopProfiles(){
        await db.collection('topViews').deleteMany({});

        for (name in featured) {
            const user = await db
            .collection('usernames')
            .find( { username: name } )
            .toArray();

            if(!user[0]) continue;
            let output = user[0];

            for (data in featured[name]) 
                output[data] = featured[name][data];

            await db.collection('topViews').updateOne(
                { _id: output._id },
                { $set: output },
                { upsert: true }
            );
        }
    }

    updateTopProfiles();
}

if(cluster.isMaster)
    main();
