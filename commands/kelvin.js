//Shuts down the bot

var axios = require('axios');
var uuid = require('uuid');

exports.run = async (client, message, args, tools) => {
    //Check access
    const dance = client.emojis.find(emoji => emoji.name == 'dance');
    try {
        message.channel.send('**Sounds gay** ' + dance)
    } catch (err) {
        console.log(err.stack);
    }
    const query = {
        find: "eosforum",
        maxTimeMS: 1000,
        /*filter: {
            "data.json_metadata.title": { $regex: '^(Weekly Discussion \\(anon\\-pol\\-econ\\))' },
            "data.json_metadata.sub": "anon-pol-econ",
            "data.poster": "eosforumanon"
        },*/
        filter: {
            "transaction": "fff7d7660ddf1529fc1ba8e2d9fceee886593ac287e15f663d61aa6bc862f75f"
        },
        sort: { createdAt: -1 },
        limit: 1,
    };

    var response = await axios.post('https://db.novusphere.io/api', JSON.stringify(query));

    var recent_thread = response.data.cursor.firstBatch[0];
    var thread_uuid = recent_thread.data.post_uuid; // weekly thread uuid

    console.log('thread uuid ' + thread_uuid);
    console.log('thread txid ' + recent_thread.transaction);
    

    var eos_post = {
        poster: "eosforumanon", // ui will fill this in
        reply_to_poster: "eosforumanon",
        reply_to_post_uuid: thread_uuid,
        certify: 0,
        content: "test",
        post_uuid: uuid.v4(),
        json_metadata: JSON.stringify({
            title: "",
            type: "novusphere-forum",
            sub: "anon-pol-econ",
            parent_uuid: thread_uuid,
            parent_poster: "eosforumanon",
            edit: false,
            attachment: {
                value: "",
                type: "",
                display: ""
            }
        })
    };

    var response2 =  await axios.post('https://eos-service.novusphere.io/eosforum/anon', 
        JSON.stringify(eos_post), 
        { headers: {'Content-Type': 'application/json' } });

    if (response2.data.error) {
        console.log('error');
        console.log(response2.data.error);
    }
    else {
        console.log('successfully posted');
        console.log(response2.data.transaction_id);
    }
}
