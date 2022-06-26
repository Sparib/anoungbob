import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { randomInt } from 'crypto';
import { config } from 'dotenv';

config();

interface searchResult {
    id: number,
    test: string
}

export interface tweetInfo {
    data: {
        text: string,
        attachments?: {
            media_keys: string[]
        },
        id: string,
        author_id: string
    },
    includes: {
        media?: [{media_key: string, type: string, url: string}],
        users: [
            {
                username: string,
                profile_image_url: string,
                name: string,
                id: string
            }
        ]
    }
    word: string
}

export async function get_tweet(): Promise<tweetInfo | null> {
    var wordlist!: string[];
    const query = "?query=-is:retweet -is:reply -is:quote lang:en !"
    if (process.env.TWITTER_TOKEN === undefined) throw new Error(".env was not successfully loaded! Cannot access twitter or discord token.");
    const reqC = { headers: { "Authorization": "Bearer " + process.env.TWITTER_TOKEN } };

    // Get 20 random english words
    await axios.get("https://random-word-api.herokuapp.com/word?lang=en&number=20")
        .then(resp => {
            if (resp.status !== 200) { throw new Error("Random word api returned code " + resp.status + ". Expected 200"); }
            wordlist = resp.data;
        });

    var tweet: searchResult | undefined;
    var tweetWord!: string;

    // Loop each word
    for (const word of wordlist) {
        console.log(word);
        // Set up api uri and encode the query
        let apiUriDec = "https://api.twitter.com/2/tweets/search/recent" + query.replace("!", word);
        let apiUriEnc = encodeURI(apiUriDec);

        let resp: AxiosResponse | undefined;

        // Get recent tweets
        await axios.get(apiUriEnc, reqC)
            .then(r => resp = r)
            .catch(e => {
                console.log(e);
            });
        
        if (resp === undefined) continue;

        // Check if any tweets exist
        let count = resp.data.meta.result_count;
        if (count > 0) {
            // Loop all tweets until randomly select one without a poll
            let tried: number[] = [];
            for (let i = 0; i < count; i++) {
                // Get random pos that hasn't been tested
                let pos = count > 1 ? randomInt(0, resp.data.meta.result_count - 1) : 0;
                while (tried.includes(pos)) pos = randomInt(0, resp.data.meta.result_count - 1);

                // Fetch tweet attributes
                let t = resp.data.data[pos] as searchResult;
                let tweetAttrib: AxiosResponse | undefined;
                await axios.get("https://api.twitter.com/2/tweets/" + t.id + "?expansions=attachments.poll_ids", reqC)
                    .then(resp => tweetAttrib = resp.data);

                if (tweetAttrib === undefined) continue;

                // Check if include field exists
                if (tweetAttrib.data.includes != undefined) continue;
                tweet = t;
                tweetWord = word;
                break;
            }
        }

        if (tweet !== undefined) break;
    }

    if (tweet === undefined) return null;

    var toReturn!: tweetInfo;

    await axios.get(encodeURI("https://api.twitter.com/2/tweets/" + tweet.id + "?expansions=author_id,attachments.media_keys&media.fields=url&user.fields=name,username,profile_image_url"), reqC)
        .then(resp => toReturn = resp.data as tweetInfo)
        .catch(e => console.log(e));

    if (!toReturn) throw new Error("What how");

    toReturn.word = tweetWord;
    return toReturn;
}