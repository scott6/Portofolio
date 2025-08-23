const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');

const aspectRatios = [
  { label: '1:3', value: 1 / 3 },
  { label: '2:3', value: 2 / 3 },
  { label: '2:2', value: 1 },
  { label: '3:2', value: 3 / 2 },
  { label: '3:1', value: 3 }
];

function getClosestRatio(width, height) {
  const ratio = width / height;
  let closest = aspectRatios[0];

  for (const ar of aspectRatios) {
    if (Math.abs(ar.value - ratio) < Math.abs(closest.value - ratio)) {
      closest = ar;
    }
  }

  return closest.label;
}

function transformImageData(data, imageFolder = './images') {
  return data.map(entry => ({
    projects: entry.projects.map(project => ({
      ...project,
      images: project.images.map(imageName => {
        const imagePath = path.join(imageFolder, imageName);
        const { width, height } = sizeOf(imagePath);
        return {
          name: imageName,
          width,
          height,
          closestRatio: getClosestRatio(width, height)
        };
      })
    }))
  }));
}
