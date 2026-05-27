"use strict";


// Compact Header
const header = document.getElementsByTagName("header")[0];
addEventListener("scroll", () => {
  header.classList.toggle("compact", pageYOffset > 0);
}, { passive: true });


// Table of Contents
const scope = "article >";
const headings = [...document.querySelectorAll(`${scope} :is(h2, h3`)];
const toc = document.getElementsByTagName("aside")[0];
let ul = document.createElement("ul");
let li;
let level = 0;
toc.append(ul);

for (const h of headings) {
  // Manage hierarchy
  const newLevel = getLevel(h.tagName);
  if (newLevel > level) {
    const newList = document.createElement("ul");
    li.append(newList);
    ul = newList;
  } else if (newLevel < level) {
    ul = ul.parentElement.parentElement;
  }
  level = newLevel;

  // Generate anchor
  if (h.id === "") h.id = generateID(h.textContent);
  const ha = document.createElement("a");
  ha.href = `#${h.id}`;
  ha.innerHTML = h.innerHTML;
  h.innerHTML = "";
  h.append(ha);

  // Create toc item
  li = document.createElement("li");
  const headingDate = h.dataset.date;
  if (headingDate && headingDate !== "") li.dataset.date = headingDate;
  const lia = document.createElement("a");
  lia.textContent = h.textContent;
  lia.href = `#${h.id}`;
  li.append(lia);
  ul.append(li);

  // Save link
  h.tocItem = li;
}

addEventListener("scroll", () => {
  const pageY = pageYOffset + innerHeight/3; // top third of viewport
  for (const h of headings) {
    const children = h.tocItem.querySelector("ul");
    const hasChildren = children !== null;
    const nextH = hasChildren ? getNextHeadingOfSameLevel(h) : getNextHeading(h);
    const selected = pageY > h.offsetTop && (!nextH || pageY < nextH.offsetTop);
    h.tocItem.classList.toggle("selected", selected);
    children?.classList.toggle("selected", selected);
  }
}, { passive: true });

function getLevel(tagName) {
  if (tagName === "H2") return 0;
  if (tagName === "H3") return 1;
}

function generateID(txt) {
  return txt.trim()
            .toLowerCase()
            .replace(/\s+/g, "-")             // convert spaces to -
            .normalize("NFD")                 // decompose to combining accents
            .replace(/[\u0300-\u036f]/g, ""); // remove accents
}

function getNextHeading(h) {
  const i = headings.indexOf(h);
  return headings[i+1];
}

function getNextHeadingOfSameLevel(h) {
  const tagName = h.tagName;
  const level = getLevel(tagName);
  const headingsOfSameLevel = [...document.querySelectorAll(`${scope} ${tagName}`)];
  const i = headingsOfSameLevel.indexOf(h);
  return headingsOfSameLevel[i+1];
}
