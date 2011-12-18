// Some initial data to populate models with.  The first load stuffs these into
// localstorage, from then on, we pull these from there.

if(!localStorage.questions){
	//console.log('initializing localStorage');
	data = {
		1: {
			id: 1,
			question: "What are the some new elements available in HTML5?",
			answers: {
				a: "&lt;header>",
				b: "&lt;nav>",
				c: "&lt;article>",
				d: "&lt;date>",
				e: "&lt;section>",
				f: "&lt;footer>"
			}
		},
		
		2: {
			id: 2,
			question: "What are some new form input types available in HTML5?",
			answers: {
				a: "search",
				b: "url",
				c: "email",
				d: "datetime",
				e: "number"
			}
		}
	}
	
	localStorage.setItem("questions", JSON.stringify(data));
	
}
