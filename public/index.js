'use strict';

// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRiddlesData(callbackFn) {
  console.log("getRiddlesData Executed. ");
  //$.getJSON("/riddles", callback);
  const settings = {
		url: '/riddles',
		dataType: 'json',
		method: 'GET',
    success: callbackFn
  };
	$.ajax(settings);
}

// function to display riddles
function renderRiddles(data) {
    console.log("renderRiddles Executed. ");
    console.log(data);
return `
		<article class="riddlePreview" id="${data.id}">
			<p class="riddleQues">${data.riddle}</p>
			<h4 class="riddleAnswerH">Answer</h4>
			<p class="riddleAnswer">${data.answer}</p>
		</article>
	`;
}


//Using the search results div to display results in html
function displayRiddles(data) {
 console.log("displayRiddles Executed");
 const riddlesResults = data.map((item, index) => renderRiddles(item));
 console.log(riddlesResults);
  $('.js-search-results').html(riddlesResults);

}

// function to get riddles from api and display riddles
function getAndDisplayRiddles() {
  console.log("getAndDisplayRiddles Executed. ");
  $('.js-search-form').submit(event =>{
    event.preventDefault();
   getRiddlesData(displayRiddles);
});
}


//  on page load do this
$(function() {
	getAndDisplayRiddles();
})
