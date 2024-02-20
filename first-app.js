// const fs = require("fs");

// let arr = ["kush", "jasa"];

// console.log(arr.map((arr) => "name:" + arr));

// let newarr = [...arr];
// console.log(newarr);

// const toarr = (...args) => {
//   return args;
// };

// console.log(toarr(1, 2, 3, 4));

// const person = {
//     name:'kush',
//     age:22,
//     intro(){
//         return('this is'+this.name);
//     }
// };

// const printname=({name})=>{
//     console.log(name);
// }
// (printname(person))

// const{name,age}=person;
// console.log(name,age);

console.log("hello2");

const fetchdata = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("done");
    }, 1500);
  });
  return promise;
};

setTimeout(() => {
  console.log("hello");
  fetchdata()
    .then(text=>{
        console.log(text);
        return fetchdata();
    })
    .then(text2=>{
        console.log(text2);
    });
}, 2000);
