import {service} from "./assembler";

void (async function main() {
  try {
    console.dir(
      {functionProp: service.login.using["funcProp"]},
      {depth: 10, colors: true},
    );
    await service.login.using({email: "email@gmail.com", password: "superman"});
  } catch (e) {
    console.log(e);
  }
})();
