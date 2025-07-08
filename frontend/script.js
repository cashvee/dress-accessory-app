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
      const [r, g, b] = getDominantColor(imageData.data);
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

  function getDominantColor(data) {
    const counts = {};
    for (let i = 0; i < data.length; i += 4) {
      const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    const dominant = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    return dominant.split(",").map(Number);
  }

  function classifyColor(r, g, b) {
    if (r > 200 && g < 100 && b < 100) return "red";
    if (r > 200 && g > 150 && b < 100) return "orange";
    if (r > 200 && g > 200 && b < 100) return "yellow";
    if (g > 150 && r < 100 && b < 100) return "green";
    if (b > 150 && r < 100 && g < 100) return "blue";
    if (r > 200 && b > 200 && g < 150) return "pink";
    if (r > 240 && g > 240 && b > 240) return "white";
    if (r < 50 && g < 50 && b < 50) return "black";
    return "neutral";
  }
});
