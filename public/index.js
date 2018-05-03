
// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_RIDDLES = {
	"riddlesUpdates": [
    {"riddle":"David's father has three sons : Snap, Crackle and _____ ?","answer":"David"},
    {"riddle":"What room do ghosts avoid?","answer":"The living room"},
    {"riddle":"The more you take, the more you leave behind. What am I?","answer":"Footsteps"},
    {"riddle":"What has a head, a tail, is brown, and has no legs?","answer":"A Penny"},
    {"riddle":"What comes once in a minute, twice in a moment, but never in a thousand years?","answer":"The letter m"}
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentRiddleUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_RIDDLES)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayRiddlesUpdates(data) {
    for (index in data.riddlesUpdates) {
	   $('body').append(
        '<p>' + data.riddlesUpdates[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayRiddlesUpdates() {
	getRecentStatusUpdates(displayRiddlesUpdates);
}

//  on page load do this
$(function() {
	getAndDisplayRiddlesUpdates();
})
