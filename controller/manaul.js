const saltedMd5 = require("salted-md5");
const randomstring = require("randomstring");

let randomString = randomstring.generate({ length: 8 });
let saltedHashPassword = saltedMd5(randomString, "tester123");

console.log(randomString);
console.log(saltedHashPassword);
