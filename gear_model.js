//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex


function createGear() {

    const vertices = [];
    const colors = [];
    const normals = [];    

    ////////////////////////////
    // Making gear triangles

    var n = 54;
    var rad = 1.0;
    var outRad = rad * 1.1;
    var angInc = 2 * 3.14159 / n;
    var ang = 0;
    var z = 0.1;
    var i; //  coin face, front & back
   
    for (i = 0; i < n; i++) {

        var ringStart = 0.9
        var mat = new Learn_webgl_matrix();
        var vec4 = new Learn_webgl_point4();


        var rotateMat = mat.create();
        var rotateRingInner = mat.create();
        //Matrix to rotate front to back.
        mat.rotate(rotateMat, 180, 0, 1, 0);
        mat.rotate(rotateRingInner, 180, 0, 0, 1)


        var v1 = vec4.create(ringStart * rad * Math.cos(ang), ringStart * rad * Math.sin(ang), z);
        var v2 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), z);
        var v3 = vec4.create(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z);

        var v4 = vec4.create(ringStart * rad * Math.cos(ang - angInc), ringStart * rad * Math.sin(ang - angInc), z);
        var v5 = vec4.create(ringStart * rad * Math.cos(ang),ringStart * rad * Math.sin(ang), z);
        var v6 = vec4.create(rad * Math.cos(ang), rad * Math.sin(ang), z);
        
        var v7 = vec4.create(ringStart * rad * Math.cos(ang),ringStart * rad * Math.sin(ang), z);
        var v8 = vec4.create(ringStart * rad * Math.cos(ang),ringStart * rad * Math.sin(ang), -z);
        var v9 = vec4.create(ringStart * rad * Math.cos(ang + angInc), ringStart * rad * Math.sin(ang + angInc), z)

        var i1 = vec4.create(ringStart * rad * Math.cos(ang),ringStart * rad * Math.sin(ang), -z);
        var i2 = vec4.create(ringStart * rad * Math.cos(ang + angInc),ringStart * rad * Math.sin(ang+ angInc), z);
        var i3 = vec4.create(ringStart * rad * Math.cos(ang + angInc),ringStart * rad * Math.sin(ang + angInc), -z);
        
        var iNorm = [ringStart * rad * Math.cos(ang),ringStart * rad * Math.sin(ang), 0]


        vertices.push(
            v1[0], v1[1], v1[2],
            v2[0], v2[1], v2[2],
            v3[0], v3[1], v3[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)

        vertices.push(
            v4[0], v4[1], v4[2],
            v5[0], v5[1], v5[2],
            v6[0], v6[1], v6[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)

        vertices.push(
            v7[0], v7[1], v7[2],
            v8[0], v8[1], v8[2],
            v9[0], v9[1], v9[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)

        vertices.push(
            v7[0], v7[1], v7[2],
            v8[0], v8[1], v8[2],
            v9[0], v9[1], v9[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(iNorm[0], iNorm[1], iNorm[2], iNorm[0], iNorm[1], iNorm[2], iNorm[0], iNorm[1], iNorm[2])
        // normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)

        
        vertices.push(
            i1[0], i1[1], i1[2],
            i2[0], i2[1], i2[2],
            i3[0], i3[1], i3[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        // normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)
        normals.push(iNorm[0], iNorm[1], iNorm[2], iNorm[0], iNorm[1], iNorm[2], iNorm[0], iNorm[1], iNorm[2])
        

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

        // var newV7 = vec4.create()
        // mat.multiplyP4(newV7, rotateRingInner, v7)
        // var newV8 = vec4.create()
        // mat.multiplyP4(newV8, rotateRingInner, v8)
        // var newV9 = vec4.create()
        // mat.multiplyP4(newV9, rotateRingInner, v9)

        vertices.push(
            newV1[0], newV1[1], newV1[2],
            newV2[0], newV2[1], newV2[2],
            newV3[0], newV3[1], newV3[2]
        )

        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5);
        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);

        vertices.push(
            newV4[0], newV4[1], newV4[2],
            newV5[0], newV5[1], newV5[2],
            newV6[0], newV6[1], newV6[2]
        )

        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5);
        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);

        // vertices.push(
        //     newV7[0], newV7[1], newV7[2],
        //     newV8[0], newV8[1], newV8[2],
        //     newV9[0], newV9[1], newV9[2]
        // )
        // var norm = [rad * Math.cos(ang + angInc / 2), rad * Math.sin(ang + angInc / 2), 0];
        // //TODO bad normals
        // colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5);
        // normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);



        const cStart = 0.32
        const cEnd = 0.42

        var c1 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
        var c2 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);
        var c3 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), z);

        var c4 = vec4.create(cStart * rad * Math.cos(ang - angInc), cStart * rad * Math.sin(ang - angInc), z);
        var c5 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
        var c6 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);

         

        vertices.push(
            c1[0], c1[1], c1[2],
            c2[0], c2[1], c2[2],
            c3[0], c3[1], c3[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)

        vertices.push(
            c4[0], c4[1], c4[2],
            c5[0], c5[1], c5[2],
            c6[0], c6[1], c6[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1)

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

        vertices.push(
            newC1[0], newC1[1], newC1[2],
            newC2[0], newC2[1], newC2[2],
            newC3[0], newC3[1], newC3[2]
        )

        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5);
        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);

        vertices.push(
            newC4[0], newC4[1], newC4[2],
            newC5[0], newC5[1], newC5[2],
            newC6[0], newC6[1], newC6[2]
        )

        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5);
        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);


        var j1 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), z);
        var j2 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), -z);
        var j3 = vec4.create(cStart * rad * Math.cos(ang + angInc), cStart * rad * Math.sin(ang + angInc), z);

        var j4 = vec4.create(cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), -z);
        var j5 = vec4.create(cStart * rad * Math.cos(ang  + angInc), cStart * rad * Math.sin(ang  + angInc), z);
        var j6 = vec4.create(cStart * rad * Math.cos(ang + angInc), cStart * rad * Math.sin(ang + angInc), -z);

        var jNorm = [cStart * rad * Math.cos(ang), cStart * rad * Math.sin(ang), 0]

        vertices.push(
            j1[0], j1[1], j1[2],
            j2[0], j2[1], j2[2],
            j3[0], j3[1], j3[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2])

        vertices.push(
            j4[0], j4[1], j4[2],
            j5[0], j5[1], j5[2],
            j6[0], j6[1], j6[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2])



        var j7 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), z);
        var j8 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), -z);
        var j9 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), z);

        var j10 = vec4.create(cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), -z);
        var j11 = vec4.create(cEnd * rad * Math.cos(ang  + angInc), cEnd * rad * Math.sin(ang  + angInc), z);
        var j12 = vec4.create(cEnd * rad * Math.cos(ang + angInc), cEnd * rad * Math.sin(ang + angInc), -z);

        jNorm = [cEnd * rad * Math.cos(ang), cEnd * rad * Math.sin(ang), 0]


        vertices.push(
            j7[0], j7[1], j7[2],
            j8[0], j8[1], j8[2],
            j9[0], j9[1], j9[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2])

        vertices.push(
            j10[0], j10[1], j10[2],
            j11[0], j11[1], j11[2],
            j12[0], j12[1], j12[2]
        )
        colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
        normals.push(jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2], jNorm[0], jNorm[1], jNorm[2])













        ang += angInc;
    }




    var r;


    //Flip for back?
    for (r = 0; r < 2; r++) {
        ang = 0;
        var drawTooth = false;

        for (i = 0; i < n; i++) { // face of the teeth
            drawTooth = !drawTooth;
            if (drawTooth) {
                //Insert two triangles representing square of tooth face.

                vertices.push(rad * Math.cos(ang), rad * Math.sin(ang), z,
                    rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z,
                    outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z)

                colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)

                if (z > 0)
                    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
                else
                    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);

                vertices.push(rad * Math.cos(ang), rad * Math.sin(ang), z,
                    outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z,
                    outRad * Math.cos(ang), outRad * Math.sin(ang), z);


                colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)

                //Push correct normals for side...
                if (z > 0)
                    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
                else
                    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);

            }
            ang += angInc;
        }
        z = -z;
    }

    z = -z;




    ang = 0; // coin edge
    var drawTooth = true;
    for (i = 0; i < n; i++) {
        drawTooth = !drawTooth;
        var norm = [rad * Math.cos(ang + angInc / 2), rad * Math.sin(ang + angInc / 2), 0];
        if (drawTooth) {

            vertices.push(
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z)

            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])

            vertices.push(
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z,
                rad * Math.cos(ang), rad * Math.sin(ang), z)

            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])
        }

        ang += angInc;
    }



    var tRad = rad * 1.15
    var tStepIn = 0.05
    ang = 0;
    drawTooth = false; // tooth roof
    for (i = 0; i < n; i++) {
        drawTooth = !drawTooth;
        if (drawTooth) {

            //XYZ of center of tooth roof
            var norm = [outRad * Math.cos(ang + angInc / 2), outRad * Math.sin(ang + angInc / 2), 0];
            vertices.push(
                outRad * Math.cos(ang), outRad * Math.sin(ang), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z)

            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])

            vertices.push(
                outRad * Math.cos(ang), outRad * Math.sin(ang), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), z)

            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])



            //NORTH angle face
            vertices.push(
                outRad * Math.cos(ang), outRad * Math.sin(ang), -z,
                outRad * Math.cos(ang + angInc ) + tStepIn, tRad * Math.sin(ang + angInc ), -z -
                 tStepIn,
                outRad * Math.cos(ang + angInc) + tStepIn, tRad * Math.sin(ang + angInc ), z + tStepIn,
            )

            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])



        }
        ang += angInc;
    }

    ang = 0;




    drawTooth = false;
    for (i = 0; i < n; i++) { // tooth walls
        drawTooth = !drawTooth;
        if (drawTooth) {


            var norm = calcNormal(rad * Math.cos(ang), rad * Math.sin(ang), -z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), -z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), z);

            vertices.push(
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), -z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), z)
            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])


            vertices.push(
                rad * Math.cos(ang), rad * Math.sin(ang), -z,
                outRad * Math.cos(ang), outRad * Math.sin(ang), z,
                rad * Math.cos(ang), rad * Math.sin(ang), z)
            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])

            var norm = calcNormal(rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z);

            vertices.push(
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z)
            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])


            vertices.push(
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), -z,
                outRad * Math.cos(ang + angInc), outRad * Math.sin(ang + angInc), z,
                rad * Math.cos(ang + angInc), rad * Math.sin(ang + angInc), z)
            colors.push(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
            normals.push(norm[0], norm[1], norm[2], norm[0], norm[1], norm[2], norm[0], norm[1], norm[2])


        }
        ang += angInc;
    }










    return [vertices, colors, normals]
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