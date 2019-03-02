
function createInnerRing(options) {

    const cStart = options.r1
    const cEnd  = options.r2
    var rotateMat = mat.create();
    var rotateRingInner = mat.create();

    //Matrix to rotate front to back.
    mat.rotate(rotateMat, 180, 0, 1, 0);
    mat.rotate(rotateRingInner, 180, 0, 0, 1)

    var c1 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), z);
    var c2 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), z);
    var c3 = vec4.create(cEnd * RADIUS * Math.cos(ang + ANGINC), cEnd * RADIUS * Math.sin(ang + ANGINC), z);

    var c4 = vec4.create(cStart * RADIUS * Math.cos(ang - ANGINC), cStart * RADIUS * Math.sin(ang - ANGINC), z);
    var c5 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), z);
    var c6 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), z);


    pushTriangle(createTriangle(c1, c2, c3), posNormal, BLUE)
    pushTriangle(createTriangle(c4, c5, c6), posNormal, BLUE)

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

    pushTriangle(createTriangle(newC1, newC2, newC3), negNormal, BLUE)
    pushTriangle(createTriangle(newC4, newC5, newC6), negNormal, BLUE)

    var j1 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), z);
    var j2 = vec4.create(cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), -z);
    var j3 = vec4.create(cStart * RADIUS * Math.cos(ang + ANGINC), cStart * RADIUS * Math.sin(ang + ANGINC), z);

    var j4 = j1;
    var j5 = j3;
    var j6 = vec4.create(cStart * RADIUS * Math.cos(ang + ANGINC), cStart * RADIUS * Math.sin(ang + ANGINC), -z);

    pushTriangle(createTriangle(j1, j2, j3), calcNormalFromVec(j1, j2, j3), BLUE)
    pushTriangle(createTriangle(j4, j5, j6), calcNormalFromVec(j4, j5, j6), BLUE)


    var jNorm = [cStart * RADIUS * Math.cos(ang), cStart * RADIUS * Math.sin(ang), 0]

    pushTriangle(createTriangle(j1, j2, j3), jNorm, BLUE)
    pushTriangle(createTriangle(j4, j5, j6), jNorm, BLUE)

    var j7 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), z);
    var j8 = vec4.create(cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), -z);
    var j9 = vec4.create(cEnd * RADIUS * Math.cos(ang + ANGINC), cEnd * RADIUS * Math.sin(ang + ANGINC), z);

    var j10 = j8;
    var j11 = j9;
    var j12 = vec4.create(cEnd * RADIUS * Math.cos(ang + ANGINC), cEnd * RADIUS * Math.sin(ang + ANGINC), -z);

    jNorm = [cEnd * RADIUS * Math.cos(ang), cEnd * RADIUS * Math.sin(ang), 0]

    pushTriangle(createTriangle(j7, j8, j9), jNorm, BLUE)
    pushTriangle(createTriangle(j10, j11, j12), jNorm, BLUE)

