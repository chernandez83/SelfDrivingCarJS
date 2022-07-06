const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const netCanvas = document.getElementById('networkCanvas');
netCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const netCtx = netCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem('bestBrain')) {
    for(let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.0025);
        }
    }
}

//const car = new Car(road.getLaneCenter(1), 300, 30, 50, "AI");
//car.draw(ctx);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0), -950, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(2), -1050, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(1), -1050, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0), -1200, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(1), -1300, 30, 50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0), -1400, 30, 50, "DUMMY", 0.5),
];

animate();

function save() {
    localStorage.setItem(
        'bestBrain',
        JSON.stringify(bestCar.brain)
    );
    console.log('brain saved');
}

function discard() {
    localStorage.removeItem('bestBrain');
    console.log('brain discarded');
}

function generateCars(N) {
    const cars = [];

    for(let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
    }
    return cars;
}

function animate(time) {
    carCanvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    for(let i=0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    //car.update(road.borders, traffic);
    for(let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    );

    carCtx.save();
    //carCtx.translate(0, -car.y + carCanvas.height * 0.7);
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    
    for(let i=0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    }

    //car.draw(carCtx, 'darkblue');
    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'darkblue');
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,'darkblue',true);

    carCtx.restore();

    netCtx.lineDashOffset = -time / 50;
    //Visualizer.drawNetwork(netCtx, car.brain);
    Visualizer.drawNetwork(netCtx, bestCar.brain);

    requestAnimationFrame(animate);
}