//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
const vertices = [];
const colors = [];
const normals = [];
const mat = new Learn_webgl_matrix();
const vec4 = new Learn_webgl_point4();
const vec3 = new Learn_webgl_vector3();

//COLORS
const GRAY = [0.5, 0.5, 0.5];
const BLUE = [0.004878, .803922, 0.996078];
const PINK = [1, .443137, 0.807843];
const GREEN = [0.019608, 1, 0.631373];
const METAL0 = [0.470588, 0.572549, 0.596078];
const METAL1 = [0.6323529, 0.694118, 0.709804];
const METAL2 = [0.38627, 0.462745, 0.482353];
const METAL3 = [0.729412, 0.780392, 0.792157]; //Lighter

const BRASS0 = [181 / 255, 166 / 255, 66 / 255];
const BRASS1 = [192 / 255, 177 / 255, 81 / 255];
const BRASS2 = [163 / 255, 149 / 255, 59 / 255];

const PURPLE = [122 / 255, 81 / 255, 192 / 255];
const NEG_NORMAL = [0, 0, -1];
const POS_NORMAL = [0, 0, 1];

//Option defaults:
const SPOKE_COUNT = 20;
const STEPS = 3660;  //How round rings are, this can be changed for a less rounded gear 
                     // but teeth will be misplaced.
const TOOTH_COUNT = 14;
const SPOKE_RAD = .03;
const INNER_THICKNESS = 0.05;
const OUTER_THICKNESS = 0.1;
const TOOTH_HEIGHT = 0.1;
const DULLNESS = 4;
const CENTER_INNER = 0.32;
const CENTER_OUTER = 0.42;
const EXO_OUTER = 1;
const EXO_INNER = 0.9;


const RADIUS = 1.0;
const ANGINC = 2 * Math.PI / STEPS;

const METAL_GEAR = {
    toothCount: 16,
    spokeCount: 16,
    r1: 0.15,
    r2: 0.32,
    spokeRad: 0.03,
    outerThickness: .1,
    innerThickness: .06,
    teethHeight: .1,
    outerColor: METAL0,
    innerColor: METAL1,
    toothOuterColor: METAL3,
    toothInnerColor: METAL2,
    dullness: 4,
}

const METAL_SKINNY = {
    toothCount: 32,
    spokeCount: 32,
    r1: 0.15,
    r2: 0.32,
    spokeRad: 0.01,
    outerThickness: .03,
    innerThickness: .01,
    teethHeight: .1,
    outerColor: METAL0,
    innerColor: METAL1,
    toothOuterColor: METAL3,
    toothInnerColor: METAL2,
    dullness: 2,
}

const OOF_GEAR = {
    toothCount: 27,
    spokeCount: 8,
    r1: 0.15,
    r2: 0.32,
    spokeRad: 0.06,
    outerThickness: .2,
    innerThickness: .1,
    teethHeight: .1,
    outerColor: PINK,
    innerColor: BLUE,
    toothOuterColor: GREEN,
    toothInnerColor: PINK,
    dullness: 2,
}

const BRASSISH_GEAR = {
    toothCount: 5,
    spokeCount: 8,
    r1: 0.05,
    r2: 0.32,
    spokeRad: 0.03,
    outerThickness: .1,
    innerThickness: .05,
    teethHeight: .2,
    outerColor: BRASS0,
    innerColor: BRASS0,
    toothOuterColor: BRASS1,
    toothInnerColor: BRASS2,
    dullness: 6,
}


/**
 * Create a gear from option's properties. Some constant objects are provided for testing.
 * @param {Object} options Set of custom properties to alter the gear. Any properties not set in optionis will be overridden by default values. 
 */
function scottGear(options) {
    var ang = 0;
    /*
        USAGE EXAMPLE:
        options = {
            toothCount: Number of teeth on the gear.
            spokeCount: Number of spokes.
            r1: Inner radius of the center ring.
            r2: Outer radius of the center ring.
            spokeRad: Radius of the spoke cylinder.
            outerThickness: Thickness of the outer ring and teeth.
            innerThickness: .Thickness of the inner ring.
            teethHeight: Heigh of the teeth.
            outerColor: Outer color
            innerColor: Inner color, the spokes have a color gradient from inner to outer.
            toothOuterColor: Outer tooth color.
            toothInnerColor: Inner tooth color, teeth have a gradient from inner to outer.
            dullness: How 'sharp' the teeth appear. Lowest value is 2 where no roof is visible, values larger than
                24 don't change much.
            noRoof: Set true for no open roof spaces (teeth everywhere). Doubles the amount of teeth.
        }
    */
    const defaults = {
        toothCount: TOOTH_COUNT,
        spokeCount: SPOKE_COUNT,
        r1: CENTER_INNER,
        r2: CENTER_OUTER,
        r3: EXO_INNER,
        r4: EXO_OUTER,
        spokeRad: SPOKE_RAD,
        outerThickness: OUTER_THICKNESS,
        innerThickness: INNER_THICKNESS,
        teethHeight: TOOTH_HEIGHT,
        outerColor: METAL0,
        innerColor: METAL1,
        toothOuterColor: METAL3,
        toothInnerColor: METAL2,
        dullness: DULLNESS,
        noRoof: false
    }

    const opts = Object.assign(defaults, options);

    //CREATE RINGS
    for (let i = 0; i < STEPS; i++) {
        createOuterRing(opts, ang);
        createInnerRing(opts, ang);
        drawCoinEdge(opts, ang);
        ang += ANGINC;
    }


    //CREATE TEETH
    ang = 0;
    const noRoof = options.noRoof
    const tc = checkToothCount(opts.toothCount);
    var tStep = 2 * Math.PI / tc;
    var drawTooth = false;
    for (let i = 0; i < tc; i++) {
        drawTooth = !drawTooth;
        if (drawTooth || noRoof) {
            var rotateMat = mat.create();
            mat.rotate(rotateMat, mat.toDegrees(ang + tStep), 0, 0, 1);
            drawGearTooth(tStep, opts, ang);
        } else {
            //TODO move drawCoinEdge here...
        }
        ang += tStep;
    }

    //CREATE SPOKES
    ang = 0;
    var aStep = 2 * Math.PI / opts.spokeCount;
    for (let j = 0; j < opts.spokeCount; j++) {
        var rotateMat = mat.create();
        mat.rotate(rotateMat, mat.toDegrees(ang + aStep), 0, 0, 1);
        createSpoke(rotateMat, opts);
        ang += aStep;
    }

    return [vertices, colors, normals];
}

function createOuterRing(options, ang) {
    const z = options.outerThickness;
    const ringStart = options.r3
    const col = [options.outerColor[0], options.outerColor[1], options.outerColor[2],
        options.outerColor[0], options.outerColor[1], options.outerColor[2],
        options.outerColor[0], options.outerColor[1], options.outerColor[2]
    ];
    var rotateMat = mat.create();
    var rotateRingInner = mat.create();
    //Matrix to rotate front to back.
    mat.rotate(rotateMat, 180, 0, 1, 0);
    mat.rotate(rotateRingInner, 180, 0, 0, 1);

    const v1 = vec4.create(ringStart * RADIUS * Math.cos(ang), ringStart * RADIUS * Math.sin(ang), z);
    const v2 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), z);
    const v3 = vec4.create(RADIUS * Math.cos(ang + ANGINC), RADIUS * Math.sin(ang + ANGINC), z);

    const v4 = vec4.create(ringStart * RADIUS * Math.cos(ang - ANGINC), ringStart * RADIUS * Math.sin(ang - ANGINC), z);
    const v5 = vec4.create(ringStart * RADIUS * Math.cos(ang), ringStart * RADIUS * Math.sin(ang), z);
    const v6 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), z);

    const v7 = vec4.create(ringStart * RADIUS * Math.cos(ang), ringStart * RADIUS * Math.sin(ang), z);
    const v8 = vec4.create(ringStart * RADIUS * Math.cos(ang), ringStart * RADIUS * Math.sin(ang), -z);
    const v9 = vec4.create(ringStart * RADIUS * Math.cos(ang + ANGINC), ringStart * RADIUS * Math.sin(ang + ANGINC), z)

    const i1 = vec4.create(ringStart * RADIUS * Math.cos(ang), ringStart * RADIUS * Math.sin(ang), -z);
    const i2 = vec4.create(ringStart * RADIUS * Math.cos(ang + ANGINC), ringStart * RADIUS * Math.sin(ang + ANGINC), z);
    const i3 = vec4.create(ringStart * RADIUS * Math.cos(ang + ANGINC), ringStart * RADIUS * Math.sin(ang + ANGINC), -z);

    const norm0 = calcNormalFromVec(v1, v2, v3);
    const norm1 = calcNormalFromVec(v6, v5, v4);

    const iNorm = calcNormalFromVec(i1, i2, i3);

    pushTriangle(createTriangle(v1, v2, v3), norm0, col);
    pushTriangle(createTriangle(v4, v5, v6), norm1, col);
    pushTriangle(createTriangle(v7, v8, v9), iNorm, col);
    pushTriangle(createTriangle(i1, i2, i3), iNorm, col);


    //Rotate and create reverse side.
    var newV1 = vec4.create();
    mat.multiplyP4(newV1, rotateMat, v1);
    var newV2 = vec4.create();
    mat.multiplyP4(newV2, rotateMat, v2);
    var newV3 = vec4.create();
    mat.multiplyP4(newV3, rotateMat, v3);

    var newV4 = vec4.create();
    mat.multiplyP4(newV4, rotateMat, v4);
    var newV5 = vec4.create();
    mat.multiplyP4(newV5, rotateMat, v5);
    var newV6 = vec4.create();
    mat.multiplyP4(newV6, rotateMat, v6);

    pushTriangle(createTriangle(newV1, newV2, newV3), NEG_NORMAL, col);
    pushTriangle(createTriangle(newV4, newV5, newV6), NEG_NORMAL, col);

}

function createInnerRing(options, ang) {
    const z = options.innerThickness;
    const col = [options.innerColor[0], options.innerColor[1], options.innerColor[2],
        options.innerColor[0], options.innerColor[1], options.innerColor[2],
        options.innerColor[0], options.innerColor[1], options.innerColor[2]
    ];
    const cStart = options.r1;
    const cEnd = options.r2;
    const rotateMat = mat.create();
    const rotateRingInner = mat.create();

    //Matrix to rotate front to back.
    mat.rotate(rotateMat, 180, 0, 1, 0);
    mat.rotate(rotateRingInner, 180, 0, 0, 1);

    //Face of center circle
    const c1 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), z);
    const c2 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), z);
    const c3 = vec4.create(cEnd * RADIUS * Math.cos(ang + ANGINC), cEnd * RADIUS * Math.sin(ang + ANGINC), z);

    const c4 = vec4.create(cStart * RADIUS * Math.cos(ang - ANGINC), cStart * RADIUS * Math.sin(ang - ANGINC), z);
    const c5 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), z);
    const c6 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), z);


    pushTriangle(createTriangle(c1, c2, c3), POS_NORMAL, col);
    pushTriangle(createTriangle(c4, c5, c6), POS_NORMAL, col);

    //Rotate and create reverse side of face
    const newC1 = vec4.create();
    mat.multiplyP4(newC1, rotateMat, c1);
    const newC2 = vec4.create();
    mat.multiplyP4(newC2, rotateMat, c2);
    const newC3 = vec4.create();
    mat.multiplyP4(newC3, rotateMat, c3);

    const newC4 = vec4.create();
    mat.multiplyP4(newC4, rotateMat, c4);
    const newC5 = vec4.create();
    mat.multiplyP4(newC5, rotateMat, c5);
    const newC6 = vec4.create();
    mat.multiplyP4(newC6, rotateMat, c6);

    pushTriangle(createTriangle(newC1, newC2, newC3), NEG_NORMAL, col);
    pushTriangle(createTriangle(newC4, newC5, newC6), NEG_NORMAL, col);


    //Inner edges of center ring.
    const j1 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), z);
    const j2 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), -z);
    const j3 = vec4.create(cStart * RADIUS * Math.cos(ang + ANGINC), cStart * RADIUS * Math.sin(ang + ANGINC), z);

    const j4 = j2;
    const j5 = j3;
    const j6 = vec4.create(cStart * RADIUS * Math.cos(ang + ANGINC), cStart * RADIUS * Math.sin(ang + ANGINC), -z);

    //These normals are all mess up dawg
    // pushTriangle(createTriangle(j1, j2, j3), calcNormalFromVec(j1, j2, j3), blue)
    // pushTriangle(createTriangle(j4, j5, j6), calcNormalFromVec(j4, j5, j6), blue)

    const jNorm0 = [cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), 0];
    pushTriangle(createTriangle(j1, j2, j3), jNorm0, col);
    pushTriangle(createTriangle(j4, j5, j6), jNorm0, col);

    //Outer edges of center ring.
    const j7 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), z);
    const j8 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), -z);
    const j9 = vec4.create(cEnd * RADIUS * Math.cos(ang + ANGINC), cEnd * RADIUS * Math.sin(ang + ANGINC), z);

    const j10 = j8;
    const j11 = j9;
    const j12 = vec4.create(cEnd * RADIUS * Math.cos(ang + ANGINC), cEnd * RADIUS * Math.sin(ang + ANGINC), -z);

    const jNorm1 = [cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), 0];
    pushTriangle(createTriangle(j7, j8, j9), jNorm1, col);
    pushTriangle(createTriangle(j10, j11, j12), jNorm1, col);

}

function drawCoinEdge(options, ang) {
    const z = options.outerThickness;
    const col = [options.outerColor[0], options.outerColor[1], options.outerColor[2],
        options.outerColor[0], options.outerColor[1], options.outerColor[2],
        options.outerColor[0], options.outerColor[1], options.outerColor[2]
    ];
    const v1 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), -z);
    const v2 = vec4.create(RADIUS * Math.cos(ang + ANGINC), RADIUS * Math.sin(ang + ANGINC), -z);
    const v3 = vec4.create(RADIUS * Math.cos(ang + ANGINC), RADIUS * Math.sin(ang + ANGINC), z);

    const v4 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), -z);
    const v5 = vec4.create(RADIUS * Math.cos(ang + ANGINC), RADIUS * Math.sin(ang + ANGINC), z);
    const v6 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), z);

    const norm0 = calcNormalFromVec(v1, v2, v3);
    const norm1 = calcNormalFromVec(v4, v5, v6);

    pushTriangle(createTriangle(v1, v2, v3), norm0, col);
    pushTriangle(createTriangle(v4, v5, v6), norm1, col);
}

function createSpoke(rotateMat, options) {
    var steps = 180;
    var angle = 0;
    var aStep = 2 * Math.PI / steps;
    const cEnd = options.r2;
    const r = options.spokeRad;
    const height = options.r3;

    for (var j = 0; j < steps; j++) {
        //Create the spoke at initial point
        const v1 = vec4.create(r * Math.cos(angle), cEnd - .01, r * Math.sin(angle));
        const v3 = vec4.create(r * Math.cos(angle + aStep), height, r * Math.sin(angle + aStep));
        const v2 = vec4.create(r * Math.cos(angle + aStep), cEnd - .01, r * Math.sin(angle + aStep));

        const v4 = v1;
        const v5 = v3;
        const v6 = vec4.create(r * Math.cos(angle), height, r * Math.sin(angle));

        const norm0 = calcNormalFromVec(v2, v1, v3);

        //Rotate to new area
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

        const outCol = options.outerColor;
        const inCol = options.innerColor;

        const col1 = [inCol[0], inCol[1], inCol[2], inCol[0], inCol[1], inCol[2], outCol[0], outCol[1], outCol[2]];
        const col2 = [inCol[0], inCol[1], inCol[2], outCol[0], outCol[1], outCol[2], outCol[0], outCol[1], outCol[2]];

        pushTriangle(createTriangle(newV1, newV2, newV3), norm0, col1);
        pushTriangle(createTriangle(newV4, newV5, newV6), norm0, col2);

        angle += aStep;
    }
}

function drawGearTooth(angleStep, options, ang) {

    const inCol = options.toothInnerColor;
    const outCol = options.toothOuterColor;

    const col0 = [outCol[0], outCol[1], outCol[2], outCol[0], outCol[1], outCol[2], outCol[0], outCol[1], outCol[2]];
    const col1 = [inCol[0], inCol[1], inCol[2], inCol[0], inCol[1], inCol[2], outCol[0], outCol[1], outCol[2]];
    const col2 = [inCol[0], inCol[1], inCol[2], outCol[0], outCol[1], outCol[2], outCol[0], outCol[1], outCol[2]];

    const col3 = [inCol[0], inCol[1], inCol[2], outCol[0], outCol[1], outCol[2], inCol[0], inCol[1], inCol[2]]

    const n = options.dullness > 1 ? options.dullness : 2;
    // const split = 4; //Adding this buffer bugged the gear. 4 is the safest value...
    const s = n - 1;
    const z = options.outerThickness;
    const outRad = RADIUS + options.teethHeight;
    var inStep = 0.03;
    var angStep = angleStep / n;

    var rot0 = mat.create()
    mat.rotate(rot0, 180, 0, 1, 0) //TOIDO WHAT?
    var v1 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), -z);
    var v2 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep);
    var v3 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep);

    var v4 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), -z);
    var v5 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep);
    var v6 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), z);

    var norm0 = calcNormalFromVec(v1, v2, v3);
    var norm1 = calcNormalFromVec(v4, v5, v6);

    pushTriangle(createTriangle(v1, v2, v3), norm0, col2);
    pushTriangle(createTriangle(v4, v5, v6), norm1, col3);

    var newV1 = vec4.create();
    mat.multiplyP4(newV1, rot0, v1);
    var newV2 = vec4.create();
    mat.multiplyP4(newV2, rot0, v2);
    var newV3 = vec4.create();
    mat.multiplyP4(newV3, rot0, v3)
    var newNorm0 = vec4.create()


    //TODO good?
    mat.multiplyP4(newNorm0, rot0, norm0);

    var norm1 = calcNormalFromVec(v4, v5, v6);
    var newV4 = vec4.create();
    mat.multiplyP4(newV4, rot0, v4);
    var newV5 = vec4.create();
    mat.multiplyP4(newV5, rot0, v5);
    var newV6 = vec4.create();
    mat.multiplyP4(newV6, rot0, v6)

    var newNorm1 = vec4.create()
    mat.multiplyP4(newNorm1, rot0, norm1)

    pushTriangle(createTriangle(newV1, newV2, newV3), newNorm0, col2);
    pushTriangle(createTriangle(newV4, newV5, newV6), newNorm1, col2);

    const c1 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), -z);
    const c2 = vec4.create(RADIUS * Math.cos(ang + angleStep), RADIUS * Math.sin(ang + angleStep), -z);
    const c3 = vec4.create(outRad * Math.cos(ang + s * angStep), outRad * Math.sin(ang + s * angStep), -z + inStep);

    const c4 = vec4.create(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang), -z);
    const c5 = c3;
    const c6 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep);

    const normC0 = calcNormalFromVec(c1, c2, c3);
    const normC1 = calcNormalFromVec(c4, c5, c6);

    pushTriangle(createTriangle(c1, c2, c3), normC0, col1);
    pushTriangle(createTriangle(c4, c5, c6), normC1, col2);


    const newC1 = vec4.create();
    mat.multiplyP4(newC1, rot0, c1);
    const newC2 = vec4.create();
    mat.multiplyP4(newC2, rot0, c2);
    const newC3 = vec4.create();
    mat.multiplyP4(newC3, rot0, c3)


    const newC4 = vec4.create();
    mat.multiplyP4(newC4, rot0, c4);
    const newC5 = vec4.create();
    mat.multiplyP4(newC5, rot0, c5);
    const newC6 = vec4.create();
    mat.multiplyP4(newC6, rot0, c6)

    const normC2 = calcNormalFromVec(newC1, newC2, newC3);
    const normC3 = calcNormalFromVec(newC4, newC5, newC6);

    pushTriangle(createTriangle(newC1, newC2, newC3), normC2, col1);
    pushTriangle(createTriangle(newC4, newC5, newC6), normC3, col2);

    var r1 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), -z + inStep);
    var r2 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep);
    var r3 = vec4.create(outRad * Math.cos(ang + s * angStep), outRad * Math.sin(ang + s * angStep), -z + inStep);

    const normR0 = [outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), 0];
    pushTriangle(createTriangle(r1, r2, r3), normR0, col0);

    var r4 = vec4.create(outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), z - inStep);
    var r5 = vec4.create(outRad * Math.cos(ang + angStep * s), outRad * Math.sin(ang + angStep * s), z - inStep);
    var r6 = vec4.create(outRad * Math.cos(ang + s * angStep), outRad * Math.sin(ang + s * angStep), -z + inStep);

    const normR1 = [outRad * Math.cos(ang + angStep), outRad * Math.sin(ang + angStep), 0];
    pushTriangle(createTriangle(r4, r5, r6), normR1, col0);

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

function checkToothCount(tc) {
    var retVal = tc * 2;
    if (retVal % 4 === 0) {
        retVal += 2;
    }
    return retVal;
}