function updateTime() {
  // Los Angeles
  let losAngelesElement = document.querySelector("#los-angeles");
  if (losAngelesElement) {
    let losAngelesDateElement = losAngelesElement.querySelector(".date");
    let losAngelesTimeElement = losAngelesElement.querySelector(".time");
    let losAngelesTime = moment().tz("America/Los_Angeles");

    losAngelesDateElement.innerHTML = losAngelesTime.format("MMMM Do YYYY");
    losAngelesTimeElement.innerHTML = losAngelesTime.format(
      "h:mm:ss [<small>]A[</small>]"
    );
  }

  // Paris
  let parisElement = document.querySelector("#paris");
  if (parisElement) {
    let parisDateElement = parisElement.querySelector(".date");
    let parisTimeElement = parisElement.querySelector(".time");
    let parisTime = moment().tz("Europe/Paris");

    parisDateElement.innerHTML = parisTime.format("MMMM Do YYYY");
    parisTimeElement.innerHTML = parisTime.format(
      "h:mm:ss [<small>]A[</small>]"
    );
  }
}

function updateCity(event) {
  let cityTimeZone = event.target.value;
  if (cityTimeZone === "current") {
    // Use geolocation for current city
    getCurrentLocation();
  } else {
    let cityName = cityTimeZone.replace("_", " ").split("/")[1];
    let cityTime = moment().tz(cityTimeZone);
    let citiesElement = document.querySelector("#cities");
    citiesElement.innerHTML = `
      <div class="city">
        <div>
          <h2>${cityName}</h2>
          <div class="date">${cityTime.format("MMMM Do YYYY")}</div>
        </div>
        <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small></div>
      </div>
      <a href="/">All cities</a>
    `;
  }
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Call reverse geocoding to get the city name based on latitude and longitude
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        )
          .then(response => response.json())
          .then(data => {
            // Check if the location is in Ethiopia, manually set to Bahir Dar if applicable
            let cityName;
            if (data.countryName === "Ethiopia") {
              // Manually set the city to Bahir Dar if detected in Ethiopia
              cityName = "Bahir Dar";
            } else {
              cityName = data.city || "Unknown Location";
            }

            const timezone = moment.tz.guess(); // Get the user's timezone
            let cityTime = moment().tz(timezone);

            let citiesElement = document.querySelector("#cities");
            citiesElement.innerHTML = `
              <div class="city">
                <div>
                  <h2>${cityName}</h2>
                  <div class="date">${cityTime.format("MMMM Do YYYY")}</div>
                </div>
                <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small></div>
              </div>
              <a href="/">All cities</a>
            `;
          })
          .catch(err => {
            console.error("Error fetching location: ", err);
          });
      },
      error => {
        console.error("Geolocation error: ", error);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Update time on page load and every second
updateTime();
setInterval(updateTime, 1000);

// Listen for city selection changes
let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);
