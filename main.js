// select elements
const cvs = document.getElementById('ping-pong');
const ctx= cvs.getContext('2d');

// create the paddles
//user paddle
const user={
    x: 0,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "yellow",
    score: 0
};
//computer paddle
const comp={
    x: cvs.width-10,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "blue",
    score: 0
};
// create the ball
const ball={
    x: cvs.width/2,
    y: cvs.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "red"
};
//create the net 
const net={
    x: cvs.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
};


// drawing functions
// the rect table
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
};
drawRect(0, 0, cvs.width, cvs.height, 'black');
// the ball table
function drawCircle(x, y, r, color){
    ctx.fillStyle= color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
};
// the text
function drawText(text, x, y, color){
    ctx.fillStyle=color;
    ctx.font="25px Fredoka";
    ctx.fillText(text, x, y);
};
// the net
function drawNet(){
    for (let i=0; i<=cvs.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
};

// rendering function
function render(){
    //clear the canvas
    drawRect(0, 0, cvs.width, cvs.height, 'black');
    //draw the net
    drawNet(cvs.width, cvs.height, 'black');
    //draw the score
    drawText('Player', (cvs.width/4)-25, (cvs.height/5)- 30, 'white');
    drawText('Computer', (3*cvs.width/4)-50, (cvs.height/5) -30, 'white');
    drawText(user.score, cvs.width/4, cvs.height/5, 'white');
    drawText(comp.score, 3*cvs.width/4, cvs.height/5, 'white');
    //draw the paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);
    //draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color)
};

// controlling the user's paddle
cvs.addEventListener('mousemove', movePaddle);

function movePaddle (event){
    let rect = cvs.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height/2
};

//collision detection
function collision(ball, player){
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    return ball.right > player.left 
    && ball.bottom > player.top 
    && ball.left < player.right 
    && ball.top < player.bottom ;
}

// reset the game function
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
};

// update function, ball movement, score update
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // simple AI to control the computer paddle
    let computerLevel= 0.1;
    comp.y += (ball.y - (comp.y + comp.height/2)) * computerLevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : comp;

    if (collision(ball, player)){
        // when the player hits the ball
        let collidePoint = ball.y - (player.y + player.height/2);

        // normal situation
        collidePoint = collidePoint/(player.height/2);

        // some math to calculate the ball hitting the paddle angle
        let angleRad = collidePoint * Math.PI / 4;

        // changing the ball's X direction after hitting the paddle
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        // changing the ball's angle 
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        // changing the ball speed for the challenge
        ball.speed += 0.5;
    }

    // score update
    if (ball.x - ball.radius < 0){
        // computer wins
        comp.score++;
        resetBall();
    } else if (ball.x + ball.radius > cvs.width){
        // player wins
        user.score++;
        resetBall();
    }
};

//initial the game
function game(){
    update();
    render();
};

// loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);