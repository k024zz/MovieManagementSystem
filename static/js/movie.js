(function($) {

	$(document).ready(function() {
		$("body").data("mode", "general");
		loadMovies();
	});

	$("#general").click(function() {
		$("body").data("mode", "general");
		loadMovies();
	});

	$("#popular").click(function() {
		$("body").data("mode", "popular");
		loadMovies();
	});

	$("#movie-form").submit(function(){
		var title = $("#movie-title").val();
		var rating = $("#movie-rating").val();

		// input check
		if(title == "" || rating == "") {
			alert("title and rating cannot be empty");
			return;
		}
		if(parseFloat(rating) > 5 || parseFloat(rating) < 0) {
			alert("range of rating: [0~5]");
			return;
		}

		var formConfig = {
			method: "POST", 
			url: "/api/movies",
			contentType: 'application/json',
			data: JSON.stringify({
				title: title,
				rating: rating
			})
		};

		$.ajax(formConfig).done(function(responseMessage) {
			alert("success");
			loadMovies();
		});
	});
	

	function loadMovies() {
		// clean the table first
		$("#movie_table").empty();

		var requestConfig = {
		    method: "GET",
		    url: "/api/movies"
		};

		$.ajax(requestConfig).then(function(responseMessage) {

			// only show most popular movies in popular mode
			if($("body").data("mode") == "popular") {
				// find max rating
				var maxRating = 0;
				for(var i=0; i<responseMessage.length; i++) {
					if(responseMessage[i].rating > maxRating) {
						maxRating = responseMessage[i].rating;
					}
				}
				// get the most popular movies
				var temp = [];
				for(var i=0; i<responseMessage.length; i++) {
					if(responseMessage[i].rating == maxRating) {
						temp.push(responseMessage[i]);
					}
				}
				responseMessage = temp;
			}

			// append movies to table
			for(var i=0; i<responseMessage.length; i++) {
				var tr = $("<tr class='debug'></tr>");
				tr.data("id", responseMessage[i]._id);
				tr.append($("<th></th>").text((i+1).toString()));
				tr.append($("<th></th>").text(responseMessage[i].title));
				tr.append($("<th></th>").text(responseMessage[i].rating));
				var th = $("<th></th>");
				th.append($("<button></button>").text("like").attr({"class": "like_button btn btn-success"}));
				th.append($("<button></button>").text("dislike").attr({"class": "dislike_button btn btn-info"}));
				th.append($("<button></button>").text("delete").attr({"class": "delete_button btn btn-danger"}));
				tr.append(th);
				$("#movie_table").append(tr);
			}

			// bind button event
			$(".like_button").click(function(event) {
				// get the movie id of the button from parent
				var movieId = $(this).parent().parent().data("id");
				var buttonConfig = {
					method: "POST",
					url: "/rating",
					contentType: 'application/json',
					data: JSON.stringify({
						rating: 1,
						id: movieId
					})
				};
				$.ajax(buttonConfig).done(function(responseMessage) {
					loadMovies();
				});
			});

			$(".dislike_button").click(function(event) {
				// get the movie id of the button from parent
				var movieId = $(this).parent().parent().data("id");
				var buttonConfig = {
					method: "POST",
					url: "/rating",
					contentType: 'application/json',
					data: JSON.stringify({
						rating: -1,
						id: movieId
					})
				};
				$.ajax(buttonConfig).done(function(responseMessage) {
					loadMovies();
				});
			});

			$(".delete_button").click(function(event) {
				// get the movie id of the button from parent
				var movieId = $(this).parent().parent().data("id");
				var buttonConfig = {
					method: "DELETE",
					url: "/api/movies/"+movieId
				};
				$.ajax(buttonConfig).done(function(responseMessage) {
					loadMovies();
				});
			});
		});
	}

})(window.jQuery);