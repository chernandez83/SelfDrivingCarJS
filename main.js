const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const netCanvas = document.getElementById('networkCanvas');
netCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const netCtx = netCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 300, 30, 50, "AI");
//car.draw(ctx);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 0.5)
];

animate();

function animate(time) {
    carCanvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    
    for(let i=0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for(let i=0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'salmon');
    }

    car.update(road.borders, traffic);
    car.draw(carCtx, 'darkblue');

    carCtx.restore();

    netCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netCtx, car.brain);

    requestAnimationFrame(animate);
}