import inquirer from "inquirer";
import "colors";

export const inquirerMenu = async () => {
  const questions = [
    {
      type: "list",
      name: "option",
      message: "What would you like to do",
      choices: [
        {
          value: 1,
          name: `${"1.".green} Search city`,
        },
        {
          value: 2,
          name: `${"2.".green} History`,
        },
        {
          value: 0,
          name: `${"0.".green} Exit`,
        },
      ],
    },
  ];

  console.clear();
  console.log("==================".green);
  console.log(" Choose an option ".bold.green);
  console.log("==================\n".green);

  const { option } = await inquirer.prompt(questions);
  return option;
};

export const pause = async () => {
  const question = [
    {
      type: "input",
      name: "option",
      message: `Press ${"ENTER".green} to continue`,
    },
  ];

  console.log("\n");

  const { option } = await inquirer.prompt(question);
  console.clear();
  return option;
};

export const readInput = async (message = "") => {
  const question = [
    {
      type: "input",
      name: "description",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Insert a value";
        }
        return true;
      },
    },
  ];

  const { description } = await inquirer.prompt(question);
  return description;
};

export const listCities = async (cities = []) => {
  // Listamos una ciudad y retornamos la seleccionada

  const choices = cities.map((city, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: city.id,
      name: `${idx} ${city.name}`,
    };
  });

  choices.unshift({
    value: 0,
    name: `${"0.".green} Cancel`,
  });

  const questions = [
    {
      type: "list",
      name: "option",
      message: "Choose a city",
      choices,
    },
  ];

  const { option } = await inquirer.prompt(questions);
  return option;
};

export const confirm = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);

  return ok;
};
