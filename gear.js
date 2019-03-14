main();


function main() {

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl', {
    antialias: true
  });

  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }


  var angle_x = 0;
  var angle_y = 0;

  // Vertex shader program, runs on GPU, once per vertex

  const vsSource = `
    // Vertex Shader
    precision mediump int;
    precision mediump float;
    
    // Scene transformations
    uniform mat4 u_PVM_transform; // Projection, view, model transform
    uniform mat4 u_VM_transform;  // View, model transform
    
    // Light model
    uniform vec3 u_Light_position;
    uniform vec3 u_Light_color;
    uniform float u_Shininess;
    uniform vec3 u_Ambient_color;
    
    // Original model data
    attribute vec3 a_Vertex;
    attribute vec3 a_color;
    attribute vec3 a_Vertex_normal;
    
    // Data (to be interpolated) that is passed on to the fragment shader
    // Interpolated
    varying vec3 v_Vertex;
    varying vec4 v_Color;
    varying vec3 v_Normal;
    
    void main() {
    
      // Perform the model and view transformations on the vertex and pass this
      // location to the fragment shader.
      v_Vertex = vec3( u_VM_transform * vec4(a_Vertex, 1.0) );
    
      // Perform the model and view transformations on the vertex's normal vector
      // and pass this normal vector to the fragment shader.
      v_Normal = vec3( u_VM_transform * vec4(a_Vertex_normal, 0.0) );
    
      // Pass the vertex's color to the fragment shader.
      v_Color = vec4(a_color, 1.0);
    
      // Transform the location of the vertex for the rest of the graphics pipeline
      gl_Position = u_PVM_transform * vec4(a_Vertex, 1.0);
    }
  `;

  // Fragment shader program, runs on GPU, once per potential pixel

  const fsSource = `
    // Fragment shader program
    precision mediump int;
    precision mediump float;
    
    // Light model
    uniform vec3 u_Light_position;
    uniform vec3 u_Light_color;
    uniform float u_Shininess;
    uniform vec3 u_Ambient_color;
    uniform float u_Diffuse_Factor;
    
    // Data coming from the vertex shader
    varying vec3 v_Vertex;
    varying vec4 v_Color;
    varying vec3 v_Normal;
    
    void main() {
    
      vec3 to_light;
      vec3 vertex_normal;
      vec3 reflection;
      vec3 to_camera;
      float cos_angle;
      vec3 diffuse_color;
      float diffuse_factor;
      vec3 specular_color;
      vec3 ambient_color;
      vec3 color;
    
      // Calculate the ambient color as a percentage of the surface color
      ambient_color = u_Ambient_color * vec3(v_Color);
      diffuse_factor = u_Diffuse_Factor;
    
      // Calculate a vector from the fragment location to the light source
      to_light = u_Light_position - v_Vertex;
      to_light = normalize( to_light );
    
      // The vertex's normal vector is being interpolated across the primitive
      // which can make it un-normalized. So normalize the vertex's normal vector.
      vertex_normal = normalize( v_Normal );
    
      // Calculate the cosine of the angle between the vertex's normal vector
      // and the vector going to the light.
      cos_angle = dot(vertex_normal, to_light);
      cos_angle = clamp(cos_angle, 0.0, 1.0);
    
      // Scale the color of this fragment based on its angle to the light.
      diffuse_color = vec3(v_Color) * cos_angle * diffuse_factor;
    
      // Calculate the reflection vector
      reflection = 2.0 * dot(vertex_normal,to_light) * vertex_normal - to_light;
    
      // Calculate a vector from the fragment location to the camera.
      // The camera is at the origin, so negating the vertex location gives the vector
      to_camera = -1.0 * v_Vertex;
    
      // Calculate the cosine of the angle between the reflection vector
      // and the vector going to the camera.
      reflection = normalize( reflection );
      to_camera = normalize( to_camera );
      cos_angle = dot(reflection, to_camera);
      cos_angle = clamp(cos_angle, 0.0, 1.0);
      cos_angle = pow(cos_angle, u_Shininess);
    
      // The specular color is from the light source, not the object
      if (cos_angle > 0.0) {
        specular_color = u_Light_color * cos_angle;
        diffuse_color = diffuse_color * (1.0 - cos_angle);
      } else {
        specular_color = vec3(0.0, 0.0, 0.0);
      }
    
      color = ambient_color + diffuse_color + specular_color;
    
      gl_FragColor = vec4(color, v_Color.a);
    }
  `;

  // Initialize a shader program; this is where all 
  // the lighting for the objects, if any, is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Tell WebGL to use our program when drawing
  gl.useProgram(shaderProgram);

  // Collect all the info needed to use the shader program.
  // Look up locations of attributes and uniforms used by
  // our shader program  
  const programInfo = {
    program: shaderProgram,
    locations: {
      a_vertex: gl.getAttribLocation(shaderProgram, 'a_Vertex'),
      a_color: gl.getAttribLocation(shaderProgram, 'a_color'),
      a_normal: gl.getAttribLocation(shaderProgram, 'a_Vertex_normal'),
      u_PVM_transform: gl.getUniformLocation(shaderProgram, 'u_PVM_transform'),
      u_VM_transform: gl.getUniformLocation(shaderProgram, 'u_VM_transform'),
      u_Light_position : gl.getUniformLocation(shaderProgram, 'u_Light_position'),
      u_Light_color: gl.getUniformLocation(shaderProgram, 'u_Light_color'),
      u_Shininess: gl.getUniformLocation(shaderProgram, 'u_Shininess'),
      u_Ambient_color: gl.getUniformLocation(shaderProgram, 'u_Ambient_Color'),
      u_Diffuse_Factor: gl.getUniformLocation(shaderProgram, 'u_Diffuse_Factor')
    },
  };

  // add an event handler so we can interactively rotate the model
  document.addEventListener('keydown',
    function key_event(event) {

      if (event.keyCode == 37) { //left
        angle_y -= 3;
      } else if (event.keyCode == 38) { //top
        angle_x -= 3;
      } else if (event.keyCode == 39) { //right
        angle_y += 3;
      } else if (event.keyCode == 40) { //bottom
        angle_x += 3;
      }

      drawScene(gl, programInfo, gears, angle_x, angle_y);
      return false;
    })
  const cylinder = {
    toothCount: 15,
    spokeCount: 0,
    r1: 0,
    r2: 1,
    spokeRad: 0,
    outerThickness: 7,
    innerThickness: 7,
    teethHeight: 0,
    outerColor: METAL0,
    innerColor: METAL1,
    toothOuterColor: METAL3,
    toothInnerColor: METAL2,
    dullness: 4,
    noRoof: true,
    spokeOptions: false,
    createRings: false
  }

  const base = {
    toothCount: 15,
    spokeCount: 0,
    r1: 0,
    r2: 1,
    r3: .9,
    r4: 1,
    spokeRad: 0,
    outerThickness: .1,
    innerThickness: .1,
    teethHeight: 0,
    outerColor: BLUE,
    innerColor: METAL3,
    toothOuterColor: METAL3,
    toothInnerColor: METAL2,
    dullness: 4,
    noRoof: true,
    spokeOptions: false,
    createRings: false
  }
  const buff0 = initBuffers(gl, programInfo, scottGear(METAL_GEAR))
  const buff1 = initBuffers(gl, programInfo, scottGear(OOF_GEAR))
  const buff2 = initBuffers(gl, programInfo, createBMathewGear(30, 8, 70, 70, 85, 95, 5, 5, 5, METAL0[0], METAL0[1], METAL0[2]))
  const buff3 = initBuffers(gl, programInfo, createOxfordGear(30, 10, 500, 7, 5, .25, METAL3[0] * 255, METAL3[1] * 255, METAL3[2] * 255))
  const buff4 = initBuffers(gl, programInfo, osbornemGear(10, 10))
  const buff5 = initBuffers(gl, programInfo, tovarGear(30, 4))
  const buff6 = initBuffers(gl, programInfo, scottGear(cylinder))
  const buff7 = initBuffers(gl, programInfo, scottGear(cylinder))
  const buff8 = initBuffers(gl, programInfo, scottGear(METAL_SKINNY))
  const buff9 = initBuffers(gl, programInfo, scottGear(base))

  //TODO use an array instead
  const gears = {
    gear0: {
      buffers: buff0,
      scale: [.25, .25, .25],
      translate: [.3766, .375, -.1],
      z_rot: 0,
      z_inc: 0.15,
    },
    gear1: {
      buffers:  buff1,
      scale: [.25, .25, .25],
      translate: [0, 0, 0],
      z_rot: 0,
      z_inc: -0.15
    },
    gear2: {
      buffers: buff2,
      scale: [.45, .45, .45],
      translate: [-.525, 0.525, 0],
      z_rot: 0,
      z_inc: 0.101
    },
    gear3: {
      buffers: buff3, //oxford
      scale: [.25, .25, .25],
      translate: [-.2, .375, .75],
      z_rot: 0,
      z_inc: -0.15
    },
    gear4: {
      buffers: buff4, //osborne
      scale: [.1, .1, .1],
      translate: [-.19050, -.03, .75],
      z_rot: 0,
      z_inc: 0.465
    },
    gear5: {
      buffers: buff5,
      scale: [.25, .25, .25],
      translate: [.3766, .375, .75],
      z_rot: 0,
      z_inc: .15
    },
    gear6: {
      buffers: buff6,
      scale: [.06, .06, .06],
      translate: [.3766, .375, .35],
      z_rot: 0,
      z_inc: 0.15,
    },
    gear7: {
      buffers: buff7,
      scale: [.06, .06, .06],
      translate: [-.19050, -.03, .75 + .4],
      z_rot: 0,
      z_inc: 0.465,
    },
    gear8: {
      buffers: buff9,
      scale: [2, 2, 2],
      translate: [0, -1, 0],
      z_rot: 0,
      z_inc: 0,
      x_rot: 90
    }
  }

  var sawZ = 0.8
  for (let i = 9; i < 9 + 26; i++) {
    const rot = Math.floor(i % 2) === 0 ? 0.465 : -0.465
    const gear = {
      buffers: buff8,
      scale: [.07, .07, .07],
      translate: [-.1905, -.03, sawZ],
      z_rot: 0,
      z_inc: rot
    }
    gears['gear' + i] = gear
    sawZ += 0.03
  }


  var lookat = 0

  const C_STEPS = 500
  var cStep = 1 / C_STEPS
  var lStep = 0.00165
  const ambient = [1, 1, 1]
  var t = 0
  const STEPS = 800
  const dStep = 1/ (STEPS / 2)
  var diffuse = 0
  self.animate = function () {
    t++
    if (t > STEPS) {
      t = 0
    }
    if (diffuse < 1) {
      diffuse += dStep
    }
    
    console.log(diffuse)
    var camera_location = [0,0,0];

    var control_points = [
                           [-7, -7,  1],
                           [-7, 3,   1],
                           [3, 4.5, 5],
                           [8, 3,  10],                                                                           
                         ];
  

    
     // t/100.0
     var cp;
  
    //y = (1 − t)3, green: y= 3(1 − t)2 t, red: y= 3(1 − t) t2, and cyan: y = t3
  
     function weight(t) {
         return [  Math.pow(1-t,3), 3*Math.pow(1-t,2)*t, 3*(1-t)*Math.pow(t,2), Math.pow(t,3) ];
     }
  
     weights = weight(t/1000);
     
     for (cp = 0; cp < 4; cp++ ) {
           
           camera_location[0] += weights[cp] * control_points[cp][0];
           camera_location[1] += weights[cp] * control_points[cp][1];
           camera_location[2] += weights[cp] * control_points[cp][2];
  
    }    
    for (const key in gears) {
      const gear = gears[key]
      gear.z_rot += gear.z_inc
    }
    var col = ambient[0]
    if (col <= 0 || col >= 1) {
      cStep = -cStep
    }

    // camera_location = [0, 3, 5]
    ambient[0] += cStep
    ambient[2] += cStep / 2
    // lookat += lStep;
    // if (lookat > 2.25 || lookat <= -2.25) {
    //   lStep = -lStep
    // }
    // Draw the scene
    //Angle_x/y reserved for user rotation
    drawScene(gl, programInfo, gears, angle_x, angle_y, camera_location, diffuse);
    requestAnimationFrame(self.animate)
  }

  self.animate()
}



/**
 *  Initialize the buffers we'll need. For this demo, we just
 *  have one object -- a simple two-dimensional square.
 */
function initBuffers(gl, programInfo, gearData) {
  const vertices = gearData[0];
  const colors = gearData[1];
  const normals = gearData[2];

  // Create  buffers for the object's vertex positions
  const vertexBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Now pass the list of vertices to the GPU to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW);


  // do likewise for colors
  const colorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW);


  const normalBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(normals),
    gl.STATIC_DRAW);

  return {
    // each vertex in buffer has 3 floats
    num_vertices: vertices.length / 3,
    vertex: vertexBuffer,
    color: colorBuffer,
    normal: normalBuffer
  };

}


function enableAttributes(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  // Tell WebGL how to pull vertex positions from the vertex
  // buffer. These positions will be fed into the shader program's
  // "a_vertex" attribute.

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
  gl.vertexAttribPointer(
    programInfo.locations.a_vertex,
    numComponents,
    type,
    normalize,
    stride,
    offset);
  gl.enableVertexAttribArray(
    programInfo.locations.a_vertex);


  // likewise connect the colors buffer to the "a_color" attribute
  // in the shader program
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.locations.a_color,
    numComponents,
    type,
    normalize,
    stride,
    offset);
  gl.enableVertexAttribArray(
    programInfo.locations.a_color);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.locations.a_normal,
    numComponents,
    type,
    normalize,
    stride,
    offset);
  gl.enableVertexAttribArray(
    programInfo.locations.a_normal);

}


//
// Draw the scene.
//
function drawScene(gl, programInfo, gears, angle_x, angle_y, cam, diffuse) {
  const matrix = new Learn_webgl_matrix();
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Clear to white, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  for (const key in gears) {

    //make transform to implement interactive rotation
    const rotate_x_matrix = matrix.create();
    const rotate_y_matrix = matrix.create();
    matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
    matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);


    const gear = gears[key]
    const buffers = gear.buffers

    const s = gear.scale ? gear.scale : [1, 1, 1]
    const t = gear.translate ? gear.translate : [0, 0, 0]
    const z = gear.z_rot ? gear.z_rot : 0
    const x = gear.x_rot ? gear.x_rot : 0


    //make z rotation transform
    const rotate_z_matrix = matrix.create();
    matrix.rotate(rotate_z_matrix, z, 0, 0, 1);

    if (gear.x_rot) {
      matrix.rotate(rotate_x_matrix, gear.x_rot, 1, 0, 0)
    }    

    //make gear scale transform
    const scale = matrix.create();
    matrix.scale(scale, s[0], s[1], s[2]);
    
    //make gear translate transform
    const translate = matrix.create()
    matrix.translate(translate, t[0], t[1], t[2])

    //make lookat
    const lookat = matrix.create()
    matrix.lookAt(lookat, cam[0], cam[1], cam[2], 0, 0, 0, 0, 1, 0);
    

    //make projection matrix
    const proj = matrix.createFrustum(-1, 1, -1, 1, 3, 300);  

    
    //Create the PVM transformation
    matrix.multiplySeries()
    const pvm_transform = matrix.create(); 
    matrix.multiplySeries(pvm_transform, proj, lookat, translate, rotate_x_matrix,
      rotate_y_matrix, rotate_z_matrix, scale);
    gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform,
      false, pvm_transform);

    const vm_transform = matrix.create()
    matrix.multiplySeries(vm_transform, lookat, rotate_x_matrix,
      rotate_y_matrix, rotate_z_matrix, scale)
    gl.uniformMatrix4fv(programInfo.locations.u_VM_transform,
      false, vm_transform);

    enableAttributes(gl, buffers, programInfo)
    
    // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffers.num_vertices);
    
  }
  gl.uniform3f(programInfo.locations.u_Light_position, 4, 8, 3);
  gl.uniform1f(programInfo.locations.u_Shininess, 18);
  gl.uniform1f(programInfo.locations.u_Diffuse_Factor, diffuse)
  gl.uniform3f(programInfo.locations.u_Light_color,  1, 1, 1);

}

//
// Initialize a shader program, so WebGL knows how to draw our data
// BOILERPLATE CODE, COPY AND PASTE
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.  BOILERPLATE CODE, COPY AND PASTE
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}