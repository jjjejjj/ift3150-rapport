"use strict";

const datedElements = document.querySelectorAll("[data-date]");

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

for (const el of datedElements) {
  const rawDate = el.dataset.date;
  if (!rawDate) continue;

  const dateParts = rawDate.split(":");

  if (dateParts.length !== 2) console.error(`Attribute "data-date" must be of format "AAAA-MM-DD:AAAA-MM-DD". "${rawDate}" was read.`, el);

  let [from, to] = dateParts.map(d => { return new Date(d) });
  from = from.getTime();
  to = to.getTime();

  if (from > to) throw new RangeError("Start date of range must be before end date.");

  if (to < today)        el.classList.add("passed");
  else if (from > today) el.classList.add("future");
  else                   el.classList.add("active");
}
