document.addEventListener("DOMContentLoaded", function () {
    // Get the canvas element and its 2d context
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Load the graph image onto the canvas
    var graphImage = new Image();
    graphImage.src = "./img/graph.png";

    graphImage.onload = function () {
        // Set the canvas size to match the image size
        canvas.width = graphImage.width;
        canvas.height = graphImage.height;

        // Draw the graph image on the canvas
        ctx.drawImage(graphImage, 0, 0, graphImage.width, graphImage.height);

        // Add a click event listener to the canvas
        canvas.addEventListener("click", function (event) {
            // Get the color of the clicked pixel
            var x = event.clientX - canvas.getBoundingClientRect().left;
            var y = event.clientY - canvas.getBoundingClientRect().top;
            var pixel = ctx.getImageData(x, y, 1, 1).data;

            // Generate a point based on the selected color
            var point = {
                x: x,
                y: y,
                color: "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")",
            };

            // Log the generated point to the console (you can do anything you want with this point)
            console.log("Selected Point:", point);

            // Follow the same color path and add red dots along the graph
            followColorPath(x, y, pixel[0], pixel[1], pixel[2]);
        });
    };

    // Function to follow the same color path and add red dots along the graph
    function followColorPath(startX, startY, targetR, targetG, targetB) {
        // Set a threshold for color matching (adjust as needed)
        var colorThreshold = 30;

        // Loop through the canvas pixels to find the same color path
        for (var i = 0; i < canvas.width; i++) {
            for (var j = 0; j < canvas.height; j++) {
                var currentPixel = ctx.getImageData(i, j, 1, 1).data;

                // Check if the current pixel color is close to the target color
                if (
                    Math.abs(currentPixel[0] - targetR) < colorThreshold &&
                    Math.abs(currentPixel[1] - targetG) < colorThreshold &&
                    Math.abs(currentPixel[2] - targetB) < colorThreshold
                ) {
                    // Add a red dot at the found position
                    ctx.fillStyle = "red";
                    ctx.fillRect(i, j, 2, 2); // Adjust the size of the red dot as needed

                }
            }
        }
    }


});