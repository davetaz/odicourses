function processCourses(courses,instances) {
	for (i=0;i<courses.length;i++) {
		course = courses[i];
		title = course["title"];
		subtitle = course.details["excerpt"];
		if (subtitle.indexOf(".") > 0) {
			subtitle = subtitle.split(".")[0] + ".";
		}
		link = course["web_url"];
		duration = course.details["length"];
		key = course["slug"];
		occurs = getCourseInstances(instances,key);
		heading = "<h2><a href='" + link + "'>" + title + "</a></h2><p class='courseSub'>" + subtitle + "</p>";
		icons = '<ul id="course_properties">';
		icons += '<li><img src="images/'+duration.replace(" ","_")+'.png" alt="'+duration+'"></img></li>';
		icons += '<li><img src="images/f2f.png" alt="Face to face"></img></li>';
		icons += '</ul>';
		running = '<div id="instances">Upcoming: <small>('+occurs.length+')</small><ul id="instancelist">';
		for(k=0;k<occurs.length;k++) {
			ocr = occurs[k];
			if (k < 2) {
				running += '<li><span id="courseLoc">' + ocr["displayDate"] + ' <small>('+ocr["location"] + ')</small></span><a href="'+ocr["url"]+'" id="bookButton" class="btn btn-primary">Book</a></li>';
			}
		}
		running += '</ul></div>';
		if (occurs.length < 1) {
			running = '<div id="instances">Upcoming:<br/><div id="noInstances">No dates scheduled<br/><a id="interestButton" class="btn btn-primary" href="mailto:training@theodi.org?subject=Interest in ' + title + ' course">Register interest</div></div>';
		}
		block = '<li id="course" class="home-module shown"><div id="module" class="module module-light module-highlight-1 module-colour-5 ">' + heading + icons + running + '</div></li>';
		$("#courses").append(block);
	}
}

function getCourseInstances(instances,key) {
	occurs = [];
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	instances.sort(function(a,b) {
		return new Date(a.details["date"]) - new Date(b.details["date"]);
	});
	for (j=0;j<instances.length;j++) {
		instance = instances[j];
		if (instance.details["course"] == key) {
			ins = [];
			ins["date"] = instance.details["date"];
			ins["location"] = instance.details["location"];
			if (instance.details["location"]) {
				parts = instance.details["location"].split(",");
				ins["location"] = parts[parts.length - 2].trim();
			}
			ins["url"] = instance.details["url"];
			now = new Date();
			run = new Date(ins["date"]);
			day = run.getDate();
			suffix = "th";
			if (day == 1 || day == 21 || day == 31) {
				suffix = "st";
			} 
			if (day == 2 || day == 22) {
				suffix = "nd";
			}
			if (day == 3 || day == 23) {
				suffix = "rd";
			}
			ins["displayDate"] = day + suffix + " " + monthNames[run.getMonth()];
			console.log("display : " + ins["displayDate"]);
			if (run > now) {
				occurs.push(ins);
			}
		}
	}
	return occurs;
}