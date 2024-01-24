// Flags
var isFollowColorPathSelected = false;
var isMarkerSelected = false;
var isCalibarated = false;
var imageInput = document.getElementById("imageInput");
var graphImage = new Image();
graphImage.src = "./img/graph.png";
var drawing = false;
var drawnPoints = [];


// Get the canvas element and its 2d context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Load the graph image onto the canvas

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


        updateAdjustment(point)

        // Log the generated point to the console (you can do anything you want with this point)
        console.log("Selected Point:", point);
    });
};

// Set Points and Add store it
function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
}


function draw(points) {
    // Reset The canvase

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(graphImage, 0, 0, graphImage.width, graphImage.height);

    // Draw points

    points.forEach(point => {
        drawPoint(point.x, point.y);
    });



}

// Select the point and Store it

canvas.addEventListener("mousedown", function (event) {
    if (!isMarkerSelected) return;
    drawing = true;
    var point = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top
    };
    if (drawing) {
        drawnPoints.push(point);
        draw(drawnPoints);
    }
});



canvas.addEventListener("mouseup", function () {
    drawing = false;
});



// Shotcuts 
document.addEventListener('keydown', function (event) {
    // ctr+z to remove last marked point
    if (event.ctrlKey && event.key === 'z') {
        if (drawnPoints.length > 0) {
            drawnPoints.pop()
            draw(drawnPoints)


        }
    }
});



// Other functions
const randomColor = () => {
    return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
}

function handleSelect() {
    var radioButtons = document.getElementsByName("option");
    radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener("change", function () {
            // Get the value of the selected radio button
            const option = document.querySelector('input[name="option"]:checked').value;
            if (option === 'selectColor') {
                isFollowColorPathSelected = true;
                isMarkerSelected = false
            } else {
                isFollowColorPathSelected = false
                isMarkerSelected = true
            }
        });
    });


}

// Adjust Points
let isAdjusting = false;
const adjustPoints = ['xmax', 'xmin', 'ymax', 'ymin']
let isAdjustPointSelected = false;
let selectedId = ''

// draw point in canvas in rectangle shape
const pointSize = 200; // Adjust this value if needed

const points = {
    xmax: { x: canvas.width / 2 + 50, y: canvas.height / 2 },
    ymax: { x: canvas.width / 2, y: canvas.height / 2 - 50 },
    xmin: { x: canvas.width / 2 - 50, y: canvas.height / 2 },
    ymin: { x: canvas.width / 2, y: canvas.height / 2 + 50 },
};

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw points
    for (let point in points) {
        const element = document.getElementById(point);
        element.style.left = points[point].x - pointSize / 2 + "px";
        element.style.top = points[point].y - pointSize / 2 + "px";
    }
}


drawPoints();


// Handeling Events

adjustPoints.forEach((singlePoint) => {
    document.getElementById(singlePoint).addEventListener('click', function (e) {
        if (isAdjustPointSelected) return;
        selectedId = e.srcElement.id;
        isAdjustPointSelected = true;
        document.getElementById(selectedId).style.backgroundColor = "green"
    })
})



function updateAdjustment(mousePosition) {
    if (isAdjustPointSelected && !isMarkerSelected) {
        const selectedElem = document.getElementById(selectedId);
        // Set the new position for the selected adjustment point
        selectedElem.style.left = mousePosition.x - selectedElem.clientWidth / 2 + "px";
        selectedElem.style.top = mousePosition.y - selectedElem.clientHeight / 2 + "px";
        console.log(selectedElem)

        // Reset styles and flags
        document.getElementById(selectedId).style.backgroundColor = "red";
        isAdjustPointSelected = false;
        selectedId = '';
        updateMaxMinPosition()
    }
}

function toggleMarker() {
    const elem = document.getElementById('marker')
    if (isMarkerSelected) {
        isMarkerSelected = false;
        elem.style.backgroundColor = 'red'
    } else {
        isMarkerSelected = true;
        elem.style.backgroundColor = 'green'

    }
}


const adjustedPointPosition = {
    xmin: {
        position: -1,
        value: -4,
    },
    ymin: {
        position: -1,
        value: 0,
    },
    xmax: {
        position: -1,
        value: 4,
    },
    ymax: {
        position: -1,
        value: 10,
    }
}
function updateMaxMinPosition() {
    adjustPoints.forEach((singlePoint) => {
        const element = document.getElementById(singlePoint);
        const rect = element.getBoundingClientRect();

        adjustedPointPosition[singlePoint].position = rect[singlePoint === 'xmin' || singlePoint === 'xmax' ? 'left' : 'top'];

    });

}

function calculateData() {
    const data = normalizePoints(drawnPoints, adjustedPointPosition)
    const csvContent = "x,y\n" + data.map(point => `${point.x},${point.y}`).join("\n");
    console.log(csvContent)

}


function normalizePoints(points, minMax) {
    const normalizedPoints = [];

    points.forEach((point) => {
        const normalizedX = normalizeValue(point.x, minMax.xmin.position, minMax.xmax.position, minMax.xmin.value, minMax.xmax.value);
        const normalizedY = normalizeValue(point.y, minMax.ymin.position, minMax.ymax.position, minMax.ymin.value, minMax.ymax.value);

        normalizedPoints.push({ x: normalizedX, y: normalizedY });
    });

    return normalizedPoints;
}

function normalizeValue(value, minPosition, maxPosition, minValue, maxValue) {
    const normalizedValue = (value - minPosition) / (maxPosition - minPosition) * (maxValue - minValue) + minValue;
    return normalizedValue;
}




function setCoordinateValue() {
    const xmin = document.getElementById("xminInput").value;
    const ymin = document.getElementById("yminInput").value;
    const xmax = document.getElementById("xmaxInput").value;
    const ymax = document.getElementById("ymaxInput").value;


    // Update adjustedPointPosition values
    adjustedPointPosition.xmin.value = Number(xmin);
    adjustedPointPosition.ymin.value = Number(ymin);
    adjustedPointPosition.xmax.value = Number(xmax);
    adjustedPointPosition.ymax.value = Number(ymax);
    console.log(adjustedPointPosition)
}