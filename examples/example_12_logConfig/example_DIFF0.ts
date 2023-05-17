import {service} from "./assembler";
import {hugeArgumentInterface} from "./services_DIFF1";

void (async function main() {
  try {
    // <diff
    service.login.secretArguments("secret");
    service.login.secretMethod();
    service.login.fatalMethod();
    service.login.hugeArgument(buildBigObject());
    // diff>
    await service.login.using({email: "email@gmail.com", password: "superman"});
  } catch (e) {
    console.log(e);
  }
})();

function buildBigObject(): hugeArgumentInterface {
  const bigObject = {};
  for (let i = 0; i < 100; i++) {
    bigObject[`prop${i}`] = i;
  }
  return bigObject as hugeArgumentInterface;
}
