import * as THREE from 'three';

export function initShader() {
  const canvas = document.getElementById('shader-canvas') as HTMLCanvasElement;
  const parent = canvas?.parentElement;
  if (!canvas || !parent) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(parent.clientWidth, parent.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(parent.clientWidth, parent.clientHeight) },
    u_mouse: { value: new THREE.Vector2(0, 0) }
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 vUv;

    // Simplex noise function (Ashima Arts)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      
      // Handle aspect ratio
      st.x *= u_resolution.x / u_resolution.y;

      vec2 mouse = u_mouse.xy / u_resolution.xy;
      mouse.x *= u_resolution.x / u_resolution.y;

      // Mouse interaction
      float dist = distance(st, mouse);
      float interaction = smoothstep(0.5, 0.0, dist);
      
      // Create large fluid shapes, displaced by mouse interaction
      vec2 pos = st * 1.5;
      pos += interaction * 0.3; // Push fluid away from mouse
      
      float n1 = snoise(pos + u_time * 0.1);
      float n2 = snoise(pos + vec2(u_time * 0.15, -u_time * 0.1) - interaction * 0.4);
      float n3 = snoise(pos + vec2(-u_time * 0.05, u_time * 0.2) + interaction * 0.2);

      // Colors inspired by the reference image
      vec3 colYellow = vec3(1.0, 0.95, 0.4);
      vec3 colCyan = vec3(0.4, 0.9, 0.95);
      vec3 colGreen = vec3(0.55, 0.95, 0.55);
      vec3 colLight = vec3(0.85, 0.95, 1.0);
      vec3 colHover = vec3(1.0, 0.5, 0.7); // Add a warm pink glow around the mouse

      // Mix colors using noise
      vec3 color = mix(colLight, colYellow, smoothstep(-0.6, 0.6, n1));
      color = mix(color, colCyan, smoothstep(0.0, 1.2, n2));
      color = mix(color, colGreen, smoothstep(0.3, 1.0, n3));
      
      // Mix in hover effect
      color = mix(color, colHover, interaction * 0.6);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  window.addEventListener('resize', () => {
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    uniforms.u_resolution.value.set(parent.clientWidth, parent.clientHeight);
  });

  window.addEventListener('mousemove', (e) => {
    // Determine the mouse position relative to the hero section bounding box
    const rect = parent.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
      
      const mouseX = e.clientX - rect.left;
      // WebGL coordinates y is inverted
      const mouseY = parent.clientHeight - (e.clientY - rect.top);
      uniforms.u_mouse.value.set(mouseX, mouseY);
    }
  });

  function animate(time: number) {
    uniforms.u_time.value = time * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
