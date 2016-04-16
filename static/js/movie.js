(function($) {

	$(document).ready(loadMovies);

	
	$("#movie-form").submit(function(){
		var formConfig = {
			method: "POST", 
			url: "/api/movies",
			contentType: 'application/json',
			data: JSON.stringify({
				title: $("#movie-title").val(),
				rating: $("#movie-rating").val()
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
					method: "POST",
					url: "/delete",
					contentType: 'application/json',
					data: JSON.stringify({
						id: movieId
					})
				};
				$.ajax(buttonConfig).done(function(responseMessage) {
					loadMovies();
				});
			});
		});
	}

})(window.jQuery);