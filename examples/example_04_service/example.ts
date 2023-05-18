import {service} from "./assembler_DIFF1";

void (async function main() {
  try {
    await service.login.using({email: "email@gmail.com", password: "superman"});
  } catch (e) {
    console.log(e);
  }
})();
