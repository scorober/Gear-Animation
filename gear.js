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
  var angle_z = 0;


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
      vec3 specular_color;
      vec3 ambient_color;
      vec3 color;
    
      // Calculate the ambient color as a percentage of the surface color
      ambient_color = u_Ambient_color * vec3(v_Color);
    
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
      diffuse_color = vec3(v_Color) * cos_angle;
    
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
      u_Ambient_color: gl.getUniformLocation(shaderProgram, 'u_Ambient_Color')
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

      drawScene(gl, programInfo, buffers, angle_x, angle_y, angle_z,);
      return false;
    })


  // build the object(s) we'll be drawing, put the data in buffers
  const buffers = initBuffers(gl, programInfo);

  enableAttributes(gl, buffers, programInfo)

  var lookat = 0
  var lStep = 0.0165
  self.animate = function () {
    angle_x += .15
    angle_z += .15
    angle_y += .15
    lookat += lStep;
    if (lookat > 3) {
      lStep = -lStep
    }
    if (lookat <= -3) {
      lStep = -lStep;
    }

    // Draw the scene
    drawScene(gl, programInfo, buffers, angle_x, angle_y, angle_z, lookat);
    requestAnimationFrame(self.animate)
  }

  self.animate()


}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl, programInfo) {



  //See scottGear() for example options and defaults. 

  //Create your own options here!
  const options = {
    toothCount: 54,
    spokeCount: 16,
    r1: 0.15,
    r2: 0.32,
    spokeRad: 0.03,
    outerThickness: .1,
    innerThickness: .06,
    teethHeight: .03,
    // outerColor: METAL0,
    // innerColor: METAL1,
    // toothOuterColor: METAL3,
    // toothInnerColor: METAL2,
    dullness: 4,
    noRoof: true
  }

  gearData = scottGear(METAL_GEAR);
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
function drawScene(gl, programInfo, buffers, angle_x, angle_y, angle_z, la) {
  const matrix = new Learn_webgl_matrix();
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Clear to white, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  
  // const vm_transform = matrix.create();

  //make transform to implement interactive rotation
  const rotate_x_matrix = matrix.create();
  const rotate_y_matrix = matrix.create();
  const rotate_z_matrix = matrix.create();
  
  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);
  matrix.rotate(rotate_z_matrix, angle_z, 0, 0, 1);

  //make scale transform
  const scale = matrix.create();
  matrix.scale(scale, 0.8, 0.8, 0.8);

  //make lookat
  const lookat = matrix.create()
  matrix.lookAt(lookat, 0, la, 5, 0, la, 0, 0, 1, 0);

  //make projection matrix
  const proj = matrix.createOrthographic(-1, 1, -1, 1, 3, 7)
  
  //Create the PVM transformation
  matrix.multiplySeries()
  const pvm_transform = matrix.create(); 
  matrix.multiplySeries(pvm_transform, proj, lookat, rotate_z_matrix, rotate_x_matrix,
    rotate_y_matrix, scale);
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform,
    false, pvm_transform);

  const vm_transform = matrix.create()
  matrix.multiplySeries(vm_transform, lookat, rotate_x_matrix,
    rotate_y_matrix, scale)
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform,
    false, vm_transform);

  gl.uniform3f(programInfo.locations.u_Light_position, 2, 2, 6);
  gl.uniform3f(programInfo.locations.u_Light_color, 1, 1, 1);
  gl.uniform3f(programInfo.locations.u_Ambient_color, 1, 1, 1);
  gl.uniform1f(programInfo.locations.u_Shininess, 15);
  
  { // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffers.num_vertices);
  }
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