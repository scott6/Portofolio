function getClosestAspectRatio(width, height) {
  const inputRatio = width / height;
  const aspectRatios = [
    { label: "1:3", value: 1 / 3, w:1, h:3 },
    { label: "2:3", value: 2 / 3, w:2, h:3 },
    { label: "2:2", value: 1, w:2, h:2 },
    { label: "3:2", value: 3 / 2, w:3, h:2 },
    { label: "3:1", value: 3 / 1, w:3, h:1 }
  ];

  let closest = aspectRatios[0];
  let smallestDiff = Math.abs(inputRatio - closest.value);

  for (let i = 1; i < aspectRatios.length; i++) {
    const diff = Math.abs(inputRatio - aspectRatios[i].value);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = aspectRatios[i];
    }
  }
  return closest;
}

function initPage(){
  // fetch portofolio.json file
  fetch('portofolio.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // process the JSON data
      for(var item of data) {
        // generate element
        var li = document.createElement('li');
        li.className = 'portfolio-item '+item;
      }
    })
    .catch(error => {
      console.error('Error fetching portofolio.json:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPage();
});
