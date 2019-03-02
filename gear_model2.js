//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
const vertices = [];
const colors = [];
const normals = [];
const mat = new Learn_webgl_matrix();
const vec4 = new Learn_webgl_point4();
const vec3 = new Learn_webgl_vector3();


//TODO rename
//Constant normals...
const negNormal = [0, 0, -1]
const posNormal = [0, 0, 1]




//TODO Where is const ang??????
// var z = 0.1;

const tStepIn = 0.05
const CENTER_INNER = 0.32
const CENTER_OUTER = 0.42
const EXO_INNER = 0.9
const EXO_OUTER = 1.0
const TOOTH_ROOF = 1.1
const Z_INNER = 0.1
const Z_OUTER = 0.1
const RANK = 4
const SPOKE_RADIUS = 0.04
const SPOKES = 30
const TOOTH_COUNT = 54; //Can't be divisible by 4?????????????????????????????

const angInc = 2 * Math.PI / TOOTH_COUNT;

//Some colors
const PINK = [1, .443137, 0.807843]
const BLUE = [0.004878, .803922, 0.996078]
const defaultColors = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
const blue = [0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078]
const pink = [1, .443137, 0.807843, 1, .443137, 0.807843, 1, .443137, 0.807843]
const testColors = [0.019608, 1, 0.631373, 0.019608, 1, 0.631373, 0.019608, 1, 0.631373]

const test0 = {
    toothCount: TOOTH_COUNT,
    spokeCount: SPOKE_COUNT,
    cStart: .2,
    cEnd: .45,
    dullness: RANK,
    ringStart: .8,
    rad: 1,
    outRad: TOOTH_ROOF,
    zInner: .02,
    zOuter: .02,
    spokeRad: .005
}



/*
    USAGE EXAMPLE:
    options = {
        toothCount: Amount of teeth, BUGGED! Tooth rotations don't work where toothCount % 4 === 0
        spokeCount: Amount of spokes
        cStart: Inner radius of center ring,
        cEnd: Outer radius of outer ring
        dullness: Higher values make the teeth look duller rnage: (2 - 100...)
        ringStart: Exterior ring's inner radius.
        rad: Outer radius of the exterior ring,
        outRad: Outer radius encompassing the top's of gear teeth.
        zInner: Z range of the inner ring
        zOuter: Z range of the outer ring
        spokeRad: Radius of the spokes
    }


*/
function createGear(options = {}) {
    var angle = 0
    // Making gear triangles
    var drawTooth = false
    const defaults = {
        toothCount: 54,
        spokeCount: SPOKE_COUNT,
        cStart: CENTER_INNER,
        cEnd: CENTER_OUTER,
        dullness: RANK,
        ringStart: EXO_INNER,
        rad: EXO_OUTER,
        outRad: TOOTH_ROOF,
        zInner: Z_INNER,
        zOuter: Z_OUTER,
        spokeRad: SPOKE_RADIUS
    }

    options = Object.assign({}, options, defaults)
    // options = test1
    //MAIN DRAWING LOOP
    for (let i = 0; i < options.toothCount; i++) {
        drawTooth = !drawTooth
        createOuterRing(angle, options)
        createInnerRing(angle, options)
        if (drawTooth) {
            createTooth(angle, options)
        } else {
            drawCoinEdge(angle, options)
        }
        angle += angInc;
    }

    //SPOKE DRAWING LOOP
    angle = 0
    var aStep = 2 * Math.PI / SPOKE_COUNT
    for (let i = 0; i < options.spokeCount; i++) {
        var rotateMat = mat.create()
        mat.rotate(rotateMat, mat.toDegrees(angle + angInc), 0, 0, 1)
        createSpoke(rotateMat, options)
        angle += aStep
    }
    return [vertices, colors, normals]
}


/**
 * Create outer ring
 * @param {Object} options 
 */
function createOuterRing(ang, options) {
    ang = ang
    var z = options.zOuter
    var ringStart = options.ringStart
    var rad = options.rad
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


/**
 * Creates the inner ring.
 * TODO clean up old crap
 * @param {Object} options 
 */
function createInnerRing(ang, options) {
    ang = ang
    const z = options.zInner
    const cStart = options.cStart
    const cEnd = options.cEnd
    const rad = options.rad
    const rotateMat = mat.create();
    const rotateRingInner = mat.create();
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

/**
 * Draws the coin edge between teeth.
 */
function drawCoinEdge(ang, options) {
    ang = ang
    const z = options.zOuter
    const rad = options.rad
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


/**
 * Creates a generic cylinder rotated by a matrix.
 * @param {Learn_webgl_matrix} rotateMat Rotation matrix.
 */
function createSpoke(rotateMat, options) {
    const steps = 180
    const aStep = 2 * Math.PI / steps
    const cEnd = options.cEnd
    const ringStart = options.ringStart
    const spokeRad = options.spokeRad

    var angle = 0   //local angle var for incrementing around circle

    for (var j = 0; j < steps; j++) {
        var v1 = vec4.create(spokeRad * Math.cos(angle), cEnd - .1, spokeRad * Math.sin(angle))
        var v2 = vec4.create(spokeRad * Math.cos(angle + aStep), cEnd -.1, spokeRad *   Math.sin(angle + aStep))
        var v3 = vec4.create(spokeRad * Math.cos(angle + aStep), ringStart, spokeRad *  Math.sin(angle + aStep))

        var v4 = vec4.create(spokeRad * Math.cos(angle), cEnd - .1, spokeRad * Math.sin(angle))
        var v5 = vec4.create(spokeRad * Math.cos(angle + aStep), ringStart, spokeRad *   Math.sin(angle + aStep))
        var v6 = vec4.create(spokeRad * Math.cos(angle), ringStart, spokeRad *  Math.sin(angle))

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


        var col1 = [0.004878, .803922, 0.996078, 0.004878, .803922, 0.996078, 1, .443137, 0.807843]
        var col2 = [0.004878, .803922, 0.996078, 1, .443137, 0.807843, 1, .443137, 0.807843]

        pushTriangle(createTriangle(newV1, newV2, newV3), norm0, col1)
        pushTriangle(createTriangle(newV4, newV5, newV6), norm1, col2)
        angle += aStep
    }
}

/**
 * Creates the full tooth. Creates one outer and one inner wall and rotates to fill the other side.
 * @param {Number} dullness Higher values create a more blunt tooth. Interesting range is (2, 24).
 */
function createTooth(ang, options) {
    ang = ang
    const split = options.dullness > 1 ? options.dullness : 2
    const rad = options.rad
    const outRad = options.outRad
    const inStep = 0.03
    const z = options.zOuter
    const angStep = angInc / split  //Step inside the tooth to create a slant

    //Rotation matrix for flipping faces
    var rot0 = mat.create()
    mat.rotate(rot0, 180, 0, 1, 0)

    //INNER WALLS
    var v1 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    var v2 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep)
    var v3 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep)

    var v4 = v1
    var v5 = v3
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

    //All normal and vector vars are now reused....
    //OUTER FACES
    v1 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), -z)
    v2 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z)
    v3 = vec4.create(outRad * Math.cos(ang + (split - 1) * angStep), outRad * Math.sin(ang + (split - 1) * angStep), -z + inStep)

    v4 = v1
    v5 = v3
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


    //ROOF
    var r1 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep)
    var r2 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep)
    var r3 = vec4.create(outRad * Math.cos(ang + (split - 1) * angStep), outRad * Math.sin(ang + (split - 1) * angStep), -z + inStep)

    var normR = calcNormalFromVec(r1, r2, r3)
    pushTriangle(createTriangle(r1, r2, r3), normR, testColors)
        
    var r4 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep)
    var r5 = vec4.create(outRad * Math.cos(ang + angStep * (split - 1)), outRad * Math.sin(ang + angStep * (split - 1)), z - inStep)
    var r6 = vec4.create(outRad * Math.cos(ang + (split - 1) * angStep), outRad * Math.sin(ang + (split - 1) * angStep), -z + inStep)

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