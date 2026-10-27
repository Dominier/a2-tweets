function parseTweets(runkeeper_tweets) {
	// stop if the tweets did not load
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let activityCounts = {};
	let activityData = [];
	let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// count the activity types from completed tweets
	for (let i = 0; i < tweet_array.length; i++) {
		let tweet = tweet_array[i];
		if (tweet.source === 'completed_event') {
			let activity = tweet.activityType;
			if (activityCounts[activity] === undefined) {
				activityCounts[activity] = 0;
			}
			activityCounts[activity]++;

			activityData.push({
				activityType: activity,
				distance: tweet.distance,
				day: days[tweet.time.getDay()]
			});
		}
	}

	let activityTypes = Object.keys(activityCounts);

	// put the most common activities first, then take the top three
	activityTypes.sort(function(a, b) {
		return activityCounts[b] - activityCounts[a];
	});

	let topActivities = activityTypes.slice(0, 3);

	document.getElementById('numberActivities').textContent = activityTypes.length;
	document.getElementById('firstMost').textContent = topActivities[0] || 'N/A';
	document.getElementById('secondMost').textContent = topActivities[1] || 'N/A';
	document.getElementById('thirdMost').textContent = topActivities[2] || 'N/A';

	let activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "graph of the number of Tweets containing each type of activity",
	  "data": { "values": activityData },
	  "width": 600,
	  "height": 600,
	  "mark": "bar",
	  "encoding": {
	    "y": { "field": "activityType", "type": "nominal", "sort": "-x", "title": "Activity type" },
	    "x": { "aggregate": "count", "type": "quantitative", "title": "Number of tweets" },
	    "tooltip": [
	      { "field": "activityType", "type": "nominal", "title": "Activity" },
	      { "aggregate": "count", "type": "quantitative", "title": "Tweets" }
	    ]
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	let distanceData = [];
	for (let i = 0; i < activityData.length; i++) {
		if (topActivities.includes(activityData[i].activityType)) {
			distanceData.push(activityData[i]);
		}
	}

	// show each activity as a point
	let distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"data": { "values": distanceData },
		"width": 600,
		"height": 600,
		"mark": { "type": "point", "opacity": 0.3 },
		"encoding": {
			"x": { "field": "day", "type": "ordinal", "sort": days, "title": "Day of the week", "axis": { "labelAngle": 0 } },
			"y": { "field": "distance", "type": "quantitative", "title": "Distance (miles)" },
			"color": { "field": "activityType", "type": "nominal", "title": "Activity type" }
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	// show the mean distance for each activity on each day
	let distance_vis_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"data": { "values": distanceData },
		"width": 600,
		"height": 600,
		"mark": { "type": "point", "opacity": 1 },
		"encoding": {
			"x": { "field": "day", "type": "ordinal", "sort": days, "title": "Day of the week", "axis": { "labelAngle": 0 } },
			"y": { "field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Mean distance (miles)" },
			"color": { "field": "activityType", "type": "nominal", "title": "Activity type" }
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	// comparing the distances in the mean chart
	document.getElementById('longestActivityType').textContent = 'bike';
	document.getElementById('shortestActivityType').textContent = 'walk';
	document.getElementById('weekdayOrWeekendLonger').textContent = 'weekends';

	let allDistances = document.getElementById('distanceVis');
	let meanDistances = document.getElementById('distanceVisAggregated');
	let button = document.getElementById('aggregate');
	
	allDistances.style.display = 'block';
	meanDistances.style.display = 'none';
	button.textContent = 'Show means';


	// only show one distance chart at a time
	button.onclick = function() {
		if (meanDistances.style.display === 'none') {
			allDistances.style.display = 'none';
			meanDistances.style.display = 'block';
			button.textContent = 'Show all activities';
		} else {
			allDistances.style.display = 'block';
			meanDistances.style.display = 'none';
			button.textContent = 'Show means';
		}
	};
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
