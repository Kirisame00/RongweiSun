document.addEventListener('DOMContentLoaded', () => {
    const trailContainer = document.getElementById('trail-container');
    const trailCount = 20;// 增加拖尾的数量以使拖尾更长
    const trails = [];

    // 创建拖尾元素
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.opacity = (1 - i / trailCount);// 设置初始不透明度
        trailContainer.appendChild(trail);
        trails.push(trail);
    }
    // 创建光标下方的图案
    const current = document.getElementById('current');
    // 创建拖尾最后一刻的位置图案
    const lastTrail = document.getElementById('last-trail');

    let lastPosition = { x: -100, y: -100 };
    let isDragging = false;
    let startAngle = 0;
    let rotationAngle = 0;
    let gravityDirection = 0; // 以度为单位的重力方向

    function update() {
        // 将每个拖尾的位置更新到前一个拖尾的位置
        for (let i = trailCount - 1; i > 0; i--) {
            const currentTrail = trails[i];
            const previousTrail = trails[i - 1];
            currentTrail.style.left = `${previousTrail.style.left}`;
            currentTrail.style.top = `${previousTrail.style.top}`;
            currentTrail.style.opacity = `${1 - i / trailCount}`;// 更新拖尾的透明度
        }

        // 更新第一个拖尾的位置到鼠标位置
        const firstTrail = trails[0];
        firstTrail.style.left = `${lastPosition.x - 10}px`;// 使菱形中心位于光标位置
        firstTrail.style.top = `${lastPosition.y - 10}px`;// 使菱形中心位于光标位置
        firstTrail.style.opacity = '1';

        // 更新当前光标下方的图案的位置
        current.style.left = `${lastPosition.x - 10}px`;// 使菱形中心位于光标位置
        current.style.top = `${lastPosition.y - 10}px`;// 使菱形中心位于光标位置

        // 更新拖尾最后一刻的位置图案的位置
        lastTrail.style.left = `${firstTrail.style.left}`;
        lastTrail.style.top = `${firstTrail.style.top}`;

        // 逐渐让拖尾消失
        setTimeout(() => {
            firstTrail.style.opacity = '0';// 更新拖尾最后一刻的位置
            lastTrail.style.left = `${firstTrail.style.left}`;
            lastTrail.style.top = `${firstTrail.style.top}`;
        }, 100);// 增加延迟时间来减缓追逐速度

        // 继续动画
        requestAnimationFrame(update);
    }

    function updateColors() {
        let elementUnderCursor = document.elementFromPoint(lastPosition.x, lastPosition.y);

        while (elementUnderCursor && !elementUnderCursor.classList.contains('container')) {
            if (elementUnderCursor.classList.contains('black')) {
                current.style.borderColor = 'white';
                lastTrail.style.borderColor = 'white';
                return;
            }
            elementUnderCursor = elementUnderCursor.parentElement;
        }

        current.style.borderColor = 'black';
        lastTrail.style.borderColor = 'black';
    }

    document.addEventListener('mousemove', (event) => {
        lastPosition = { x: event.clientX, y: event.clientY };
        updateColors();
  });

    document.addEventListener('mousedown', (event) => {
        isDragging = true;
        startAngle = Math.atan2(event.clientY - window.innerHeight / 2, event.clientX - window.innerWidth / 2) * (180 / Math.PI);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const currentAngle = Math.atan2(event.clientY - window.innerHeight / 2, event.clientX - window.innerWidth / 2) * (180 / Math.PI);
            rotationAngle += currentAngle - startAngle;
            startAngle = currentAngle;

            document.querySelector('.container').style.transform = `rotate(${rotationAngle}deg)`;

            gravityDirection = rotationAngle % 360;
        }
    });

    const circles = [];
    const gravity = 10; // 重力常数

    document.addEventListener('click', (event) => {
        const circle = document.createElement('div');
        circle.className = 'circle';
    
        // 获取点击时的鼠标坐标
        const clickX = event.clientX;
        const clickY = event.clientY;
    
        // 调整circle位置，确保从光标正下方掉落
        circle.style.left = `${clickX - 4}px`; // 将光标中心对齐小球中心
        circle.style.top = `${clickY - 4}px`;
    
        const startTime = Date.now();
        const velocity = { x: 0, y: 0 };
    
        document.body.appendChild(circle);
        circles.push({ element: circle, velocity: velocity, startTime: startTime });
    });

    function updateGravity() {
        const currentTime = Date.now();
        circles.forEach((circleData) => {
            const circle = circleData.element;
            const startTime = circleData.startTime;
            const elapsedTime = (currentTime - startTime) / 1000; // 时间单位为秒
            const velocityY = gravity * Math.pow(elapsedTime, 2);

            // 根据重力方向计算位置
            const radians = gravityDirection * (Math.PI / 180);
            const gravityX = Math.sin(radians) * gravity;
            const gravityY = Math.cos(radians) * gravity;

            let newTop = parseFloat(circle.style.top) + velocityY;
            let newLeft = parseFloat(circle.style.left) + gravityX;

            // 确保小圆在页面内
            if (newTop + 8 > window.innerHeight) {
                newTop = window.innerHeight - 8;
            }
            if (newTop < 0) {
                newTop = 0;
            }
            if (newLeft + 8 > window.innerWidth) {
                newLeft = window.innerWidth - 8;
            }
            if (newLeft < 0) {
                newLeft = 0;
            }

            circle.style.top = `${newTop}px`;
            circle.style.left = `${newLeft}px`;
        });

        requestAnimationFrame(updateGravity);
    }

    update();
    updateGravity();
});






document.addEventListener('DOMContentLoaded', () => {
    // 克隆并修改第一个背景网格
    const originalGrid = document.querySelector('.background-grid');
    const newGrid1 = originalGrid.cloneNode(true); // 克隆背景网格及其子元素

    // 修改第一个新背景网格的位置
    newGrid1.style.top = '40vh';
    newGrid1.style.left = '87.5vw';

    // 获取第一个新背景网格中的所有菱形框
    const diamonds1 = newGrid1.querySelectorAll('.backgrounddiamond');

    // 修改第一个新网格中每个菱形框的大小，并添加 hover 效果
    diamonds1.forEach(diamond => {
        diamond.style.width = '250px';
        diamond.style.height = '250px';
        diamond.style.margin = '-230px';
    });

    // 将克隆的背景网格添加到页面中
    document.body.appendChild(newGrid1);

    // 为所有菱形框添加 hover 和离开效果
    addHoverEffectToDiamonds();
});

    document.addEventListener('DOMContentLoaded', () => {
        // 克隆并修改第二个背景网格
        const originalGrid = document.querySelector('.background-grid');
        const newGrid2 = originalGrid.cloneNode(true); // 克隆背景网格及其子元素

        // 修改第二个新背景网格的位置
        newGrid2.style.top = '55vh';
        newGrid2.style.left = '10vw';

        // 获取第二个新背景网格中的所有菱形框
        const diamonds2 = newGrid2.querySelectorAll('.backgrounddiamond');

        // 修改第二个新网格中每个菱形框的大小，并添加 hover 效果
        diamonds2.forEach(diamond => {
            diamond.style.width = '200px';
            diamond.style.height = '200px';
            diamond.style.margin = '-180px';
        });

        // 将克隆的背景网格添加到页面中
        document.body.appendChild(newGrid2);

        // 为所有菱形框添加 hover 和离开效果
        addHoverEffectToDiamonds();
    });

    document.addEventListener('DOMContentLoaded', () => {
        // 克隆并修改第三个背景网格
        const originalGrid = document.querySelector('.background-grid');
        const newGrid3 = originalGrid.cloneNode(true); // 克隆背景网格及其子元素
    
        // 修改第三个新背景网格的位置
        newGrid3.style.top = '98vh';
        newGrid3.style.left = '27vw';
    
        // 获取第三个新背景网格中的所有菱形框
        const diamonds3 = newGrid3.querySelectorAll('.backgrounddiamond');
    
        // 修改第三个新网格中每个菱形框的大小，并添加 hover 效果
        diamonds3.forEach(diamond => {
            diamond.style.width = '150px';
            diamond.style.height = '150px';
            diamond.style.margin = '-135px';
            diamond.style.backgroundColor = 'rgba(208,68,76,0.15)';
            diamond.style.borderColor='transparent';

        });
    
        // 将克隆的背景网格添加到页面中
        document.body.appendChild(newGrid3);
    
        // 为所有菱形框添加 hover 和离开效果
        addHoverEffectToDiamonds();
    });



    document.addEventListener('DOMContentLoaded', () => {
        // 克隆并修改第4个背景网格
        const originalGrid = document.querySelector('.background-grid');
        const newGrid4 = originalGrid.cloneNode(true); // 克隆背景网格及其子元素
    
        // 修改第4个新背景网格的位置
        newGrid4.style.top = '100vh';
        newGrid4.style.left = '95vw';
    
        // 获取第4个新背景网格中的所有菱形框
        const diamonds4 = newGrid4.querySelectorAll('.backgrounddiamond');
    
        // 修改第4个新网格中每个菱形框的大小，并添加 hover 效果
        diamonds4.forEach(diamond => {
            diamond.style.width = '280px';
            diamond.style.height = '280px';
            diamond.style.margin = '-220px';
            diamond.style.backgroundColor = 'rgba(106,150,204,0.1)';
            diamond.style.borderColor='transparent';

        });
    
        // 将克隆的背景网格添加到页面中
        document.body.appendChild(newGrid4);
    
        // 为所有菱形框添加 hover 和离开效果
        addHoverEffectToDiamonds();
    });



// 添加悬停效果的函数
function addHoverEffectToDiamonds() {
    document.querySelectorAll('.backgrounddiamond').forEach(diamond => {
        let timeout;

        diamond.addEventListener('mouseenter', () => {
            clearTimeout(timeout); // 清除任何已有的计时器
            diamond.classList.add('hovered'); // 添加hovered类
        });

        diamond.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                diamond.classList.remove('hovered'); // 延迟1.5秒后移除hovered类
            }, 1500); // 延迟1.5秒
        });
    });
}







// 添加全局的 CSS 样式
const style = document.createElement('style');
style.textContent = `
    .hovered {
        transform: scale(1.5) rotate(360deg);
        transition: all 100ms ease-in-out;
    }
`;
document.head.appendChild(style);









// 最大同时存在的菱形数量
const maxDiamonds = 10; 
let currentDiamonds = 0;

// 创建随机菱形框和菱形片的函数
function createFallingDiamond() {
    if (currentDiamonds >= maxDiamonds) return; // 检查当前数量是否超过最大数量

    // 创建一个新的div元素作为菱形
    const diamond = document.createElement("div");
    diamond.classList.add("falling-diamond");

    // 随机生成大小、透明度和动画时间
    const size = Math.random() * (100 - 30) + 30; // 菱形大小在30px到100px之间
    //const opacity = Math.random() * (0.6 - 0.1) + 0.1; // 透明度在0.1到0.6之间
    const opacity =1;
    const duration = Math.random() * (10 - 3) + 3; // 动画持续时间在3到10秒之间

    // 设置菱形的样式属性
    const colors = ['#D41031', '#3F4583', '#FCE603']; // 定义三种颜色
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    diamond.style.backgroundColor = randomColor;
    diamond.style.width = `${size}px`;
    diamond.style.height = `${size}px`;
    diamond.style.opacity = opacity;
    diamond.style.left = `${Math.random() * 100}vw`; // 随机位置
    diamond.style.animation = `fall ${duration}s linear`; // 设置动画和速度

    // 将菱形添加到页面上
    document.body.appendChild(diamond);
    currentDiamonds++;

    // 监听动画结束事件，删除掉落到下方的菱形，并更新当前数量
    diamond.addEventListener('animationend', () => {
        diamond.remove();
        currentDiamonds--;
    });
}

// 定期生成新的菱形
setInterval(createFallingDiamond, 1000); // 每1秒尝试生成一个新菱形