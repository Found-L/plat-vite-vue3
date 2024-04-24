import * as THREE from 'three';
import { Lut } from 'three/examples/jsm/math/Lut';

let axis = new THREE.Group();

let meshList = new THREE.Group();//图例柱子
const dummy = new THREE.Object3D();
const dummyPoint = new THREE.Object3D();
meshList.name = 'chartsMesh';
let pointsList = new THREE.Group();//图例散点
pointsList.name = 'chartsPoint';
let axisTextGroup = new THREE.Group();
axisTextGroup.name = 'axisText';
let axisTextGroup2D = new THREE.Group();
axisTextGroup2D.name = 'axisText';


const lut = new Lut();
lut.addColorMap('axis', [[0.0, 0x00ee00], [0.25, 0xeeee00], [0.75, 0xee0000], [1.0, 0x4e0211]],);
lut.setColorMap('axis',1024)


// 绘制图形
export function drawAxis(scene:any, size:any, minNum:any) {
  // 被组合式函数封装和管理的状态
  const x: Ref<number> = ref(0)
  const y: Ref<number> = ref(0)

  scene.remove(...scene.children.filter(item => item.name === 'axisNumberText'))
  if (axis.children.length) {
      axis.remove(...axis.children)
  }
  let axisText = new THREE.Group();
  axisText.name = 'axisNumberText';
  scene.add(axisText)
  const data:{} = createAxisInfo(size, minNum);
  axis.scale.set(...data[size]['set'])
  meshList.scale.set(...data[size]['set'])
  pointsList.scale.set(...data[size]['set'])
  data[size]['prps'].forEach(async item => {
    console.log(item)
      switch (item.type) {
          case 'plan':
              axis.add(drawPlan(item));
              break;
          case 'line':
              axis.add(...drawLine(item));
              break;
          case 'curveLine':
              axis.add(drawSinLine(item));
              break;
          case 'text':
              axisText.add(draw2DText(item));
      }
  });
  scene.add(meshList, axis, pointsList, axisTextGroup);
  // 通过返回值暴露所管理的状态
  return
}

//绘制网格线条
const drawLine = (obj:any) => {
  let { line, color, position, margin, num } = obj
  let geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //3个为一组，表示一个顶点的xyz坐标
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(line, 3))
  // 线条渲染模式
  let material = new THREE.LineBasicMaterial({
      color, //线条颜色
  });//材质对象
  let LineList = [];
  let modelLine : any = new THREE.Line(geometry, material);//线条模型对象
  LineList.push(modelLine)
  for (let i = 1; i < num; i++) {
      let lineChildren = modelLine.clone()['translate' + position](i * margin)
      LineList.push(lineChildren);
  }
  return LineList
}
// 绘制网格面
const drawPlan = (obj:any) => {
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

//正弦曲线绘制
const drawSinLine = (obj:any) => {
  let { line, color } = obj, list = [];
  line.forEach(item => {
      list.push(new THREE.Vector3(...item));
  })
  let geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
  // 三维样条曲线  Catmull-Rom算法
  let curve = new THREE.CatmullRomCurve3(list);
  //getPoints是基类Curve的方法，返回一个vector3对象作为元素组成的数组
  let points = curve.getPoints(200); //分段数100，返回101个顶点
  // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
  geometry.setFromPoints(points);
  //材质对象
  let material = new THREE.LineBasicMaterial({
      color,
      linewidth: 1,
  });
  //线条模型对象
  let modelLine = new THREE.Line(geometry, material);
  return modelLine
  //scene.add(line); //线条对象添加到场景中
}

// 添加精灵图文字
const draw2DText = (obj:any) => {
  let scale = 1;//window.devicePixelRatio;
  let { content, w, h, color, font, xyz, size, cw, ch, rotate } = obj;
  cw = cw ? cw : 6;
  ch = ch ? ch : 8;
  let canvas: any = document.createElement('canvas')
  canvas.style.width = w * scale;
  canvas.style.height = h * scale;
  if (rotate) {
      canvas.width = w * cw * scale * 3;
      canvas.height = h * ch * scale * 2;
  } else {
      canvas.width = w * cw * scale * 2;
      canvas.height = h * ch * scale * 3;
  }

  let ctx: any = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000';
  ctx.font = font;
  ctx.direction = "ltr"; // 文本方向从左向右
  ctx.textAlign = "left"; // 左对齐
  ctx.textBaseline = 'middle'//基线对齐选项，决定文字垂直方向的对齐方式
  if (rotate) {
      ctx.translate(canvas.width / 2, canvas.height);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(content, h, 0);
      ctx.strokeText(content, h, 0);
  } else {
      for (let i = 0; i < 1; i++) {
          ctx.fillText(content[i], 0, canvas.height / 2);
          ctx.strokeText(content[i], 0, canvas.height / 2);
      }
  }
  let texture = new THREE.CanvasTexture(canvas)
  // texture.needsUpdate = true//如果编码类型在纹理已被一个材质使用之后发生了改变， 你需要来设置Material.needsUpdate为true来使得材质重新编译
  let geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //3个为一组，表示一个顶点的xyz坐标
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(xyz, 3));
  const material = new THREE.PointsMaterial({
      map: texture,
      transparent: true,//材质透明
      size: size ? size : 16.0, //点对象像素尺寸
  });

  const pointsText = new THREE.Points(geometry, material);
  pointsText.name = 'pointsText';
  return pointsText;
}

// 绘制柱子


// 绘制散点

// 点  线  面  坐标  网格
const createAxisInfo = (size:any, minSize = 0) => {
  const textY = minSize ? (360 / (size + (-minSize))) * minSize - 30 : -30;
  let data = {};
  let prps = [
      {
          type: 'plan',
          size: 50,
          color: 0x32494B,
      },
      {
          type: 'curveLine',
          line: [
              [0, minSize ? 0 : size / 2, 0],
              [0, minSize ? minSize : 0, 90],
              [0, size, 270],
              [0, minSize ? 0 : size / 2, 360],
          ],
          color: 0xffffff,
      },
      {
          type: 'line',
          line: [
              0, minSize, 0,
              0, size, 0,
              0, size, 360,
              0, minSize, 360,
              0, minSize, 0,

              0, 0, 0,
              50, 0, 0,
              50, 0, 360,
              0, 0, 360,
              0, 0, 0,

              // 0, minSize, 0,
              // 0, size, 0,
              // 50, size, 0,
              // 50, minSize, 0,
              // 0, minSize, 0,
          ],
          color: 0xffffff,
      },
      {
          type: 'line',
          line: [
              0, 0, 90,
              50, 0, 90,
          ],
          color: 0xffffff,
          position: 'Z',
          num: 3,
          margin: 90,
      },
      {
          type: 'line',
          line: [
              10, 0, 0,
              10, 0, 360,
          ],
          color: 0xffffff,
          position: 'X',
          num: 4,
          margin: 10,
      },
      {
          type: 'line',
          line: [
              0, (minSize ? minSize + (size / 2) : size / 4), 0,
              0, (minSize ? minSize + (size / 2) : size / 4), 360,
          ],
          color: 0xffffff,
          position: 'Y',
          num: 3,
          margin: minSize ? size / 2 : size / 4,
      },
      {
          type: 'line',
          line: [
              0, minSize, 90,
              0, size, 90,
          ],
          color: 0xffffff,
          position: 'Z',
          num: 3,
          margin: 90,
      },
      // {
      //     type: 'line',
      //     line: [
      //         10, minSize, 0,
      //         10, size, 0,
      //     ],
      //     color: 0xffffff,
      //     position: 'X',
      //     num: 4,
      //     margin: 10,
      // },
      // {
      //     type: 'line',
      //     line: [
      //         0, (minSize ? minSize + (size / 4) : size / 4), 0,
      //         50, (minSize ? minSize + (size / 4) : size / 4), 0,
      //     ],
      //     color: 0xffffff,
      //     position: 'Y',
      //     num: 3 + (minSize ? -minSize / (size / 4) : 0),
      //     margin: size / 4,
      // },
      {
          type: 'text',
          content: ['0'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [360, -40, 360],
      },
      {
          type: 'text',
          content: ['10'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [288, -40, 360],
      },
      {
          type: 'text',
          content: ['20'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [216, -40, 360],
      },
      {
          type: 'text',
          content: ['30'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [144, -40, 360],
      },
      {
          type: 'text',
          content: ['40'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [72, -40, 360],
      },
      {
          type: 'text',
          content: ['50'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, -40, 360],
      },
      {
          type: 'text',
          content: ['0'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [390, -40, 330],
          textAlign: 'right',
      },
      {
          type: 'text',
          content: ['90'],
          w: 55,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [380, -40, 250],
      },
      {
          type: 'text',
          content: ['180'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 20.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [380, -40, 160],
      },
      {
          type: 'text',
          content: ['270'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 20.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [380, -40, 70],
      },
      {
          type: 'text',
          content: ['360'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 20.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [380, -40, -20],
      },
  ]
  let prpd = [
      {
          type: 'curveLine',
          line: [
              [0, minSize ? 0 : size / 2, 0],
              [0, minSize ? minSize : 0, 90],
              [0, size, 270],
              [0, minSize ? 0 : size / 2, 360],
          ],
          color: 0xffffff,
      },
      {
          type: 'line',
          line: [
              0, minSize, 0,
              0, size, 0,
              0, size, 360,
              0, minSize, 360,
              0, minSize, 0,

          ],
          color: 0xffffff,
      },
      {
          type: 'line',
          line: [
              0, 0, 90,
              50, 0, 90,
          ],
          color: 0xffffff,
          position: 'Z',
          num: 3,
          margin: 90,
      },
      {
          type: 'line',
          line: [
              0, (minSize ? minSize + (size / 2) : size / 4), 0,
              0, (minSize ? minSize + (size / 2) : size / 4), 360,
          ],
          color: 0xffffff,
          position: 'Y',
          num: 3,
          margin: minSize ? size / 2 : size / 4,
      },
      {
          type: 'line',
          line: [
              0, minSize, 90,
              0, size, 90,
          ],
          color: 0xffffff,
          position: 'Z',
          num: 3,
          margin: 90,
      },
      {
          type: 'text',
          content: ['0'],
          w: 40,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [360, textY, 340],
      },
      {
          type: 'text',
          content: ['90'],
          w: 47,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [360, textY, 270],
      },
      {
          type: 'text',
          content: ['180'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 22.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [360, textY - 2, 180],
      },
      {
          type: 'text',
          content: ['270'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 22.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [360, textY - 2, 90],
      },
      {
          type: 'text',
          content: ['360'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 22.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [360, textY - 2, 0],
      },
  ];
  let prpd3d = [
      {
          type: 'plan',
          line: [minSize ? size * 2 : size, 360, minSize],
          color: 0x32494B,
      },
      {
          type: 'curveLine',
          line: [
              [minSize ? 0 : size / 2, 0, 0],
              [size, 0, 90],
              [minSize, 0, 270],
              [minSize ? 0 : size / 2, 0, 360],
          ],
          color: 0xffffff,
      },
      {
          type: 'line',
          line: [
              minSize, 0, 0,
              size, 0, 0,
              size, 0, 360,
              minSize, 0, 360,
              minSize, 0, 0,

              0, 0, 0,
              0, 50, 0,
              0, 50, 360,
              0, 0, 360,
              0, 0, 0,
          ],
          color: 0xffffff,
      },
      {
          type: 'line',
          line: [
              minSize, 0, 90,
              size, 0, 90,
          ],
          color: 0xffffff,
          position: 'Z',
          num: 3,
          margin: 90,
      },
      {
          type: 'line',
          line: [
              (minSize ? minSize + (size / 2) : size / 4), 0, 0,
              (minSize ? minSize + (size / 2) : size / 4), 0, 360,
          ],
          color: 0xffffff,
          position: 'X',
          num: 3,
          margin: (minSize ? size / 2 : size / 4),
      },
      {
          type: 'line',
          line: [
              0, 0, 90,
              0, 50, 90,
          ],
          color: 0xffffff,
          position: 'Z',
          num: 3,
          margin: 90,
      },
      {
          type: 'line',
          line: [
              0, 10, 0,
              0, 10, 360,
          ],
          color: 0xffffff,
          position: 'Y',
          num: 4,
          margin: 10,
      },
      {
          type: 'text',
          content: ['0'],
          w: 40,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, 20, 380],
      },
      {
          type: 'text',
          content: ['10'],
          w: 47,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, 72, 380],
      },
      {
          type: 'text',
          content: ['20'],
          w: 47,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, 144, 380],
      },
      {
          type: 'text',
          content: ['30'],
          w: 47,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, 216, 380],
      },
      {
          type: 'text',
          content: ['40'],
          w: 47,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, 288, 380],
      },
      {
          type: 'text',
          content: ['50'],
          w: 47,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, 360, 380],
      },
      {
          type: 'text',
          content: ['0'],
          w: 40,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [minSize ? 200 : 400, -40, 330],
      },
      {
          type: 'text',
          content: ['90'],
          w: 47,
          h: 25,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [minSize ? 200 : 400, -40, 230],
      },
      {
          type: 'text',
          content: ['180'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 22.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [minSize ? 200 : 400, -40, 140],
      },
      {
          type: 'text',
          content: ['270'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 22.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [minSize ? 200 : 400, -40, 50],
      },
      {
          type: 'text',
          content: ['360'],
          w: 75,
          h: 25,
          ch: 9,
          cw: 5.7,
          color: '#ffffff',
          size: 22.3,
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [minSize ? 200 : 400, -40, -40],
      },
  ]
  let set = [7.2, 360 / (size + (-minSize)), 1];
  let isGIS = size <= 80;
  let YAxisText = minSize ? [
      [size, 180],
      [size / 2, 90],
      [0, 0],
      [minSize / 2, -90],
      [minSize, -180],
  ] : [
      [isGIS ? size == 80 ? 0 : `-${80 - size}` : size],
      [isGIS ? `-${80 - (size * 0.75)}` : size * 0.75,],
      [isGIS ? `-${80 - (size * 0.5)}` : size * 0.5,],
      [isGIS ? `-${80 - (0.25 * size)}` : size * 0.25,],
      [isGIS ? `-80` : 0,],
  ];
  let infoNum = [
      {
          w: 40,
          h: 20,
          size: 16,
      }, {
          w: 55,
          h: 25,
          size: 22.3,
      }, {
          w: 70,
          h: 25,
          size: 22.3,
      }, {
          w: 100,
          h: 30,
          size: 26.3,
      }, {
          w: 115,
          h: 32,
          size: 28.3,
      }
  ]
  YAxisText.forEach((item, index) => {
      item[0] = item[0].toString();
      let length = item[0].length;
      let info = {
          type: 'text',
          content: item,
          w: infoNum[length - 1].w,
          h: infoNum[length - 1].h,
          cw: length >= 3 ? 5.7 : '',
          ch: length >= 3 ? 9 : '',
          size: infoNum[length - 1].size,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [index, minSize ? item[1] : 360 - (index * 90), length === 1 ? 410 : 430],
          textAlign: 'right',
      };
      let infoPrpd = {
          type: 'text',
          content: item,
          w: infoNum[length - 1].w,
          h: infoNum[length - 1].h,
          cw: length >= 3 ? 5.7 : '',
          ch: length >= 3 ? 9 : '',
          size: infoNum[length - 1].size,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [0, minSize ? item[1] : 360 - (index * 90), length === 1 ? 385 : 395],
          textAlign: 'right',
      };
      let info3d = {
          type: 'text',
          content: item,
          w: infoNum[length - 1].w,
          h: infoNum[length - 1].h,
          cw: length >= 3 ? 5.7 : '',
          ch: length >= 3 ? 9 : '',
          size: infoNum[length - 1].size,
          color: '#ffffff',
          font: 'normal Bold  500px Arial,sans-serif',
          xyz: [minSize ? item[1] - 20 : 360 - (index * 90), -40, 380],
          textAlign: 'right',
      };
      prps.push(info);
      prpd.push(infoPrpd);
      prpd3d.push(info3d);
  })
  data[size] = { set, prps, prpd, prpd3d }
  return data;
}