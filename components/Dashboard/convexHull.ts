export interface Point {
	x: number;
	y: number;
}
export interface AttachmentPoint {
	x: number;
	y: number;
    dist: number;
}


const sortPointsByX = (points: Point[]) => {
    return points.sort((a, b) => a.x - b.x);
}

const sortPointsByY = (points: Point[]) => {
    return points.sort((a, b) => a.y - b.y);
}

// absolute distance from rel
const sortPointsByXMagnitudeRelative = (points: Point[], rel: number) => {
    return points.sort((a, b) =>Math.abs(a.x - rel) - Math.abs(b.x - rel));
}

const sortByMagnitudeRelative = (points: number[], rel: number) => {
    return points.sort((a, b) =>Math.abs(a - rel) - Math.abs(b - rel));
}

const sortPointsByYMagnitudeRelative = (points: Point[], rel: number) => {
    return points.sort((a, b) => Math.abs(a.x - rel) - Math.abs(b.x - rel));
}

function sortByDistance(points: Point[], x0: number, y0: number): Point[] {
    return points.sort((a, b) => {
        let dA = (a.x - x0) ** 2 + (a.y - y0) ** 2;
        let dB = (b.x - x0) ** 2 + (b.y - y0) ** 2;
        return dA - dB;
    });
}


export const getRectilinearHull = (points: Point[], hullCenter: Point, concaveCache: AttachmentPoint[]) => {
    const xSortedPoints = sortPointsByX(points);

    let upper = [xSortedPoints[0]];
    let lower = [xSortedPoints[xSortedPoints.length - 1]];

    let prevY = xSortedPoints[0].y;

    let maxY: Point = xSortedPoints[0];
    let minY: Point = xSortedPoints[0];

    for (let i = 1; i < points.length; i++) {
        const point = xSortedPoints[i];

        const thresholdTop = maxY.y <= point.y ? maxY : point;

        if (point.y > prevY) {
          while (upper.length && upper[upper.length-1].y <= thresholdTop.y && upper[upper.length-1] !== thresholdTop) {
            upper.pop();
          }
        }
        upper.push(point);
        maxY = maxY.y >= point.y ? maxY : point;

        const thresholdBottom = minY.y >= point.y ? minY : point;
        if (point.y < prevY) {
          while (lower.length && lower[lower.length-1].y >= thresholdBottom.y && lower[lower.length-1] !== thresholdBottom) {
            lower.pop();
          }
        }
        lower.push(point);
        minY = minY.y <= point.y ? minY : point;

        prevY = point.y;
    }

    // get left and right hulls

    // let left: Point[] = [];
    // let right: Point[] = [];

    // for (let i = 0; i < upper.length; i++) {
    //     const point = upper[i];
    //     if (point.x <= maxY.x) left.push(point);
    //     if (point.x >= maxY.x) right.push(point);
    // }

    // for (let i = 1; i < lower.length - 1; i++) {
    //     const point = lower[i];
    //     if (point.x <= minY.x) left.push(point);
    //     if (point.x >= minY.x) right.push(point);
    // }

    // get concave vertices

    let concave: AttachmentPoint[] = [];
    let closestConcavePointUpper = { x: maxY.x, y: maxY.y, dist: Infinity };
    let closestConcavePointLower = { x: minY.x, y: minY.y, dist: Infinity };

    const getDistSquared = (x: number, y: number) => (x - hullCenter.x) ** 2 + (y - hullCenter.y) ** 2;

    for (let i = 1; i < upper.length - 1; i++) {
        const point = upper[i];
        let concavePoint;
        let cachedPoint = concaveCache[concave.length];
        if (cachedPoint && cachedPoint.x === point.x && cachedPoint.y === point.y) {
            concavePoint = cachedPoint;
            continue;
        }

        if (point.x < maxY.x) {
            concavePoint = { x: point.x, y: point.y, dist: getDistSquared(point.x, point.y) };
        } else {
            let next = upper[i+1]
            if (next.x === point.x) concavePoint = null;
            else concavePoint = { x: point.x, y: next.y, dist: getDistSquared(point.x, next.y) };
        }
        if (concavePoint !== null) {
            concave.push(concavePoint);
            closestConcavePointUpper = concavePoint.dist < closestConcavePointUpper.dist ? concavePoint : closestConcavePointUpper;
        }
    }

    for (let i = 1; i < lower.length - 1; i++) {
        const point = lower[i];
        let concavePoint;
        let cachedPoint = concaveCache[concave.length];
        if (cachedPoint && cachedPoint.x === point.x && cachedPoint.y === point.y) {
            concavePoint = cachedPoint;
            continue;
        }

        if (point.x > minY.x) {
            concavePoint = { x: point.x, y: point.y, dist: getDistSquared(point.x, point.y) };
        } else {
            let next = lower[i-1]
            if (next.x === point.x) concavePoint = null;
            else concavePoint = { x: point.x, y: next.y, dist: getDistSquared(point.x, next.y) };
        }
        if (concavePoint !== null) {
            concave.push(concavePoint);
            closestConcavePointLower = concavePoint.dist < closestConcavePointLower.dist ? concavePoint : closestConcavePointLower;
        }
    }

    return { points, upper, lower, concaveCache: concave, minY, maxY, closestConcavePointUpper, closestConcavePointLower };
}



export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Hull {
    upper: Point[];
    lower: Point[];
    points: Point[];
    minY: Point;
    maxY: Point;
    concaveCache: AttachmentPoint[];
    closestConcavePointUpper: AttachmentPoint;
    closestConcavePointLower: AttachmentPoint;
}

export const addRectToHull = (width: number, height: number, hull: Hull): Point => {
    const { upper, minY, maxY, closestConcavePointUpper, closestConcavePointLower } = hull;

    let rectPosition;
    let offset = 20;

    if (closestConcavePointUpper.dist < closestConcavePointLower.dist) {
        if (closestConcavePointUpper.x < maxY.x) rectPosition = { x: closestConcavePointUpper.x - width - offset, y: closestConcavePointUpper.y + height + offset};
        else rectPosition = { x: closestConcavePointUpper.x + offset, y: closestConcavePointUpper.y + height + offset};
    } else {
        if (closestConcavePointLower.x > minY.x) rectPosition = { x: closestConcavePointLower.x + offset, y: closestConcavePointLower.y - offset };
        else rectPosition = { x: closestConcavePointLower.x - width - offset, y: closestConcavePointLower.y - offset};
    }

    return rectPosition;
}

/* p5.js visualiser

function sortPointsByX(points) {
    return points.sort((a, b) => a.x - b.x);
}

function getRectilinearHull(points, hullCenter, concaveCache) {

    const xSortedPoints = sortPointsByX(points);

    let upper = [xSortedPoints[0]];
    let lower = [xSortedPoints[0]];

    let prevY = xSortedPoints[0].y;

    let maxY = xSortedPoints[0];
    let minY = xSortedPoints[0];

  let concave = [];

    let closestConcavePointUpper = { x: 0, y: 0, dist: Infinity };
    let closestConcavePointLower = { x: 0, y: 0, dist: Infinity };




    let i = 1;

    function nextStep() {


        if (i >= xSortedPoints.length) {
        closestConcavePointUpper = { x: maxY.x, y: maxY.y, dist: Infinity };
        closestConcavePointLower = { x: minY.x, y: minY.y, dist: Infinity };
          console.log('end')

    const getDistSquared = (x, y) => (x - hullCenter.x) ** 2 + (y - hullCenter.y) ** 2;
    for (let i = 1; i < upper.length - 1; i++) {
        const point = upper[i];

        let concavePoint;
        let cachedPoint = concaveCache[concave.length];
        if (cachedPoint && cachedPoint.x === point.x && cachedPoint.y === point.y) {
            concavePoint = cachedPoint;
            continue;
        }

        if (point.x < maxY.x) {
            concavePoint = { x: point.x, y: point.y, dist: getDistSquared(point.x, point.y) };
        } else {
            let y = upper[i+1].y
            concavePoint = { x: point.x, y, dist: getDistSquared(point.x, y) };
        }
        concave.push(concavePoint);
        closestConcavePointUpper = concavePoint.dist < closestConcavePointUpper.dist ? concavePoint : closestConcavePointUpper;
    }

    for (let i = 1; i < lower.length - 1; i++) {
        const point = lower[i];
        let concavePoint;
        let cachedPoint = concaveCache[concave.length];
        if (cachedPoint && cachedPoint.x === point.x && cachedPoint.y === point.y) {
            concavePoint = cachedPoint;
            continue;
        }

        if (point.x > minY.x) {
            concavePoint = { x: point.x, y: point.y, dist: getDistSquared(point.x, point.y) };
        } else {
            let y = lower[i-1].y
            concavePoint = { x: point.x, y, dist: getDistSquared(point.x, y) };
        }
        concave.push(concavePoint);
        closestConcavePointLower = concavePoint.dist < closestConcavePointLower.dist ? concavePoint : closestConcavePointLower;
    }

          rectPoint = addRectToHull(recta, { upper, lower, concaveCache: concave, minY, maxY, closestConcavePointUpper, closestConcavePointLower })
          console.log(closestConcavePointUpper, closestConcavePointLower)



          clearInterval(interval)
          return;
        }

                 const point = xSortedPoints[i];

        const thresholdTop = maxY.y <= point.y ? maxY : point;

        if (point.y > prevY) {
          while (upper.length && upper[upper.length-1].y <= thresholdTop.y && upper[upper.length-1] !== thresholdTop) {
            upper.pop();
          }
        }
        upper.push(point);
        maxY = maxY.y >= point.y ? maxY : point;

        const thresholdBottom = minY.y >= point.y ? minY : point;
        if (point.y < prevY) {
          while (lower.length && lower[lower.length-1].y >= thresholdBottom.y && lower[lower.length-1] !== thresholdBottom) {
            lower.pop();
          }
        }
        lower.push(point);
        minY = minY.y <= point.y ? minY : point;

        prevY = point.y;
      console.log("add", i)
        i++
    }

          console.log(concave)



    return { upper, lower, nextStep, concaveCache: concave, minY, maxY, closestConcavePointUpper, closestConcavePointLower };
}


const addRectToHull = (recta, hull) => {
    const { upper, minY, maxY, closestConcavePointUpper, closestConcavePointLower } = hull;
    const { x, y, width, height } = recta;

    let rectPosition;

    if (closestConcavePointUpper.dist < closestConcavePointLower.dist) {
        if (closestConcavePointUpper.x < maxY.x) rectPosition = { x: closestConcavePointUpper.x - width, y: closestConcavePointUpper.y + height };
        else rectPosition = { x: closestConcavePointUpper.x, y: closestConcavePointUpper.y + height };
    } else {
        if (closestConcavePointLower.x > minY.x) rectPosition = { x: closestConcavePointLower.x, y: closestConcavePointLower.y };
        else rectPosition = { x: closestConcavePointLower.x - width, y: closestConcavePointLower.y };
    }
    return rectPosition;
}


let minX;
let maxX
let points = [];
let hullTop = [];
let hullBottom = [];
let concave= [];
let hullSteps;
let interval;
let center = { x: 1, y: 1 };
let recta = { x: 0, y: 0, width: 100, height: 100};
    let closestConcavePointUpper = { x: 10, y: 10, dist: Infinity };
    let closestConcavePointLower = { x: 10, y: 10, dist: Infinity };
let rectPoint = { x: 1, y: 1 };


function setup() {
    createCanvas(600, 600);
  center = { x: random(width), y: random(height) }
  // center = { x: 127.5, y: 113.5 }
    for (let i = 0; i < 20; i++) {
        points.push({ x: random(width), y: random(height) });
    }

    // points.push({x: -20 + 100, y: -20+ 100}, {x: 0+100, y: 0+100}, {x:0+100, y:0+100}, {x:0+100, y:-50+100}, {x: 50+100, y: 0+100}, {x:55+100, y:27+100}, {x:250+100, y:0+100},  {x:50+100, y:-100+100})
    hullSteps = getRectilinearHull(points, center, []);
    interval = setInterval(() => {
        hullSteps.nextStep();
        hullTop = [...hullSteps.upper];
        hullBottom = [...hullSteps.lower];
        concave = [...hullSteps.concaveCache];
        closestConcavePointUpper = hullSteps.closestConcavePointUpper;
        closestConcavePointLower = hullSteps.closestConcavePointLower;
    }, 50);
}

function draw() {
    translate(0, height);
    scale(1, -1);
    background(220);

    // Draw points
    fill(0);
    noStroke();
    for (let p of points) {
        ellipse(p.x, p.y, 6, 6);
    }

    // Draw top hull
    noFill();
    stroke(0, 0, 255);
    strokeWeight(2);
    beginShape();
    for (let p of hullTop) {
        vertex(p.x, p.y);
    }
    endShape();

    // Draw bottom hull
    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    beginShape();
    for (let p of hullBottom) {
        vertex(p.x, p.y);
    }
    endShape();

      // Draw points
    fill("red");
    noStroke();
    for (let p of concave) {
        ellipse(p.x, p.y, 14, 14);
    }

      fill("yellow");
    noStroke();
    ellipse(center.x, center.y, 12, 12);

    fill("green");
    noStroke();
    ellipse(closestConcavePointLower.x, closestConcavePointLower.y, 10, 10);



      fill("purple");
    noStroke();
    ellipse(closestConcavePointUpper.x, closestConcavePointUpper.y, 10, 10);


        fill("pink");
    noStroke();
    ellipse(rectPoint.x, rectPoint.y,8, 8);
  rect(rectPoint.x, rectPoint.y - recta.height, recta.width, recta.height);

}

*/