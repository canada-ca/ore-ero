/* exported getToday */

function getToday() {
  let d = new Date();

  let month = d.getMonth() + 1;
  let day = d.getDate();

  return (
    d.getFullYear() +
    '-' +
    (month < 10 ? '0' : '') +
    month +
    '-' +
    (day < 10 ? '0' : '') +
    day
  );
}

window.date_func = {
  getToday
};
