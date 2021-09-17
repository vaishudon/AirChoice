let locationName = ''
let chosenLat = 0;
let chosenLong = 0;

document.addEventListener('DOMContentLoaded', function () {

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const airQualityAPILink = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=' + latitude + '&lon=' + longitude + '&appid=ID'
        const getCityAPILink = 'https://www.mapquestapi.com/geocoding/v1/reverse?key=ID&location=' + latitude + '%2C' + longitude + '&outFormat=json&thumbMaps=false';

        // getting city from coordinates
        fetch(getCityAPILink).then(r => r.text()).then(result => {
            let addressJSON = JSON.parse([result])
            locationName = addressJSON.results[0].locations[0].adminArea5 + ", " + addressJSON.results[0].locations[0].adminArea3;
        })

        // getCurrentLocationAirQuality(airQualityAPILink);

        // search for cities
        let ps = placeSearch({
            key: 'ID',
            container: document.querySelector('#place-search-input'),
            limit: 15
        });

        let chosenLocationName = '';
        ps.on('change', (e) => {
            //console.log(e.result);
            chosenLat = e.result.latlng.lat;
            chosenLong = e.result.latlng.lng;
            chosenLocationName = e.result.value;

            // let chosenAPILink = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=' + chosenLat + '&lon=' + chosenLong + '&appid=c908fb595ac1a4997634ec6fced7f69e'

            //if (chosenLocationName !== '') {
            // air quality at chosen location
            // fetch(chosenAPILink).then(r => r.text()).then(result => {
            //     //console.log('here')
            //     let airQual = JSON.parse([result]).list[0].main.aqi
            //     // let toPrint = 'Air Quality in ' + chosenLocationName + ': ' + airQual
            //     // console.log(toPrint)
            //     // let tag = document.createElement("p");
            //     // let text = document.createTextNode(toPrint);

            //     // tag.appendChild(text);
            //     // var element = document.getElementById("chosenAirQualList");
            //     // element.appendChild(tag);

            //     // document.getElementById("chosenAirQual").innerHTML = toPrint;
            //     createCard(chosenLocationName, airQual);

            // })
            let linkChosen = 'https://api.waqi.info//feed/geo:' + chosenLat + ';' + chosenLong + '/?token=802b62f1ba4c38f9a218ad105fb9ffd95e0f83ed';
            fetch(linkChosen).then(r => r.text()).then(result => {
                let airQual = JSON.parse([result]).data.aqi;
                // let airQual = JSON.parse([result]).list[0].main.aqi
                // console.log(JSON.parse([result]).data.iaqi);
                createCard(chosenLocationName, airQual, result);

            })
        });

        let link = 'https://api.waqi.info//feed/geo:' + latitude + ';' + longitude + '/?token=802b62f1ba4c38f9a218ad105fb9ffd95e0f83ed';

        fetch(link).then(r => r.text()).then(result => {
            let airQual = JSON.parse([result]).data.aqi;
            // let airQual = JSON.parse([result]).list[0].main.aqi
            createCard(locationName, airQual, result);

        })

        // possible hisotrical data
        //     let link2 = 'https://www.airnowapi.org/aq/observation/latLong/historical?format=application/json&latitude=' + latitude+'&longitude='+ longitude+ '&date=2000-09-07T00-0000&distance=200&API_KEY=ID';

        //     fetch(link2).then(r => r.text()).then(result => {
        //         // let airQual = JSON.parse([result]).data.aqi;
        //         // // let airQual = JSON.parse([result]).list[0].main.aqi
        //         // createCard(locationName, airQual);
        //         console.log(result);

        //    })

        //}

        


    });



    //checkPageButon.addEventListener('click', function(){

    // const response = axios.get('http://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=50&appid=ID');
    // console.log(response.list.dt)

    //     chrome.tabs.getSelected(null, function(tab){
    //         let d = document;

    //         var f = d.createElement('form');
    //         f.action = 'http://gtmetrix.com/analyze.html?bm';
    //         f.method = 'post';
    //         var i = d.createElement('input');
    //         tab.type = 'hidden';
    //         i.name = 'url';
    //         f.appendChild(i);
    //         d.body.appendChild(f);
    //         f.submit();

    //     });


    //}, false);



}, false);

async function getCurrentLocationAirQuality(airQualityAPILink = '') {
    // air quality at current location
    await fetch(airQualityAPILink).then(r => r.text()).then(result => {
        // let airQual = JSON.parse([result]).list[0].main.aqi
        // let toPrint = 'Air Quality in ' + locationName + ': ' + airQual
        // // document.getElementById("airQuality").innerHTML = toPrint;
        // createCard(locationName, airQual);

    })


}

function createCard(cityName, airQual, result) {
    // console.log('here');

    if (cityName.length > 10) {
        let count = 0;
        for (let index = 0; index < cityName.length; index++) {
            let char = cityName.charAt(index);
            // console.log(count);

            if (char == ",") {
                count++;
                console.log(count);

            }
            if (count == 2) {
                console.log('here');
                cityName = cityName.substring(0, index);
            }
        }
    }
    const newCard = document.createElement('div');
    newCard.className = "container";
    newCard.id = cityName;


    // new details content (details)
    const newContent = document.createElement('details');
    newContent.className = "content";

    const newSummary = document.createElement('summary');

    // class = "summary"
    const newSummaryClassName = document.createElement('div');
    newSummaryClassName.className = "summary";

    // class = "summaryInfo"
    const newSummaryInfo = document.createElement('div');
    newSummaryInfo.className = "summaryInfo";

    // new city (h3)
    const newCity = document.createElement('h3');
    newCity.className = "city"
    newCity.innerHTML = cityName;

    // new air quality (div)
    const newAirQual = document.createElement('div');
    newAirQual.className = "airQuality"
    newAirQual.innerHTML = "AQI: " + airQual;

    const expanded = document.createElement('p');
    const expandedContent = document.createElement('div')
    expandedContent.className = "expandedContent";

    // const newInnerExpanded = document.createElement('div');
    // newInnerExpanded.className = "expandedContentInner";

    let listOfInnerExpandedContent = Array();
    // elements in exanded info
    //const co = document.createElement("div");

    //co.innerHTML = "CO";
    // const coNum = document.createElement("div");
    const info = JSON.parse([result]).data.iaqi;

    let arr = Object.keys(JSON.parse([result]).data.iaqi);
    let arrEntries = Object.values(Object.values(JSON.parse([result]).data.iaqi));
    for (let key in arr) {
        let co = document.createElement("div");
        co.innerHTML = arr[key].toUpperCase();

        let coNum = document.createElement("div");
        coNum.innerHTML = arrEntries[key].v;
        //console.log(arrEntries[key].v)
        //console.log(typeof (arrEntries[key].v))

        // arrEntries.splice(0,1);

        // new elements added to inner expanded
        let newInnerExpanded = document.createElement('div');
        newInnerExpanded.className = "expandedContentInner";
        newInnerExpanded.appendChild(co);
        newInnerExpanded.appendChild(coNum);
        listOfInnerExpandedContent.push(newInnerExpanded);
    }
    // coNum.innerHTML = "" + JSON.parse([result]).data.iaqi.co
    // ;

    //console.log(listOfInnerExpandedContent);

    for (var i = 0; i < listOfInnerExpandedContent.length; i++) {
        //console.log(listOfInnerExpandedContent[i])
        expandedContent.appendChild(listOfInnerExpandedContent[i]);

    }


    // add expanded to outer expanded

    // add expended content to expanded (p)
    expanded.appendChild(expandedContent);


    // newExpandedContent.innerHTML = "expanded infooooooooo";
    // newExpandedContent.className = "expandedContent";
    const newImage = document.createElement('img');

    let imageSource = findAirQualImageSrc(airQual, newCard);
    newImage.src = imageSource;
    newImage.className = "airQualImage";

    newSummaryInfo.appendChild(newCity);
    newSummaryInfo.appendChild(newAirQual);
    newSummaryClassName.appendChild(newSummaryInfo);
    newSummaryClassName.appendChild(newImage)

    newSummary.appendChild(newSummaryClassName);

    newContent.appendChild(newSummary);
    newContent.appendChild(expanded);

    newCard.appendChild(newContent);

    var element = document.getElementById("list");
    element.appendChild(newCard);

    // const card = document.getElementsByClassName("container");
    // newCard.addEventListener('click', function () {
    //     handleCardClick(cityName, airQual);
    // });
    // for (let item of card) {
    //     console.log(item.id);
    // }
    // airQual.className = "airQuality";
    // card.append(airQual)
    // card.append(city)
    // card.innerHTML = "Bothell, Washington: 3"

}


function findAirQualImageSrc(airQual, newCard) {

    let integer = parseInt(airQual);

    if (integer <= 50) {
        newCard.style.backgroundColor = '#8acea7';
        newCard.style.borderColor = '#0B9444';
        return "./images/green.png";
    } else if (integer <= 100) {
        newCard.style.backgroundColor = '#ecdf7c';
        newCard.style.borderColor = '#FFDE16';
        return "./images/yellow.png";
    } else if (integer <= 150) {
        newCard.style.backgroundColor = '#fcc37e';
        newCard.style.borderColor = '#F7941E';
        return "./images/orange.png"
    } else if (integer <= 200) {
        newCard.style.backgroundColor = '#ee8e91';
        newCard.style.borderColor = '#ED1C24';
        return "./images/red.png";
    } else if (integer <= 300) {
        newCard.style.backgroundColor = '#c0abda';
        newCard.style.borderColor = '#773CBE';
        return "./images/purple.png"
    }
    newCard.style.backgroundColor = '#f0939c';
    newCard.style.borderColor = '#BF1E2E';
    return "./images/maroon.png"

}
function handleCardClick(cityName, airQual) {
    //console.log("city: " + cityName + " ari qual: " + airQual);
    var c = document.getElementById(cityName).childNodes[0];
    var z = document.createElement('p');
    z.className = "expandedContent"
    z.innerHTML = "INSERT Info here..."
    //console.log(c);

}