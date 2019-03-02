//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
const vertices = [];
const colors = [];
const normals = [];
const mat = new Learn_webgl_matrix();
const vec4 = new Learn_webgl_point4();
const vec3 = new Learn_webgl_vector3();


const defaultColors = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
const BLUE = [0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078]
const PINK = [1, .443137, 0.807843, 1, .443137, 0.807843, 1, .443137, 0.807843]
const testColors = [0.019608, 1, 0.631373, 0.019608, 1, 0.631373, 0.019608, 1, 0.631373]
const negNormal = [0, 0, -1]
const posNormal = [0, 0, 1]



const rad = 1.0;
const outRad = rad * 1.1;

var ang = 0;

// var i; //  coin face, front & back
const tStepIn = 0.05
const cStart = 0.32
const cEnd = 0.42
const ringStart = 0.9


//Real defaults:
const SPOKE_COUNT = 20
const STEPS = 360
const TOOTH_COUNT = 54  //10 or higher but not divisible by 4?
const SPOKE_RAD = .03
const EXO_INNER = 0.05
const EXO_OUTER = 0.1
const TOOTH_HEIGHT = 0.1

//NEW CONSTANTS:
const CENTER_INNER = 0.32
const CENTER_OUTER = 0.42


const angInc = 2 * Math.PI / STEPS




function createGear(options) {

    const test = {
        toothCount: 18
    }

    const defaults = {
        toothCount: TOOTH_COUNT,
        spokeCount: SPOKE_COUNT,
        r1: CENTER_INNER,
        r2: CENTER_OUTER,
        spokeRad: SPOKE_RAD,
        outerThickness: EXO_OUTER,
        innerThickness: EXO_INNER,
        teethHeight: TOOTH_HEIGHT,
        outerColor: PINK,
        InnerColor: BLUE
    }



    const o = Object.assign(defaults, options)

    //CREATE RINGS
    for (let i = 0; i < STEPS; i++) {
        createOuterRing(o)
        createInnerRing(o)
        drawCoinEdge(o)
        ang += angInc;
    }


    ang = 0
    var tStep = 2 * Math.PI / o.toothCount
    var drawTooth = false
    for (let i = 0; i < o.toothCount; i++) {
        drawTooth = !drawTooth
        if (drawTooth) {
            var rotateMat = mat.create()
            mat.rotate(rotateMat, mat.toDegrees(ang + tStep), 0, 0, 1)
            drawGearTooth(tStep, o)
        }
        ang += tStep
    } 

    ang = 0
    var aStep = 2 * Math.PI / o.spokeCount
    for (let j = 0; j < o.spokeCount; j++) {
        var rotateMat = mat.create()
        mat.rotate(rotateMat, mat.toDegrees(ang + aStep), 0, 0, 1)
        createSpoke(rotateMat, o)
        ang += aStep
    }

    return [vertices, colors, normals]
}

function createOuterRing(options) {
    const z = options.outerThickness;

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

    pushTriangle(createTriangle(v1, v2, v3), norm0, PINK)
    pushTriangle(createTriangle(v4, v5, v6), norm1, PINK)
    pushTriangle(createTriangle(v7, v8, v9), iNorm, PINK)
    pushTriangle(createTriangle(i1, i2, i3), iNorm, PINK)

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

    pushTriangle(createTriangle(newV1, newV2, newV3), negNormal, PINK)
    pushTriangle(createTriangle(newV4, newV5, newV6), negNormal, PINK)

}

function createInnerRing(options) {
    const z = options.innerThickness
    const cStart = options.r1
    const cEnd  = options.r2
    const rotateMat = mat.create();
    const rotateRingInner = mat.create();

    //Matrix to rotate front to back.
    mat.rotate(rotateMat, 180, 0, 1, 0);
    mat.rotate(rotateRingInner, 180, 0, 0, 1)

    //Face of center circle
    const c1 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
    const c2 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);
    const c3 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), z);

    const c4 = vec4.create(cStart * rad * Math.cos(ang - angInc), cStart * rad * Math.sin(ang - angInc), z);
    const c5 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
    const c6 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);


    pushTriangle(createTriangle(c1, c2, c3), posNormal, BLUE)
    pushTriangle(createTriangle(c4, c5, c6), posNormal, BLUE)

    //Rotate and create reverse side of face
    const newC1 = vec4.create();
    mat.multiplyP4(newC1, rotateMat, c1);
    const newC2 = vec4.create();
    mat.multiplyP4(newC2, rotateMat, c2);
    const newC3 = vec4.create();
    mat.multiplyP4(newC3, rotateMat, c3);

    const newC4 = vec4.create()
    mat.multiplyP4(newC4, rotateMat, c4)
    const newC5 = vec4.create()
    mat.multiplyP4(newC5, rotateMat, c5)
    const newC6 = vec4.create()
    mat.multiplyP4(newC6, rotateMat, c6)

    pushTriangle(createTriangle(newC1, newC2, newC3), negNormal, BLUE)
    pushTriangle(createTriangle(newC4, newC5, newC6), negNormal, BLUE)


    //Inner edges of center ring.
    const j1 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
    const j2 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), -z);
    const j3 = vec4.create(cStart * rad * Math.cos(ang + angInc), cStart * rad * Math.sin(ang + angInc), z);

    const j4 = j2;
    const j5 = j3;
    const j6 = vec4.create(cStart * rad * Math.cos(ang + angInc), cStart * rad * Math.sin(ang + angInc), -z);

    //These normals are all mess up dawg
    // pushTriangle(createTriangle(j1, j2, j3), calcNormalFromVec(j1, j2, j3), blue)
    // pushTriangle(createTriangle(j4, j5, j6), calcNormalFromVec(j4, j5, j6), blue)

    const jNorm0 = [cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), 0]
    pushTriangle(createTriangle(j1, j2, j3), jNorm0, BLUE)
    pushTriangle(createTriangle(j4, j5, j6), jNorm0, BLUE)

    //Outer edges of center ring.
    const j7 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);
    const j8 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), -z);
    const j9 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), z);

    const j10 = j8;
    const j11 = j9;
    const j12 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), -z);

    const jNorm1 = [cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), 0]
    pushTriangle(createTriangle(j7, j8, j9), jNorm1, BLUE)
    pushTriangle(createTriangle(j10, j11, j12), jNorm1, BLUE)

}

function drawCoinEdge(options) {
    const z = options.outerThickness;
    const v1 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    const v2 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z)
    const v3 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z)

    const v4 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    const v5 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z)
    const v6 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), z)

    const norm0 = calcNormalFromVec(v1, v2, v3)
    const norm1 = calcNormalFromVec(v4, v5, v6)

    pushTriangle(createTriangle(v1, v2, v3), norm0, PINK)
    pushTriangle(createTriangle(v4, v5, v6), norm1, PINK)
}

function createSpoke(rotateMat, options) {
    var steps = 180
    var angle = 0
    var aStep = 2 * Math.PI / steps
    const r = options.spokeRad

    for (var j = 0; j < steps; j++) {
        const v1 = vec4.create(r * Math.cos(angle), cEnd - .01, r * Math.sin(angle))
        const v2 = vec4.create(r * Math.cos(angle + aStep), cEnd -.01, r *   Math.sin(angle + aStep))
        const v3 = vec4.create(r * Math.cos(angle + aStep), ringStart, r *  Math.sin(angle + aStep))

        const v4 = vec4.create(r * Math.cos(angle), cEnd - .01, r * Math.sin(angle))
        const v5 = vec4.create(r * Math.cos(angle + aStep), ringStart, r *   Math.sin(angle + aStep))
        const v6 = vec4.create(r * Math.cos(angle), ringStart, r *  Math.sin(angle))

        const newV1 = vec4.create();
        mat.multiplyP4(newV1, rotateMat, v1)
        const newV2 = vec4.create();
        mat.multiplyP4(newV2, rotateMat, v2)
        const newV3 = vec4.create();
        mat.multiplyP4(newV3, rotateMat, v3)
        const newV4 = vec4.create();
        mat.multiplyP4(newV4, rotateMat, v4)
        const newV5 = vec4.create();
        mat.multiplyP4(newV5, rotateMat, v5)
        const newV6 = vec4.create();
        mat.multiplyP4(newV6, rotateMat, v6)

        const norm0 = calcNormalFromVec(newV1, newV2, newV3)
        const norm1 = calcNormalFromVec(newV4, newV5, newV6)

        // Blue to pink colors
        const col1 = [0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078, 1, .443137, 0.807843]
        const col2 = [0.004878, .803922, 0.996078, 1, .443137, 0.807843, 1, .443137, 0.807843]

        pushTriangle(createTriangle(newV1, newV2, newV3), norm0, col1)
        pushTriangle(createTriangle(newV4, newV5, newV6), norm1, col2)
        angle += aStep
    }
}

function drawGearTooth(angleStep, options) {

    const z = options.outerThickness;
    const outRad = rad + options.teethHeight
    var inStep = 0.03
    var angStep = angleStep / 4

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

    v1 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    v2 = vec4.create(rad * Math.cos(ang + angleStep), rad * Math.sin(ang + angleStep), -z)
    v3 = vec4.create(outRad * Math.cos(ang + 3 * angStep), outRad * Math.sin(ang + 3 * angStep), -z + inStep)

    //CHANGE V5 and V3...........
    v4 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    v5 = v3;
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
