/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//search bar handler
$('document').ready(function () {
    var searchField = $('#query');
    var icon = $('#search-btn');

    // Focus Event Handler the size of search input and the icon change  when we click inside
    searchField.on('focus', function () {
        $(this).animate({
            width: '100%'// we increase the input size 

        }, 400);
        icon.animate({
            right: '10px'// the icon btn is moved to the right of 10px
        }, 400);
    });
    //blur event Handler
    searchField.on('blur', function () {
        if (searchField.val() === '') {
            searchField.animate({
                width: '45%'
            }, 400);
            icon.animate({
                right: '360px'
            }, 400);
        }
    });

    $('#search-form').submit(function (e) {
        e.preventDefault();// prevent the form for submitting
    });
});

function search() {
    //clear results if we make a new search so we dont want the new results to be on the top of the old one
    $('#results').html('');//set the html tag linked to that id to nothing 
    $('#buttons').html('');

    // get from input
    q = $('#query').val();


    /*run the get request on API by using the jquery method get jQuery.get(url [,data ] [,success ] [, dataType ] )
     *  to load data from server through a http get request
     */

    $.get(
            "https://www.googleapis.com/youtube/v3/search", {
                part: 'snippet, id',
                q: q,
                type: 'video',
                key: 'AIzaSyDfA9GjbBsLNuXxMR4xA6c7u4H4yVzurhg'

            }, function (data) {//callback function
        var nextPageToken = data.nextPageToken;
        var prevPageToken = data.prevPageToken;
        //below we use the jquery function each to go through each data.items by using the callback funtion(i,item) where i is the index of the item
        $.each(data.items, function (i, item) {
            var output = getOutput(item);
            //display output on result
            $('#results').append(output);
        });

        var buttons = getButtons(prevPageToken, nextPageToken);
        $('#buttons').append(buttons);
    }

    );
}

// next page token

function nextPage() {
    // get from input
    var data_token = $('#next-button').data('token');// we get the data from the data-token attribut of button next-page
    var query = $('#next-button').data('query')
    //clear results if we make a new search so we dont want the new results to be on the top of the old one
    $('#results').html('');//set the html tag linked to that id to nothing 
    $('#buttons').html('');




    /*run the get request on API by using the jquery method get jQuery.get(url [,data ] [,success ] [, dataType ] )
     *  to load data from server through a http get request
     */

    $.get(
            "https://www.googleapis.com/youtube/v3/search", {
                part: 'snippet, id',
                q: query,
                pageToken: data_token,
                type: 'video',
                key: 'AIzaSyDfA9GjbBsLNuXxMR4xA6c7u4H4yVzurhg'

            }, function (data) {
        var nextPageToken = data.nextPageToken;
        var previousPageToken = data.prevPageToken;
        //below we use the jquery function each to go through each data.items by using the callback funtion(i,item) where i is the index of the item
        $.each(data.items, function (i, item) {
            var output = getOutput(item);
            //display output on result
            $('#results').append(output);
        });

        var buttons = getButtons(previousPageToken, nextPageToken);
        $('#buttons').append(buttons);
    }

    );
}

//previous token page
function prevPage() {
    // get from input
    var data_token = $('#prev-button').data('token');// we get the data from the data-token attribut of button next-page
    var query = $('#prev-button').data('query');
    //clear results if we make a new search so we dont want the new results to be on the top of the old one
    $('#results').html('');//set the html tag linked to that id to nothing 
    $('#buttons').html('');




    /*run the get request on API by using the jquery method get jQuery.get(url [,data ] [,success ] [, dataType ] )
     *  to load data from server through a http get request
     */

    $.get(
            "https://www.googleapis.com/youtube/v3/search", {
                part: 'snippet, id',
                q: query,
                pageToken: data_token,
                type: 'video',
                key: 'AIzaSyDfA9GjbBsLNuXxMR4xA6c7u4H4yVzurhg'

            }, function (data) {
        var nextPageToken = data.nextPageToken;
        var previousPageToken = data.prevPageToken;
        //below we use the jquery function each to go through each data.items by using the callback funtion(i,item) where i is the index of the item
        $.each(data.items, function (i, item) {
            var output = getOutput(item);
            //display output on result
            $('#results').append(output);
        });

        var buttons = getButtons(previousPageToken, nextPageToken);
        $('#buttons').append(buttons);
    }

    );
}

// build output
function getOutput(item) {
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;

    // Build Output String
    var output = '<li>' +
            '<div class="list-left">' +
            '<img src="' + thumb + '">' +
            '</div>' +
            '<div class="list-right">' +
            '<h3><a data-fancybox href="http://www.youtube.com/embed/'+videoId+'">' + title + '</a></h3>' +
            '<small>By <span class="cTitle">' + channelTitle + '</span> on ' + videoDate + '</small>' +
            '<p>' + description + '</p>' +
            '</div>' +
            '</li>' +
            '<div class="clearfix"></div>' +
            '';

    return output;
}

/* Build the buttons data-token and data-query are data-* attribut used to store the data in the specific page
 * so the data can be used on other pages without any round trip on the server side or database
 * */
function getButtons(prevPageToken, nextPageToken) {
    if (!prevPageToken) {
        var btnoutput = '<div class="button-container">' +
                '<button id="next-button" class="paging-button" data-token="' + nextPageToken +
                '" data-query="' + q + '"' +
                'onclick="nextPage();">Next Page</button></div>';
    } else {
        var btnoutput = '<div class="button-container">' +
                '<button id="prev-button" class="paging-button" data-token="' + prevPageToken + '" data-query="' + q + '"' +
                'onclick="prevPage();">Prev Page</button>' +
                '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
                'onclick="nextPage();">Next Page</button></div>';
    }

    return btnoutput;
}