var magnifier = document.getElementById("magnifier");
var magnifierSize = 100; // Adjust the size of the magnifier as needed

canvas.addEventListener("mousemove", function (event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;

    var pixel = ctx.getImageData(x, y, 1, 1).data;

    // Update the magnifier position and color
    updateMagnifier(x, y, pixel[0], pixel[1], pixel[2]);
});

function updateMagnifier(x, y, r, g, b) {
    // Update the magnifier position
    magnifier.style.position = "absolute"
    magnifier.style.left = x + 20 + "px";
    magnifier.style.top = y + 20 + "px";

    // Set the magnifier content to display the color information
    //magnifier.innerHTML = `Color: RGB(${r}, ${g}, ${b})`;

    // Show the magnifier and update its background color
    magnifier.style.display = "block";
    magnifier.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Optionally, you can adjust the size of the magnifier based on the pixel color
    magnifier.style.width = magnifierSize + "px";
    magnifier.style.height = magnifierSize + "px";
}

canvas.addEventListener("mouseout", function () {
    // Hide the magnifier when the mouse is not over the canvas
    magnifier.style.display = "none";
});

