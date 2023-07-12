import {
  inquirerMenu,
  pause,
  readInput,
  listCities,
} from "./helpers/inquirer.js";
import Searchs from "./models/searchs.js";

const main = async () => {
  let opt;

  const searchs = new Searchs();

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const city = await readInput("Enter a city:");

        // Buscar la ciudad
        const cities = await searchs.city(city);

        // Seleccionar la ciudad
        const id = await listCities(cities);

        if (id === 0) continue; // Vuelve al menu

        const citySelected = cities.find((city) => city.id === id);
        const { name, lat, lng } = citySelected;

        // Guardar en DB
        searchs.addHistory(name);

        // Obtenemos datos del clima
        const { description, temp, min, max } = await searchs.weather(lat, lng);

        // Mostramos los datos
        console.log("\nCity information\n".green);
        console.log(`City: ${name}`);
        console.log(`Lat: ${lat}°`);
        console.log(`Lon: ${lng}°`);
        console.log(`Description: ${description}`);
        console.log(`Temp: ${temp}°C`);
        console.log(`Min: ${min}°C`);
        console.log(`Max: ${max}°C`);

        break;

      case 2:
        searchs.historyCapitalized.forEach((city, i) => {
          const idx = `${i + 1}.`.green;
          console.log(idx + city);
        });
    }
    if (opt !== 0) await pause();
  } while (opt !== 0);
  console.clear();
};

main();
