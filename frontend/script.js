document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  const uploadInput = document.getElementById("upload-input");
  const recommendBtn = document.getElementById("recommend-btn");
  const resultContainer = document.getElementById("result-container");

  let selectedFile = null;

  uploadInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    if (!selectedFile) return;
    console.log("Image selected:", selectedFile.name);
  });

  recommendBtn.addEventListener("click", () => {
    if (!selectedFile) {
      alert("Please upload a dress image first.");
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = URL.createObjectURL(selectedFile);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const [r, g, b] = getAverageColor(imageData.data);
      const color = classifyColor(r, g, b);
      console.log("Detected color:", color);

      fetch("https://dress-accessory-app.onrender.com/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color })
      })
        .then(res => res.json())
        .then(data => {
          console.log("Received:", data);
          resultContainer.innerHTML = "";
          if (!data.length) {
            resultContainer.innerHTML = "<p>No matches found.</p>";
            return;
          }
          data.forEach(item => {
            const div = document.createElement("div");
            div.className = "recommendation";
            div.innerHTML = `
              <h3>${item.name}</h3>
              <img src="${item.image}" alt="${item.name}" width="200" style="border-radius: 10px;">
              <p style="font-size: 0.9rem; color: #555;">${item.description}</p>
            `;
            resultContainer.appendChild(div);
          });
        })
        .catch(err => {
          console.error("Fetch error:", err);
          resultContainer.innerHTML = "<p>Something went wrong.</p>";
        });
    };
  });

  function getAverageColor(data) {
  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    // Ignore very bright (white-ish) pixels
    if (red > 240 && green > 240 && blue > 240) continue;

    r += red;
    g += green;
    b += blue;
    count++;
  }

  // Fallback if all pixels were white
  if (count === 0) return [255, 255, 255];

  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}


  function classifyColor(r, g, b) {
    if (r > 200 && g < 100 && b < 100) return "red";
    if (r > 240 && g > 200 && b < 100) return "orange";
    if (r > 240 && g > 240 && b < 120) return "yellow";
    if (r < 100 && g > 160 && b < 100) return "green";
    if (r < 100 && g < 100 && b > 180) return "blue";
    if (r > 180 && b > 180 && g < 140) return "pink";
    if (r > 200 && g < 160 && b > 200) return "magenta";
    if (r > 220 && g > 220 && b > 220) return "white";
    if (r < 50 && g < 50 && b < 50) return "black";
    if (r > 140 && g > 110 && b > 80) return "beige";
    if (r > 100 && g > 60 && b < 50) return "brown";
    if (r > 160 && g > 100 && b > 160) return "purple";
    return "neutral";
  }
});
