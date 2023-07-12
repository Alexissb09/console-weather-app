import fs from "fs";

import axios from "axios";
import "dotenv/config";

export default class Searchs {
  path = "./db/database.json";
  history = [];

  constructor() {
    // TODO: Leer base de datos si existe
    this.readData();
  }

  get historyCapitalized() {
    // Capitalizar el historial

    return this.history.map((city) => {
      let words = city.split(" ");
      words = words.map((word) => word[0].toUpperCase() + word.substring(1));

      return words.join(" ");
    });
  }

  addHistory(city = "") {
    if (this.history.includes(city.toLocaleLowerCase())) {
      return;
    }
    this.history.unshift(city.toLocaleLowerCase());

    this.saveData();
  }

  // Retorna parametros que se usan normalmente
  get getParamsMapbox() {
    return {
      language: "en",
      access_token: process.env.MAPBOX_KEY,
    };
  }

  get getParamsWeather() {
    return {
      appid: process.env.WEATHER_APIKEY,
      units: "metric",
      lang: "es",
    };
  }

  async city(city = "") {
    try {
      // Creamos una instancia de axios y le mandamos los parametros, etc.
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?`,
        params: this.getParamsMapbox,
      });

      // peticion http
      const resp = await instance.get();

      // Por cada ciudad retornamos solo lo que nos interesa
      return resp.data.features.map((city) => ({
        id: city.id,
        name: city.place_name,
        lng: city.center[0],
        lat: city.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async weather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          ...this.getParamsWeather,
          lat,
          lon,
        },
      });

      const resp = await instance.get();

      const { weather, main } = resp.data;

      return {
        temp: main.temp,
        description: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
      };
    } catch (error) {
      console.log(error);
    }
  }

  saveData() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.path, JSON.stringify(payload));
  }

  readData = () => {
    if (!fs.existsSync(this.path)) {
      return null;
    }

    const info = fs.readFileSync(this.path, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.history = data.history;
  };
}
