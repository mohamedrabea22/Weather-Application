async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "85ad4ee7053c429a3cc7fc85b94945a6";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ar`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("المدينة غير موجودة");
    const data = await res.json();

    const result = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>درجة الحرارة: ${data.main.temp}°C</p>
      <p>الطقس: ${data.weather[0].description}</p>
      <p>الرطوبة: ${data.main.humidity}%</p>
      <p>الرياح: ${data.wind.speed} متر/ث</p>
    `;

    document.getElementById("weatherResult").innerHTML = result;
  } catch (err) {
    document.getElementById(
      "weatherResult"
    ).innerHTML = `<p>${err.message}</p>`;
  }
}
