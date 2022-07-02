const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 300, 30, 50, "KEYS");
//car.draw(ctx);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 0.5)
];

animate();

function animate() {
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    
    for(let i=0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for(let i=0; i < traffic.length; i++) {
        traffic[i].draw(ctx, 'salmon');
    }

    car.update(road.borders, traffic);
    car.draw(ctx, 'darkblue');

    ctx.restore();

    requestAnimationFrame(animate);
}