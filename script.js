/*
    Joint effort by Luke and Levi
*/

// add listener to submit on the form
document.querySelector("form").addEventListener("submit", (event) => {
  // stop page from refreshing
  event.preventDefault();

  // clear past results
  document.querySelector("#card-container").innerHTML = "";

  // find new results
  doSearch();
});


function buildQuery() {
// get all the form data
const formElements = [
document.querySelector("#location"), 
document.querySelector("#description"), 
document.querySelector("#fulltime"), 
document.querySelector("#parttime"), 
document.querySelector("#remote") ]

// configure the search parameters

const searchBuilder = [];
  if (formElements[0].value !== "") {
    searchBuilder.push("location=" + formElements[0].value);
  } 

  if (formElements[1].value !== "") {
    searchBuilder.push("description=" + formElements[1].value);
  }
  /*
    possibliities
    fulltime   parttime    result
    true        true        full_time=false
    true        false       full_time = true
    false       true        full_time=false
    false       false       full_time = false
  */
   if (formElements[2].checked && !formElements[3].checked) { // fulltime checked
      searchBuilder.push("full_time=true");
  }

   if (formElements[4].checked) {
    searchBuilder.push("location=remote");
  }
  
return searchBuilder.join("&");

}

function doSearch() {
  // set constants for search query
  const urlStart = "https://jobs.github.com/positions.json?";
  const searchQuery = buildQuery();

  

  // fetch the postings
fetch(`${urlStart}${searchQuery}`) /////////////////////////////////////////////////////////////////////// build search query
    .then((response) => response.json())
    .then((data) => processResults(data));
}

function processResults(data) {
  // filter out by time choices -done

  // get the card container -done
  const container = document.querySelector("#card-container");

  // add cards to container div
  data.forEach((element) => {
    let newCard = makeCard(element);
    container.appendChild(newCard);
  });
}

// make card for job posting
/*
    company logo
    job title
    job descirption <= 100 characters
    how to apply info
    button for job details (link to somewhere else)
    */
function makeCard(job) {
  const card = document.createElement("div");
  card.setAttribute("class", "card");

  const img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.setAttribute("alt", "Job Logo"); 
  img.setAttribute("src", job.company_logo);

  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  const title = document.createElement("h5");
  title.setAttribute("class", "card-title");
  title.innerHTML = job.title;
  const description = document.createElement("p");
  description.setAttribute("class", "card-text");
  description.innerHTML = job.description.slice(0,100) + "...";

  const applyInfo = document.createElement("button");
  applyInfo.setAttribute("class", "btn btn-primary"); 
  let urlSlice = job.how_to_apply.split("\"")[1];
  applyInfo.innerHTML = `<a href=${urlSlice}>How to Apply</a>`;

  const moreInfo = document.createElement("button");
  moreInfo.setAttribute("class", "btn btn-primary");
  moreInfo.innerHTML = `<a href=${job.url}>More Info</a>`

  // cardBody.appendChild(title);
  // cardBody.appendChild(description);
  // cardBody.appendChild(applyInfo);
  // cardBody.appendChild(moreInfo);
  cardBody.append(title, description, applyInfo, moreInfo);

  card.appendChild(img);
  card.appendChild(cardBody);

  return card;
}
