<template>
  <div class="login-container">
    <div ref="canvas" class="canvas"></div>

    <Stats />
  </div>
  
</template>
<script setup lang="ts">
  // import { ref, onMounted } from 'vue'
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { draw } from '@/utils/draw'

  // import Stats  from '@components/stats.vue'

  
  const canvas = ref<HTMLElement | null>(null);
  let scene: THREE.Scene;
  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let cube: THREE.Mesh;

  // 随机6400数组
  const dataList = ref<Array<any>>([])
  // 图形类型
  const chartType = ref<String | null>('PRPS');
  
  function generateRandomArray(length: number, min: number, max: number): number[] {
    const randomArray: number[] = [];
    for (let i = 0; i < length; i++) {
      // const randomNum: number = Math.floor(Math.random() * (max - min + 1)) + min;
      const randomNum: number = parseFloat((Math.random() * (max - min) + min).toFixed(1));
      randomArray.push(randomNum);
    }
    return randomArray;
  }

  function updateRandomArray() {
  setInterval(() => {
      dataList.value = generateRandomArray(6400, -80, 0);
      // console.log(dataList.value);
    }, 1000); // 每秒更新一次
  }

  updateRandomArray();

  onMounted(() => {
    initThree();
    createCube();
    renderScene();
  });

  const initThree = () => {
    const el = canvas.value as HTMLElement; 
    const width = el.getBoundingClientRect().width;
    const height = el.getBoundingClientRect().height;

    scene = new THREE.Scene();
    // 创建线性渐变色背景
    const colorTop = new THREE.Color(0x00aaff); // 设置顶部颜色为蓝色
    const colorBottom = new THREE.Color(0x998866); // 设置底部颜色为橙色

    const gradientTexture = new THREE.CanvasTexture(generateGradientTexture(colorTop, colorBottom));
    scene.background = gradientTexture; // 应用线性渐变色作为背景


    var k = width / height; //窗口宽高比
    var s = 500; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    camera = new THREE.OrthographicCamera(-s * k, s * k, s * k, -s, 1, 1000);
    
    renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, antialias: true, preserveDrawingBuffer: true, });
    // logarithmicDepthBuffer - 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用
    // antialias - 是否执行抗锯齿。默认为false.
    // preserveDrawingBuffer -是否保留缓直到手动清除或被覆盖。 默认false.

    renderer.localClippingEnabled = true; // 定义渲染器是否考虑对象级剪切平面。 默认为false.
    renderer.setPixelRatio( window.devicePixelRatio ) //设置设备像素比。通常用于避免HiDPI设备上绘图模糊

    renderer.setSize(width, height);
    el.appendChild(renderer.domElement);

  };

  // 生成渐变贴图
  function generateGradientTexture(colorTop: THREE.Color, colorBottom: THREE.Color): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, colorTop.getStyle());
        gradient.addColorStop(1, colorBottom.getStyle());

        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 256);
    }

    return canvas;
  }

  // 绘制元素生成
  const createCube = () => {
    const geometry = new THREE.BoxGeometry(100, 100, 100 );
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.set(500, 200, 500); //设置相机位置

    const axesHelper = new THREE.AxesHelper( 500 );
    // 场景添加  图形属性
    scene.add( axesHelper );

    // const gridHelper = new THREE.GridHelper(500, 5 ); // 参数分别为网格大小和网格分割数
    const gridHelper = new THREE.GridHelper(500, 5, 0xffffff, 0xffffff); // 创建 500 长度的网格，X 方向分成 5 格，Y 方向分成 4 格
    gridHelper.position.set(250, 0, 250); // 将 XZ 平面移动到 z=5 的位置
    scene.add(gridHelper);


    // 创建 XZ 平面并添加网格
    const xzPlane = new THREE.GridHelper(500, 4);
    xzPlane.rotation.z = Math.PI / 2;
    xzPlane.position.set(0, 250, 250); // 将 XZ 平面移动到 z=5 的位置
    scene.add(xzPlane);


    const ss = draw();
    console.log(ss)

    // 场景添加  图形属性
    // scene.add( axesHelper );

    // 控制器
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true; // 增加旋转阻尼感
    controls.enablePan = false;  // 启用或禁用摄像机平移，默认为true。
    // controls.enableZoom = false; //启用或禁用摄像机的缩放。
    // 设置左右方向的最大、最小角度限制为 90 度和 0 度
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = Math.PI / 2;
    // 设置上下方向的最大、最小角度限制为 90 度和 0 度
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    //设置放大缩小上下限
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    //设置控制器中心点
    // controls.target.set(25, 0, 180);

  };

  const renderScene = () => {
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  };
  
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background-color: #fff;
    
    .canvas{
      width:50vw;
      height:37.5vw;
      min-width:400px;
      min-height:300px;
    }
  }
</style>