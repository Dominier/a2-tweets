class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	// returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed ") || this.text.startsWith("Just posted ")) {
            return "completed_event";
        }
        if (this.text.startsWith("Watch my ")) {
            return "live_event";
        }
        if (this.text.startsWith("Achieved ") || this.text.startsWith("I just set a goal ")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    // returns a boolean, if text includes any content written by the person tweeting
    get written():boolean {
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        // Remove links and the app's hashtag before looking for a comment
        let text = this.text.replace(/https?:\/\/\S+/g, "");
        text = text.replace(/#Runkeeper\b/gi, "").trim();

        if (this.source == "miscellaneous") {
            return text;
        }
        if (this.source != "completed_event") {
            return "";
        }

        // seperator
        let separator = text.indexOf(" - ");
        if (separator != -1) {
            text = text.substring(separator + 3).trim();
        } else if (text.includes("Check it out!")) {
            text = text.substring(text.indexOf("Check it out!") + "Check it out!".length).trim();
        } else {
            return "";
        }

        // automatic message
        if (text == "TomTom MySports Watch") {
            return "";
        }
        return text;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        // skip "Just completed/posted a" and the distance, if there is one
        let words = this.text.split(" ");
        let start = 3;
        if (words[4] == "km" || words[4] == "mi") {
            start = 5;
        }

        let activity = words.slice(start).join(" ");
        
        // leave out the comment, app message, and time after the activity name
        activity = activity.split(" - ")[0];
        activity = activity.split(" with ")[0];
        activity = activity.split(" in ")[0];
        return activity.trim();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        let words = this.text.split(" ");
        let distance = parseFloat(words[3]);
        if (isNaN(distance)) {
            return 0;
        }
        if (words[4] == "km") {
            
            // use miles for every distance so the graphs can compare them
            return distance / 1.609;
        }
        if (words[4] == "mi") {
            return distance;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        // TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
