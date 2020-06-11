const canvas = document.querySelector('#reCan');
const ctx = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let particlesArray;
const maxPartSize = 40;
const minPartSize = 0;

let mouse = {
    x: null,
    y: null,
    radius: 50
};

window.addEventListener("mousemove", event => {
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x,mouse.y);
});

const colors = [
    '#fff',
    'rgba(121,160,193,0.5)',
    'rgba(0,139,139,0.7)',
    'rgba(156,156,156,0.4)',
]
class Particle{
    constructor(x,y,directionX,directionY,size,color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // отрисовка элементов
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#333';
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        // ctx.rect(this.x,this.y,this.size,this.size);
        ctx.fill();
        ctx.stroke();
    }
    // логика движения элементов
    update(){
        //движение частиц
        this.x += this.directionX;
        this.y += this.directionY;

        //опрпделение границ радиуса курсора и изм-я размеров частиц в нём
        if(mouse.x - this.x < mouse.radius && mouse.x - this.x > -mouse.radius &&
            mouse.y - this.y < mouse.radius && mouse.y - this.y > -mouse.radius){
            if(this.size < maxPartSize){ //если частица не достигла мах размера, то она растёт до него
                this.size +=3; //скорость роста частицы в поле радиуса курсора
            }
        } else if(this.size > minPartSize){
            this.size -=0.1;
        }
        if(this.size < minPartSize) this.size = minPartSize;
        this.draw();
    }
    jump(){
        //collision detection - mouse position / particle position
        let dx = mouse.x - this.x; //расст-е от мыши до частицы по х
        let dy = mouse.y - this.y; //расст-е от мыши до частицы по y
        let distance = Math.sqrt(dx*dx + dy*dy); //теорема Пифагора
        if(distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x + this.size*2 < canvas.width){
                this.x += Math.random()*this.size*3;
            }
            if(mouse.x > this.x && this.x - this.size*2 > 0){
                this.x -= Math.random()*this.size*3;
            }
            if(mouse.y < this.y && this.y + this.size*2 < canvas.height){
                this.y += Math.random()*this.size*3;
            }
            if(mouse.y > this.y && this.y - this.size*2 > 0){
                this.y -= Math.random()*this.size*3;
            }
        }
    }
}

//инициалицая массива частиц
function init(){
    let arrLenght = 3000;
    particlesArray = [];

    for(let i=0;i<arrLenght;++i){
        let x = Math.random()*canvas.width;
        let y = Math.random()*canvas.height;

        let directionX = (Math.random() * .2) - .1; //от -0.1 до 0.1
        let directionY = (Math.random() * .2) - .1;
        let size = 0; //сначала у всех частиц размер 0, они вырастают только когда заходят в радиус видимости курсора
        let color = colors[Math.floor(Math.random()*colors.length)];

        particlesArray.push(new Particle(x,y,directionX,directionY,size,color));
    }
}
//анимация вызывается каждый кадр, в ней должны быть отрисовка элементов и очистка поля от предыдущ сост-я
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<particlesArray.length;++i){
        particlesArray[i].update();
    }
}

window.addEventListener("click", event =>{
    for(let i=0;i<particlesArray.length;++i){
        if(particlesArray[i].x > mouse.x - mouse.radius && particlesArray[i].x < mouse.x + mouse.radius &&
            particlesArray[i].y > mouse.y - mouse.radius && particlesArray[i].y < mouse.y + mouse.radius){
            particlesArray[i].jump();
        }
    }
});

init();
animate();
