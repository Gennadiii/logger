import {service} from "./assembler";

void (async function main() {
  try {
    await service.login.using({email: "email@gmail.com", password: "superman"});
  } catch (e) {
    console.log(e);
  }
})();
