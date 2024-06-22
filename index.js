const CityInput = document.querySelector(".input");
const searchButton = document.querySelector(".search_btn");
const localButton = document.querySelector(".local-btn");
const currentweather = document.querySelector(".current");
const weathercards = document.querySelector(".cards");

const API_Key ="881ecbfaa6f3f98a431d9c8a5cb566fe";

const  createcard=(CityName,Item, Index)=>{
    if(Index === 0){
           return `   <div class="details">
                     <h2>${CityName}  (${Item.dt_txt.split(" ") [0]})</h2>
                     <h3>Temperature : ${(Item.main.temp - 273.15).toFixed(2)}°C</h3>
                     <h3>Wind: ${Item.wind.speed}M/S</h3>
                     <h3>Humidity: ${Item.main.humidity}%</h3>
                     </div>
       <div class="icon">
           <img src=https://openweathermap.org/img/wn/${Item.weather[0].icon}@4x.png"  alt="">
           <h2>${Item.weather[0].description}</h2>
        </div>`;
    }else{
        return ` <li class="cast">
        <h3>(${Item.dt_txt.split(" ") [0]})</h3>
        <img src="https://openweathermap.org/img/wn/${Item.weather[0].icon}@2x.png" alt="">
       <h3>Temperature : ${(Item.main.temp - 273.15).toFixed(2)}°C</h3>
       <h3>Wind: ${Item.wind.speed}M/S</h3>
       <h3>Humidity: ${Item.main.humidity}%</h3>
    </li>`;
    }
};

const getWeather = (CityName, lat, lon) =>{
    const weather_API=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}`;
    fetch(weather_API).then(res =>res.json()).then(data => {
        const castDays =[];
        const Dayscast=data.list.filter(forecast =>{
            const CastDate = new Date(forecast.dt_txt).getDate();
            if(!castDays.includes(CastDate)){
                 return castDays.push(CastDate)
            }
        });
        CityInput.value =" ";
        currentweather.innerHTML=" ";
        weathercards.innerHTML=" ";
        Dayscast.forEach((Item,Index) =>{
            if(Index ==0){
                currentweather.insertAdjacentHTML("beforeend", createcard(CityName,Item, Index));
           
            }else{
                weathercards.insertAdjacentHTML("beforeend", createcard(CityName,Item, Index));
           
            }
           
           
        });
    }).catch(() =>{
        alert("An Error occured while fetching the forecast")
    });
}
const getCityCoordinates = () =>{
    const CityName =  CityInput.value.trim();
    if(!CityName ) return;

    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${API_Key}`;
    fetch(API_URL).then(res => res.json()).then(data => {
        if(!data.length) return  alert(` No coordinates found for ${CityName}`);
        const { name , lat, lon } = data[0];
        getWeather(name , lat, lon);
    }).catch(() =>{
        alert("An Error occured while fetching the coordinates")
    });
}
const getuserCoordinates =()=>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const { latitude, longitude } = position.coords;
            const Reverse_API = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_Key}`;
            fetch(Reverse_API).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeather(name , latitude, longitude);
            }).catch(() =>{
                alert("An Error occured while fetching the city")
            });
        },
        error =>{
          if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation access denied.")
          }
        }
    );
}
localButton.addEventListener("click", getuserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
CityInput.addEventListener("keyup", a => a.key ==="Enter"&& getCityCoordinates);
