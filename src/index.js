const axios = require('axios').default;

axios.get("https://random-word-api.herokuapp.com/word?lang=en&number=4")
    .then(resp => console.log(resp.data));