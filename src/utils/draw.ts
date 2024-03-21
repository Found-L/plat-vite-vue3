import * as THREE from 'three';

// 绘制图形
export function draw() {
  // 被组合式函数封装和管理的状态
  const x: Ref<number> = ref(0)
  const y: Ref<number> = ref(0)

  // 通过返回值暴露所管理的状态
  return { x, y }
}

//绘制网格线条
const drawLine = (obj) => {
  let { line, color, position, margin, num } = obj
  let geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //3个为一组，表示一个顶点的xyz坐标
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(line, 3))
  // 线条渲染模式
  let material = new THREE.LineBasicMaterial({
      color, //线条颜色
  });//材质对象
  let LineList = [];
  let modelLine = new THREE.Line(geometry, material);//线条模型对象
  LineList.push(modelLine)
  for (let i = 1; i < num; i++) {
      let lineChildren = modelLine.clone()['translate' + position](i * margin)
      LineList.push(lineChildren);
  }
  return LineList
}
const drawPlan = (obj) => {
  const { size, color } = obj;
  let geometry = new THREE.PlaneGeometry(size, 360); //创建一个Buffer类型几何体对象
  geometry.rotateX(Math.PI / 2).translate(size/2, 0, 180);
  // 三角面(网格)渲染模式
  let material = new THREE.MeshBasicMaterial({
      color, //三角面颜色
      transparent: true,//透明
      opacity: 0.2,
      side: THREE.DoubleSide, //两面可见
  }); //材质对象
  let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  mesh.name = 'plan';
  //scene.add(mesh);
  return mesh
}

// 绘制柱子


// 绘制散点


