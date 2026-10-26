function parseTweets(runkeeper_tweets) {
	// do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	document.getElementById('numberTweets').textContent = tweet_array.length;

	let firstDate = null;
	let lastDate = null;
	let completedEvents = 0;
	let liveEvents = 0;
	let achievements = 0;
	let miscellaneous = 0;
	let written = 0;

	for (let tweet of tweet_array) {
		if (firstDate === null || tweet.time < firstDate) {
			firstDate = tweet.time;
		}
		if (lastDate === null || tweet.time > lastDate) {
			lastDate = tweet.time;
		}

		let source = tweet.source;
		if (source === 'completed_event') {
			completedEvents++;
			if (tweet.written) {
				written++;
			}
		} else if (source === 'live_event') {
			liveEvents++;
		} else if (source === 'achievement') {
			achievements++;
		} else {
			miscellaneous++;
		}
	}

	let dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
	document.getElementById('firstDate').textContent = firstDate === null ? 'N/A' : firstDate.toLocaleDateString('en-US', dateOptions);
	document.getElementById('lastDate').textContent = lastDate === null ? 'N/A' : lastDate.toLocaleDateString('en-US', dateOptions);

	updateSummary('completedEvents', completedEvents, tweet_array.length);
	updateSummary('liveEvents', liveEvents, tweet_array.length);
	updateSummary('achievements', achievements, tweet_array.length);
	updateSummary('miscellaneous', miscellaneous, tweet_array.length);
	updateSummary('written', written, completedEvents);
}

function updateSummary(className, count, total) {
	// some counts appear more than once, so update every matching span
	document.querySelectorAll('.' + className).forEach(function(span) {
		span.textContent = count;
	});

	let percentage = 0;
	if (total > 0) {
		percentage = count / total * 100;
	}
	document.querySelector('.' + className + 'Pct').textContent = percentage.toFixed(2) + '%';
}

// w ait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
