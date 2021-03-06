var name;
var address;
var yelptoken = "Bearer dlVH8b6SrxR8hB3Qt-kp8oNeaDzXSYP5O_pG7Gy6Sm5E7PxMa_6wbrpY88thyflQ3KVJ8xg6eAtGO_oEYRtC8c9oXBTVsCSbJGzV65ohKSdKhEIDxqvvZxGP5X_lWXYx";


$(document).ready(function() {

    // run();


    //Store name globally to use after 2nd of 2 step search
    $("#name-submit").on("click", function() { 
     
        name = $("#name-input").val().trim();
        console.log(name)

    });

    //Store address and kick off page logic process
    $("#address-submit").on("click", function() {

        console.log(name);

        var address = $("#address-input").val().trim();

        console.log(address);
        
        if(!(address === null || address.match(/^ *$/) !== null)) {
            
            var frmtAddr = addressSearch(address);
            var frmtName = formatInput(name);

            //Make API calls
            yelpAPIcall(frmtName,frmtAddr);           
            zomatoAPIcall(frmtName,frmtAddr);
            googleAPIcall(frmtName,frmtAddr);

        }
    });
});


//Function to make Zomato API Call
function zomatoAPIcall (frmtName,frmtAddr) {

    var zomatokey = "f73f1e3b1f28a94ae801eb97cf84f822";

    request(proxyOptions('GET', frmtAddr))  
            .then(function (coordsResponse) {
                var coords = coordinates(coordsResponse);
                return request({
                    method: 'POST',
                    url: zomatoRestaurantSearch(coords, frmtName),
                    headers: {
                        "user-key": zomatokey
                       }
                });
            })
            .then(function (detailsResponse) {
                var zomatoPlace = JSON.parse(detailsResponse).restaurants[0];
                console.log(zomatoPlace.restaurant.name);
                console.log("Zomato: " + formatReview(zomatoPlace.restaurant.user_rating.aggregate_rating));
            });

}

//Function to make Google Places API call
function googleAPIcall (frmtName,frmtAddr) {

     request(proxyOptions('GET', frmtAddr))  
            .then(function (coordsResponse) {
                var coords = coordinates(coordsResponse);
                return request(proxyOptions('GET', googleDetailSearch(coords, frmtName)));
            })
            .then(function (detailsResponse) {
               
                return getRestaurant(frmtName, detailsResponse);
            })
            .then(function(restraurantResponse) {
                
                console.log("Google: " + formatReview(restraurantResponse.rating));
            });


}

function yelpAPIcall(frmtName,frmtAddr) {

var yelptoken = "Bearer dlVH8b6SrxR8hB3Qt-kp8oNeaDzXSYP5O_pG7Gy6Sm5E7PxMa_6wbrpY88thyflQ3KVJ8xg6eAtGO_oEYRtC8c9oXBTVsCSbJGzV65ohKSdKhEIDxqvvZxGP5X_lWXYx";
var chriskey = "55d9430e09095b44d75ece0c0380c9daf1946332";

   request(proxyOptions('GET', frmtAddr))  
            .then(function (coordsResponse) {
                var coords = coordinates(coordsResponse);
                return request({
                    method: 'GET',
                    url: csProxyUtils.buildProxyUrl(chrisKey, yelpRestaurantSearch(coords, frmtName)),
                    headers: {
                        "authorization": yelptoken
                       }
                });
            })
            .then(function (detailsResponse) {
                var yelpPlace = JSON.parse(detailsResponse).businesses[0];
                 console.log("Yelp: " + formatReview(yelpPlace.rating));
            });
}

//Function to remove or replace special characters which will cause issues in url string
function formatInput(field) {
    return field.replace(' ', '+')
                .replace('.', '+')
                .replace(',', '+')
                .replace("'", "");
}

function formatReview(review) {
    return review === "0" ? "Tu Fue Reviews" : review;
}

//Test function that runs page logic without input
function run () {

            //Test Case 1
            // var frmtAddr = addressSearch("809 Thomas Ave, San Diego, CA 92109");
            // var frmtName = formatInput("The Local");

            //Test Case 2
            var frmtAddr = addressSearch("8970 University Center Ln, San Diego, CA 92122");
            var frmtName = formatInput("Fleming's");
            

            //Make API calls
            yelpAPIcall(frmtName,frmtAddr);           
            zomatoAPIcall(frmtName,frmtAddr);
            googleAPIcall(frmtName,frmtAddr);
            firebasecall(frmtName, frmtAddr);
}