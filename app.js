const API_KEY = "85ad4ee7053c429a3cc7fc85b94945a6"; // حط الـ Key بتاعك هنا

// دالة تحويل حالة الطقس إلى إيموجي مباشر وسريع
function getWeatherEmoji(iconCode, weatherId) {
  // معرفات الأيقونات المشهورة من OpenWeatherMap
  if (weatherId >= 200 && weatherId < 300) return "🌩️"; // عواصف ورعد
  if (weatherId >= 300 && weatherId < 500) return "🌧️"; // رذاذ مطر
  if (weatherId >= 500 && weatherId < 600) return "🌧️"; // أمطار
  if (weatherId >= 600 && weatherId < 700) return "❄️"; // ثلوج
  if (weatherId >= 700 && weatherId < 800) return "🌫️"; // ضباب أو غبار
  if (weatherId === 800) return iconCode.includes("n") ? "🌙" : "☀️"; // صافي (ليلي / نهاري)
  if (weatherId === 801) return "🌤️"; // غائم جزئياً
  if (weatherId >= 802) return "☁️"; // غائم
  return "🌡️";
}

async function fetchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  try {
    document.getElementById("cityName").innerText = "جاري التحميل...";

    // 1. جلب الطقس الحالي
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ar`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) throw new Error("المدينة غير موجودة");
    const currentData = await currentResponse.json();

    // 2. جلب التوقعات
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ar`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // 3. تحديث الواجهة
    updateUI(currentData, forecastData);

  } catch (error) {
    alert(error.message || "حدث خطأ أثناء جلب البيانات");
    document.getElementById("cityName").innerText = "خطأ في البحث";
  }
}

function updateUI(current, forecast) {
  document.getElementById("cityName").innerText = current.name;
  document.getElementById("tempValue").innerText = Math.round(current.main.temp);
  document.getElementById("weatherCondition").innerText = current.weather[0].description;
  document.getElementById("humidity").innerText = `${current.main.humidity}%`;
  document.getElementById("windSpeed").innerText = `${Math.round(current.wind.speed * 3.6)} كم/س`;
  document.getElementById("pressure").innerText = `${current.main.pressure} hPa`;

  // تحديث الإيموجي الرئيسي برمجياً
  const mainEmoji = getWeatherEmoji(current.weather[0].icon, current.weather[0].id);
  document.getElementById("mainIcon").innerText = mainEmoji;

  // تحديث قائمة الأيام
  const forecastList = document.getElementById("forecastList");
  forecastList.innerHTML = "";

  const dailyData = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString('ar-EG', { weekday: 'long' });
    
    // جلب الإيموجي الخاص بكتيب التوقعات
    const dayEmoji = getWeatherEmoji(item.weather[0].icon, item.weather[0].id);

    forecastList.innerHTML += `
      <div class="forecast-item">
        <span class="forecast-day">${dayName}</span>
        <span class="forecast-icon" style="font-size: 1.5rem;">${dayEmoji}</span>
        <span class="forecast-temp">${Math.round(item.main.temp)}°</span>
      </div>
    `;
  });
}

// دعم زر Enter
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchWeather();
});

fetchWeather();
