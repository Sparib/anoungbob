import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { randomInt } from 'crypto';
import { config } from 'dotenv';

config();

var wordlist: string[];
const query = "?query=-is:retweet -is:reply -is:quote lang:en !"
const reqC = { headers: { "Authorization": "Bearer " + process.env.TWITTER_TOKEN } };

interface searchResult {
    id: number,
    test: string
}

export async function get_tweet() {
    // Get 20 random english words
    await axios.get("https://random-word-api.herokuapp.com/word?lang=en&number=20")
        .then(resp => {
            if (resp.status !== 200) { throw new Error("Random word api returned code " + resp.status + ". Expected 200"); }
            wordlist = resp.data;
        });

    var tweet: searchResult;

    // Loop each word
    for (const word of wordlist) {
        console.log(word);

        // Set up api uri and encode the query
        let apiUriDec = "https://api.twitter.com/2/tweets/search/recent" + query.replace("!", word);
        let apiUriEnc = encodeURI(apiUriDec);
        console.log(apiUriEnc);

        let resp: AxiosResponse;

        // Get recent tweets
        await axios.get(apiUriEnc, reqC)
            .then(r => resp = r)
            .catch(e => {
                console.log(e);
            });

        // Check if any tweets exist
        let count = resp.data.meta.result_count;
        if (count > 0) {
            // Loop all tweets until randomly select one without a poll
            let tried = [];
            for (let i = 0; i < count; i++) {
                // Get random pos that hasn't been tested
                let pos = count > 1 ? randomInt(0, resp.data.meta.result_count - 1) : 0;
                while (tried.includes(pos)) pos = randomInt(0, resp.data.meta.result_count - 1);

                // Fetch tweet attributes
                let t = resp.data.data[pos] as searchResult;
                let tweetAttrib;
                await axios.get("https://api.twitter.com/2/tweets/" + t.id + "?expansions=attachments.poll_ids", reqC)
                    .then(resp => tweetAttrib = resp.data);

                // Check if include field exists
                if (tweetAttrib.data.includes != undefined) continue;
                tweet = t;
                break;
            }
        }

        console.log("~".repeat(20));

        if (tweet !== undefined) break;
    }

    await axios.get(encodeURI("https://api.twitter.com/2/tweets/" + tweet.id + "?expansions=author_id,attachments.media_keys&media.fields=url&user.fields=name,username,profile_image_url,url"), reqC)
        .then(resp => console.log(JSON.stringify(resp.data, null, '    ')))
        .catch(e => console.log(e));

    console.log(tweet.id);
}