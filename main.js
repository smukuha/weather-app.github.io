import './style.css'
import { getWeather } from './weather'
import {ICON_MAP} from "./iconMaps"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

  function positionSuccess({coords}){
    getWeather(
      coords.latitude,
      coords.longitude,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ).then(renderWeather)
  .catch(e => {
    console.error(e)
    alert("Error fetching Data.")
  })
  }

function positionError(){
  alert(
    "There was an error gettng your location. Please allow us to use your location and refresh the page."
  )
}

// getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone
//       ).then(renderWeather)
//     .catch(e => {
//       console.error(e)
//       alert("Error fetching Data.")
//     })
  

  function renderWeather({current,daily,hourly}){
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)

    document.body.classList.remove("blurred")
      
  }


  function setValue(selector, value, { parent = document } = {}) {
    const element = parent.querySelector(`[data-${selector}]`);
    if (element) {
        element.textContent = value;
    } else {
        console.warn(`Element with selector [data-${selector}] not found.`);
    }
}


function getIconUrl(iconCode) {
  const iconName = ICON_MAP.get(iconCode);
  if (iconName === undefined) {
      console.error(`Icon not found for iconCode: ${iconCode}`);
      return ''; // Return an empty string or a default icon URL in case of an error.
  }
  return `icons/${iconName}.svg`;
}


const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode);
    setValue("current-temp", current.currentTemp);
    setValue("current-high", current.highTemp);
    setValue("current-low", current.lowTemp);
    setValue("current-fl-high", current.highFeelsLike);
    setValue("current-fl-low", current.lowFeelsLike);
    setValue("current-wind", current.windSpeed);
    setValue("current-precip", current.precip);
}


const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday: "long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily){
 dailySection.innerHTML = ""
  daily.forEach(day =>{
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp", day.maxTemp, {parent: element})
    setValue("date", DAY_FORMATTER.format(day.timestamp),{ parent:element})
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })

}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric", hour12: true})
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")

function renderHourlyWeather(hourly){
 
  hourlySection.innerHTML = ""
  hourly.forEach(hour =>{
    const element = hourRowTemplate.content.cloneNode(true)
    setValue("temp", hour.temp, {parent: element})
    setValue("fl-temp", hour.feelsLike, {parent: element})
    setValue("wind", hour.windSpeed, {parent: element})
    setValue("precip", hour.precip, {parent: element})
    setValue("day", DAY_FORMATTER.format(hour.timestamp),{ parent:element})
    setValue("time", HOUR_FORMATTER.format(hour.timestamp),{ parent:element})
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.append(element)
  })

}