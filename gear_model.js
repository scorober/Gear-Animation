//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
const vertices = [];
const colors = [];
const normals = [];
const mat = new Learn_webgl_matrix();
const vec4 = new Learn_webgl_point4();
const vec3 = new Learn_webgl_vector3();


const defaultColors = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
const blue = [0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078]
const pink = [1, .443137, 0.807843, 1, .443137, 0.807843, 1, .443137, 0.807843]
const testColors = [0.019608, 1, 0.631373, 0.019608, 1, 0.631373, 0.019608, 1, 0.631373]
const negNormal = [0, 0, -1]
const posNormal = [0, 0, 1]

const n = 54;
const rad = 1.0;
const outRad = rad * 1.1;
const angInc = 2 * 3.14159 / n;
var ang = 0;
var z = 0.1;
var i; //  coin face, front & back
const tRad = rad * 1.15
const tStepIn = 0.05
const cStart = 0.32
const cEnd = 0.42
const ringStart = 0.9

// const aDiv = 4


function createGear() {
    // Making gear triangles
    var drawTooth = false

    for (i = 0; i < n; i++) {
        drawTooth = !drawTooth
        createOuterRing()
        createInnerRing()
        if (drawTooth) {
            var rotateMat = mat.create()
            mat.rotate(rotateMat, mat.toDegrees(ang + angInc), 0, 0, 1)
            drawGearTooth()
            createSpoke(rotateMat)
        } else {
            drawCoinEdge()
        }
        ang += angInc;
    }
    return [vertices, colors, normals]
}

function createTriangle(v1, v2, v3) {
    return {
        normals: calcNormal(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]),
        vertices: [v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]]
    }
}

function pushTriangle(tv, n, col) {
    vertices.push(
        tv.vertices[0], tv.vertices[1], tv.vertices[2],
        tv.vertices[3], tv.vertices[4], tv.vertices[5],
        tv.vertices[6], tv.vertices[7], tv.vertices[8]
    )
    normals.push(
        n[0], n[1], n[2],
        n[0], n[1], n[2],
        n[0], n[1], n[2]
    )
    colors.push(
        col[0], col[1], col[2],
        col[3], col[4], col[5],
        col[6], col[7], col[8]
    )
}

function calcNormal(x1, y1, z1,
    x2, y2, z2,
    x3, y3, z3) {

    var ux = x2 - x1,
        uy = y2 - y1,
        uz = z2 - z1;
    var vx = x3 - x1,
        vy = y3 - y1,
        vz = z3 - z1;

    return [uy * vz - uz * vy,
        uz * vx - ux * vz,
        ux * vy - uy * vx
    ];
}

function calcNormalFromVec(v1, v2, v3) {
    var x1 = v1[0]
    var y1 = v1[1]
    var z1 = v1[2]
    var x2 = v2[0]
    var y2 = v2[1]
    var z2 = v2[2]
    var x3 = v3[0]
    var y3 = v3[1]
    var z3 = v3[2]

    var ux = x2 - x1,
        uy = y2 - y1,
        uz = z2 - z1;
    var vx = x3 - x1,
        vy = y3 - y1,
        vz = z3 - z1;

    return [uy * vz - uz * vy,
        uz * vx - ux * vz,
        ux * vy - uy * vx
    ];
}

function createOuterRing() {

    var rotateMat = mat.create();
    var rotateRingInner = mat.create();
    //Matrix to rotate front to back.
    mat.rotate(rotateMat, 180, 0, 1, 0);
    mat.rotate(rotateRingInner, 180, 0, 0, 1)

    var v1 = vec4.create(ringStart * rad * Math.cos(ang), ringStart * rad * Math.sin(ang), z);
    var v2 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), z);
    var v3 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z);

    var v4 = vec4.create(ringStart * rad * Math.cos(ang - angInc), ringStart * rad * Math.sin(ang - angInc), z);
    var v5 = vec4.create(ringStart * rad * Math.cos(ang), ringStart * rad * Math.sin(ang), z);
    var v6 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), z);

    var v7 = vec4.create(ringStart * rad * Math.cos(ang), ringStart * rad * Math.sin(ang), z);
    var v8 = vec4.create(ringStart * rad * Math.cos(ang), ringStart * rad * Math.sin(ang), -z);
    var v9 = vec4.create(ringStart * rad * Math.cos(ang + angInc), ringStart * rad * Math.sin(ang + angInc), z)

    var i1 = vec4.create(ringStart * rad * Math.cos(ang), ringStart * rad * Math.sin(ang), -z);
    var i2 = vec4.create(ringStart * rad * Math.cos(ang + angInc), ringStart * rad * Math.sin(ang + angInc), z);
    var i3 = vec4.create(ringStart * rad * Math.cos(ang + angInc), ringStart * rad * Math.sin(ang + angInc), -z);


    var norm0 = calcNormalFromVec(v1, v2, v3)
    var norm1 = calcNormalFromVec(v6, v5, v4)

    var iNorm = [ringStart * rad * Math.cos(ang), ringStart * rad * Math.sin(ang), 0]

    pushTriangle(createTriangle(v1, v2, v3), norm0, pink)
    pushTriangle(createTriangle(v4, v5, v6), norm1, pink)
    pushTriangle(createTriangle(v7, v8, v9), iNorm, pink)
    pushTriangle(createTriangle(i1, i2, i3), iNorm, pink)

    //Rotate and create reverse side.
    var newV1 = vec4.create();
    mat.multiplyP4(newV1, rotateMat, v1);
    var newV2 = vec4.create();
    mat.multiplyP4(newV2, rotateMat, v2);
    var newV3 = vec4.create();
    mat.multiplyP4(newV3, rotateMat, v3);

    var newV4 = vec4.create()
    mat.multiplyP4(newV4, rotateMat, v4)
    var newV5 = vec4.create()
    mat.multiplyP4(newV5, rotateMat, v5)
    var newV6 = vec4.create()
    mat.multiplyP4(newV6, rotateMat, v6)

    pushTriangle(createTriangle(newV1, newV2, newV3), negNormal, pink)
    pushTriangle(createTriangle(newV4, newV5, newV6), negNormal, pink)

}

function createInnerRing() {

    var rotateMat = mat.create();
    var rotateRingInner = mat.create();
    //Matrix to rotate front to back.
    mat.rotate(rotateMat, 180, 0, 1, 0);
    mat.rotate(rotateRingInner, 180, 0, 0, 1)

    var c1 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
    var c2 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);
    var c3 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), z);

    var c4 = vec4.create(cStart * rad * Math.cos(ang - angInc), cStart * rad * Math.sin(ang - angInc), z);
    var c5 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
    var c6 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);


    pushTriangle(createTriangle(c1, c2, c3), posNormal, blue)
    pushTriangle(createTriangle(c4, c5, c6), posNormal, blue)

    //Rotate and create reverse side.
    var newC1 = vec4.create();
    mat.multiplyP4(newC1, rotateMat, c1);
    var newC2 = vec4.create();
    mat.multiplyP4(newC2, rotateMat, c2);
    var newC3 = vec4.create();
    mat.multiplyP4(newC3, rotateMat, c3);

    var newC4 = vec4.create()
    mat.multiplyP4(newC4, rotateMat, c4)
    var newC5 = vec4.create()
    mat.multiplyP4(newC5, rotateMat, c5)
    var newC6 = vec4.create()
    mat.multiplyP4(newC6, rotateMat, c6)

    pushTriangle(createTriangle(newC1, newC2, newC3), negNormal, blue)
    pushTriangle(createTriangle(newC4, newC5, newC6), negNormal, blue)

    var j1 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
    var j2 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), -z);
    var j3 = vec4.create(cStart * rad * Math.cos(ang + angInc), cStart * rad * Math.sin(ang + angInc), z);

    var j4 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), -z);
    var j5 = vec4.create(cStart * rad * Math.cos(ang + angInc), cStart * rad * Math.sin(ang + angInc), z);
    var j6 = vec4.create(cStart * rad * Math.cos(ang + angInc), cStart * rad * Math.sin(ang + angInc), -z);

    var jNorm = [cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), 0]

    pushTriangle(createTriangle(j1, j2, j3), jNorm, blue)
    pushTriangle(createTriangle(j4, j5, j6), jNorm, blue)

    var j7 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);
    var j8 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), -z);
    var j9 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), z);

    var j10 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), -z);
    var j11 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), z);
    var j12 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), -z);

    jNorm = [cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), 0]

    pushTriangle(createTriangle(j7, j8, j9), jNorm, blue)
    pushTriangle(createTriangle(j10, j11, j12), jNorm, blue)

}

function drawCoinEdge() {
    var v1 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    var v2 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z)
    var v3 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z)

    var v4 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    var v5 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z)
    var v6 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), z)

    var norm0 = calcNormalFromVec(v1, v2, v3)
    var norm1 = calcNormalFromVec(v4, v5, v6)

    pushTriangle(createTriangle(v1, v2, v3), norm0, pink)
    pushTriangle(createTriangle(v4, v5, v6), norm1, pink)
}

function drawToothRoof() {
    var norm = [outRad * Math.cos(ang + angInc / 2), outRad * Math.sin(ang + angInc / 2), 0];
    var v1 = vec4.create(outRad * Math.cos(ang), outRad * Math.sin(ang), -z)
    var v2 = vec4.create(outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z)
    var v3 = vec4.create(outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z)
    //XYZ of center of tooth roof


    var v4 = vec4.create(outRad * Math.cos(ang), outRad * Math.sin(ang), -z)
    var v5 = vec4.create(outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z)
    var v6 = vec4.create(outRad * Math.cos(ang), outRad * Math.sin(ang), z)

    pushTriangle(createTriangle(v1, v2, v3), norm, defaultColors)
    pushTriangle(createTriangle(v4, v5, v6), norm, defaultColors)

}


function createSpoke(rotateMat) {
    var steps = 180
    var angle = 0
    var aStep = 2 * Math.PI / steps

    var midY = ringStart - cEnd - 0.1

    for (var j = 0; j < steps; j++) {
        var v1 = vec4.create(.05 * Math.cos(angle), cEnd - .1, .05 * Math.sin(angle))
        var v2 = vec4.create(.05 * Math.cos(angle + aStep), cEnd -.1, .05 *   Math.sin(angle + aStep))
        var v3 = vec4.create(.05 * Math.cos(angle + aStep), ringStart, .05 *  Math.sin(angle + aStep))

        var v4 = vec4.create(.05 * Math.cos(angle), cEnd - .1, .05 * Math.sin(angle))
        var v5 = vec4.create(.05 * Math.cos(angle + aStep), ringStart, .05 *   Math.sin(angle + aStep))
        var v6 = vec4.create(.05 * Math.cos(angle), ringStart, .05 *  Math.sin(angle))

        var newV1 = vec4.create();
        mat.multiplyP4(newV1, rotateMat, v1)
        var newV2 = vec4.create();
        mat.multiplyP4(newV2, rotateMat, v2)
        var newV3 = vec4.create();
        mat.multiplyP4(newV3, rotateMat, v3)
        var newV4 = vec4.create();
        mat.multiplyP4(newV4, rotateMat, v4)
        var newV5 = vec4.create();
        mat.multiplyP4(newV5, rotateMat, v5)
        var newV6 = vec4.create();
        mat.multiplyP4(newV6, rotateMat, v6)

        var norm0 = calcNormalFromVec(newV1, newV2, newV3)
        var norm1 = calcNormalFromVec(newV4, newV5, newV6)


        //TODO MOVE COLORS!!!!!!!!!!!!!!!!!!!!!!!!!
        //v1 and v2 are start, v3 end
        //v4 start, v5/v6 end  blue = start, pink = end
        var pink = [1, .443137, 0.807843]
        var blue = [0.004878, .803922, 0.996078]

        var col1 = [0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078, 1, .443137, 0.807843]
        var col2 = [0.004878, .803922, 0.996078, 1, .443137, 0.807843, 1, .443137, 0.807843]

        pushTriangle(createTriangle(newV1, newV2, newV3), norm0, col1)
        pushTriangle(createTriangle(newV4, newV5, newV6), norm1, col2)
        angle += aStep
    }
}

function drawGearTooth() {

    var inStep = 0.03
    var angStep = angInc / 4

    var rot0 = mat.create()
    mat.rotate(rot0, 180, 0, 1, 0)
    var v1 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    var v2 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep)
    var v3 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep)

    var v4 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    var v5 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep)
    var v6 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), z)

    var norm0 = calcNormalFromVec(v1, v2, v3)
    var norm1 = calcNormalFromVec(v4, v5, v6)

    pushTriangle(createTriangle(v1, v2, v3), norm0, testColors)
    pushTriangle(createTriangle(v4, v5, v6), norm1, testColors)

    var newV1 = vec4.create();
    mat.multiplyP4(newV1, rot0, v1);
    var newV2 = vec4.create();
    mat.multiplyP4(newV2, rot0, v2);
    var newV3 = vec4.create();
    mat.multiplyP4(newV3, rot0, v3)
    var newNorm0 = vec4.create()
    mat.multiplyP4(newNorm0, rot0, norm0)

    var norm1 = calcNormalFromVec(v4, v5, v6)
    var newV4 = vec4.create();
    mat.multiplyP4(newV4, rot0, v4);
    var newV5 = vec4.create();
    mat.multiplyP4(newV5, rot0, v5);
    var newV6 = vec4.create();
    mat.multiplyP4(newV6, rot0, v6)

    var newNorm1 = vec4.create()
    mat.multiplyP4(newNorm1, rot0, norm1)

    pushTriangle(createTriangle(newV1, newV2, newV3), newNorm0, testColors)
    pushTriangle(createTriangle(newV4, newV5, newV6), newNorm1, testColors)

    //Insert two triangles representing square of tooth face.
    //FROM DRAW TOOTH FACE

    //Change something here :(
    v1 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    v2 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z)
    v3 = vec4.create(outRad * Math.cos(ang + 3 * angStep), outRad * Math.sin(ang + 3 * angStep), -z + inStep)

    //CHANGE V5 and V3...........
    v4 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    v5 = v3 //vec4.create(outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z + inStep)
    v6 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep)

    norm0 = calcNormalFromVec(v1, v2, v3)
    norm1 = calcNormalFromVec(v4, v5, v6)

    pushTriangle(createTriangle(v1, v2, v3), norm0, testColors)
    pushTriangle(createTriangle(v4, v5, v6), norm1, testColors)

    
    newV1 = vec4.create();
    mat.multiplyP4(newV1, rot0, v1);
    newV2 = vec4.create();
    mat.multiplyP4(newV2, rot0, v2);
    newV3 = vec4.create();
    mat.multiplyP4(newV3, rot0, v3)
    newNorm0 = vec4.create()
    mat.multiplyP4(newNorm0, rot0, norm0)

    norm1 = calcNormalFromVec(v4, v5, v6)
    newV4 = vec4.create();
    mat.multiplyP4(newV4, rot0, v4);
    newV5 = vec4.create();
    mat.multiplyP4(newV5, rot0, v5);
    newV6 = vec4.create();
    mat.multiplyP4(newV6, rot0, v6)

    var newNorm1 = vec4.create()
    mat.multiplyP4(newNorm1, rot0, norm1)

    pushTriangle(createTriangle(newV1, newV2, newV3), newNorm0, testColors)
    pushTriangle(createTriangle(newV4, newV5, newV6), newNorm1, testColors)

    var r1 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep)
    var r2 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep)
    var r3 = vec4.create(outRad * Math.cos(ang + 3 * angStep), outRad * Math.sin(ang + 3 * angStep), -z + inStep)

    var normR = calcNormalFromVec(r1, r2, r3)
    pushTriangle(createTriangle(r1, r2, r3), normR, testColors)
        
    var r4 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep)
    var r5 = vec4.create(outRad * Math.cos(ang + angStep * 3), outRad * Math.sin(ang + angStep * 3), z - inStep)
    var r6 = vec4.create(outRad * Math.cos(ang + 3 * angStep), outRad * Math.sin(ang + 3 * angStep), -z + inStep)

    normR = calcNormalFromVec(r4, r5, r6)
    pushTriangle(createTriangle(r4, r5, r6), normR, testColors)

}