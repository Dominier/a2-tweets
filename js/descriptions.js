let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	// stop if the tweets did not load
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// keep only tweets that have a written comment
	writtenTweets = [];
	for (let i = 0; i < runkeeper_tweets.length; i++) {
		let tweet = runkeeper_tweets[i];
		let parsedTweet = new Tweet(tweet.text, tweet.created_at);
		if (parsedTweet.written) {
			writtenTweets.push(parsedTweet);
		}
	}

	updateSearch();
}

function addEventHandlerForSearch() {
	document.getElementById('textFilter').addEventListener('input', updateSearch);
	updateSearch();
}

function updateSearch() {
	let searchText = document.getElementById('textFilter').value;
	let search = searchText.trim().toLowerCase();
	let count = 0;
	let rows = '';

	// add a row for each comment that matches the search
	if (search !== '') {
		for (let i = 0; i < writtenTweets.length; i++) {
			let tweet = writtenTweets[i];
			if (tweet.writtenText.toLowerCase().includes(search)) {
				count++;
				rows += tweet.getHTMLTableRow(count);
			}
		}
	}

	document.getElementById('searchCount').textContent = count;
	document.getElementById('searchText').textContent = searchText;
	document.getElementById('tweetTable').innerHTML = rows;
}

// wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
