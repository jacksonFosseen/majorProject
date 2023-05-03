document.addEventListener("DOMContentLoaded", function () {
  // Get current hour of the day
  let date = new Date();
  let hour = date.getHours();

  // Set background color based on the time of day
  if (hour >= 6 && hour < 12) {
    document
      .querySelectorAll("#everything div, button")
      .forEach(function (element) {
        element.style.backgroundColor = "#f0e993"; // morning
      });
  } else if (hour >= 12 && hour < 18) {
    document
      .querySelectorAll("#everything div, button")
      .forEach(function (element) {
        element.style.backgroundColor = "#85eefe"; // afternoon
      });
  } else {
    document
      .querySelectorAll("#everything div, button")
      .forEach(function (element) {
        element.style.backgroundColor = "#e37d64"; // evening/night
        element.style.color = "white"; // change text color for visibility
      });
  }
});

// cookie functions
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//fetch geolocation data from ipfindAPI
function getLocation() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c9012d3527mshd741f158218a534p1f22bejsn8fe9722aeb81",
      "X-RapidAPI-Host":
        "find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com"
    }
  };

  fetch(
    "https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8",
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      console.log(response);

      //create location search text
      let geolocation = response.latitude + "," + response.longitude;
      getWeather(geolocation);

      return response;
    })
    .catch((err) => console.error(err));
}

//fetch weather report from weatherAPI
function getWeather(locationSearch) {
  //load API
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c9012d3527mshd741f158218a534p1f22bejsn8fe9722aeb81",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com"
    }
  };

  //set default api location string
  let apiLocation =
    "https://weatherapi-com.p.rapidapi.com/current.json?q=" + locationSearch;

  console.log("API URL: " + apiLocation);

  //get weather data
  fetch(apiLocation, options)
    .then(function (response) {
      return response.json(); //convert to JSON and return
    })
    .then(function (response) {
      console.log(response);

      fetchForecast(locationSearch);

      //update page elements with object oproperties
      document.querySelector("h1").innerHTML = response.location.name;
      document.querySelector("#tempF span").innerHTML = response.current.temp_f;
      document.querySelector("#tempC span").innerHTML = response.current.temp_c;
      document.querySelector("#winDir span").innerHTML =
        response.current.wind_dir;
      document.querySelector("#winSpeed span").innerHTML =
        response.current.wind_mph;
      document.querySelector("#humidity span").innerHTML =
        response.current.humidity;
      document.querySelector("#cloud span").innerHTML = response.current.cloud;
    })
    .catch((err) => console.error(err));
} // end of getweather()

// api for future weather forecast
async function fetchForecast(locationSearch) {
  const url =
    "https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=" +
    locationSearch +
    "&contentType=json&unitGroup=us&shortColumnNames=0";
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "03a0620442mshda4600c1529dd89p1830c1jsndb0fea6cb3d9",
      "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // use json() method here
    console.log(result);
    //tomorrow
    document.querySelector("#highF span").innerHTML =
      result.locations[locationSearch].values["1"].maxt;
    document.querySelector("#lowF span").innerHTML =
      result.locations[locationSearch].values["1"].mint;
    document.querySelector("#cond span").innerHTML =
      result.locations[locationSearch].values["1"].conditions;
    document.querySelector("#winSpeed2 span").innerHTML =
      result.locations[locationSearch].values["1"].wspd;
    document.querySelector("#humidity2 span").innerHTML =
      result.locations[locationSearch].values["1"].humidity;
    //3rd day
    document.querySelector("#threeHighF span").innerHTML =
      result.locations[locationSearch].values["2"].maxt;
    document.querySelector("#threeLowF span").innerHTML =
      result.locations[locationSearch].values["2"].mint;
    document.querySelector("#cond2 span").innerHTML =
      result.locations[locationSearch].values["2"].conditions;
    document.querySelector("#winSpeed3 span").innerHTML =
      result.locations[locationSearch].values["2"].wspd;
    document.querySelector("#humidity3 span").innerHTML =
      result.locations[locationSearch].values["2"].humidity;

    // Update other elements in the DOM here if needed
  } catch (error) {
    console.error(error);
    console.log(locationSearch);
  }
} // end of fetchWeather()

//wait for DOM
document.addEventListener("DOMContentLoaded", function () {
  // check for previously searched location
  let priorPlace = getCookie("place");
  // if no previous search, get location, otherwise get previous cookie data
  if (priorPlace == "") {
    getLocation();
  } else {
    getWeather(priorPlace);
    fetchForecast(priorPlace); // Add this line here
  }

  let myForm = document.forms[0];
  myForm.addEventListener("submit", function (event) {
    //stop form submission
    event.preventDefault();

    //get value of search box input
    let searchText = document.querySelector("#placeSearch").value;
    console.log(searchText);

    //send weather search text to getWeather api function
    getWeather(searchText);

    setCookie("place", searchText, 7);
  });
});



