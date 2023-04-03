const today = new Date();
const memberBD = new Date('birthdate');
const month = today.getMonth() - memberBD.getMonth();
let age = today.getFullYear() - memberBD.getFullYear();

/*
    ? If the current month is less than the birth month, 
    ? or if the current month is the same as the birth month but 
    ? the current day is less than the birth day, then 
    ? we need to subtract 1 from the age.
*/
if (month < 0 || (month === 0 && today.getDate() < memberBD.getDate())) { age--; }

const ageOutput = document.createElement('span');
ageOutput.classList.add('member-details--age');
ageOutput.append(`(${age})`);
document.querySelector('.member-details--born').append(ageOutput);