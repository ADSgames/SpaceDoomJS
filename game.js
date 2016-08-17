var background;
var frame;
var asteroid_small;
var spaceship;
var angle = 0;
var spaceship_x = 500.0;
var spaceship_y = 400.0;
var angle_allegro = 0;
var angle_degrees = 0;
var angle_radians = 0;
var spaceship_x_velocity = 0.0;
var spaceship_y_velocity = 0.0;
var speed = 50;
var gameObjects = [];
var is_alive = true;
var seconds = 0;
var minutes = 0; 
var frames = 0;

//Collision between 2 boxes
function collision(xMin1, xMax1, xMin2, xMax2, yMin1, yMax1, yMin2, yMax2)
{
  if (xMin1 < xMax2 && yMin1 < yMax2 && xMin2 < xMax1 && yMin2 < yMax1){
    return true;
  }
  return false;
}

function location_clicked(min_x,max_x,min_y,max_y){
    if(mouse_x>min_x && mouse_x<max_x && mouse_y>min_y && mouse_y<max_y && (mouse_b & 1 || mouse_b & 2)){
        return true;
	}else{
		return false;
	}
}

//Finds distance between point 1 and point 2
function distance_to_object(x_1,y_1,x_2,y_2){
    return sqrt((pow(x_1-x_2,2))+(pow(y_1-y_2,2)));

}

//Finds angle of point 2 relative to point 1
function find_angle(x_1,  y_1, x_2, y_2){
    var tan_1 = 0.0;
    var tan_2 = 0.0;

    tan_1=y_1-y_2;
    tan_2=x_1-x_2;

    return Math.atan2(tan_2,tan_1);
}

function location_right_clicked(min_x,max_x,min_y,max_y){
    if(mouse_x>min_x && mouse_x<max_x && mouse_y>min_y && mouse_y<max_y && mouse_b & 4){
        return true;
	}else{
		return false;
	}
}

var object = function (x,y,type,x_velocity,y_velocity) {
	this.type=type;
	this.x = x;
	this.y = y;
	this.x_velocity=x_velocity;
	this.y_velocity=y_velocity;
	

}
object.prototype.getX = function(){
	return this.x;
}

object.prototype.getY = function(){
	return this.y;
}

object.prototype.getType = function(){
	return this.type;
}


object.prototype.draw  = function(){
	if(this.type==0){
		draw_sprite(canvas,asteroid_small,this.x,this.y);
	}

	if(this.type==1){
		draw_sprite(canvas,asteroid_large,this.x,this.y);
	}
}
object.prototype.update = function(){
	
	

	if(this.type==0){
		if(this.x > spaceship_x)this.x-=0.5;
		if(this.x < spaceship_x)this.x+=0.5;
		if(this.y < spaceship_y)this.y+=0.5;
		if(this.y > spaceship_y)this.y-=0.5;

		if(collision(this.x+5,this.x+40,spaceship_x,spaceship_x+30,this.y+5,this.y+30,spaceship_y,spaceship_y+30)){
			is_alive=false;

		}
	}
	if(this.type==1){
		this.x+=this.x_velocity;
		this.y+=this.y_velocity;

		if(collision(this.x+10,this.x+82,spaceship_x+10,spaceship_x+30,this.y+10,this.y+90,spaceship_y+10,spaceship_y+30)){
			is_alive=false;

		}
	}
}
function create_asteroid_type_2(speed){
	var side = Math.round(Math.random(4)+1);
	if(side==1)
		var newAsteroid = new object(100+(Math.random()*1160),0,1,(Math.random()*speed)-1,(Math.random()*speed)-1);
	if(side==2)
		var newAsteroid = new object(100+(Math.random()*1160),920,1,1,(Math.random()*speed)-1,(Math.random()*speed)-1);
	if(side==3)
		var newAsteroid = new object(1160,100+(Math.random()*920),1,1,(Math.random()*speed)-1,(Math.random()*speed)-1);
	if(side==4)
		var newAsteroid = new object(0,100+(Math.random()*920),1,1,(Math.random()*speed)-1,(Math.random()*speed)-1);

	gameObjects.push(newAsteroid);  

}

function draw()
{	
    
	
   
	draw_sprite(canvas,background,100,100);

	
	if(is_alive)rotate_sprite(canvas,spaceship,spaceship_x,spaceship_y,angle_allegro);
    
	for (i = 0; i < gameObjects.length; i++) {
    	gameObjects[i].draw();
	} 

	draw_sprite(canvas,frame,0,0);

	 if(seconds<10)
		textout(canvas,font,minutes + ":" + "0" + seconds,5,35,40,makecol(0,0,0));
	else
		textout(canvas,font,minutes + ":" + seconds,5,35,40,makecol(0,0,0));

	textout(canvas,font,gameObjects.length,5,65,40,makecol(0,0,0));

	
}



function update()
{	
	frames++;
	if(frames==60){
		seconds++;
		frames=0;	
	}
	if(seconds%10==0 && frames==0){
		if(minutes>0){
			for(i=0; i<(minutes+1)*5; i++)
				create_asteroid_type_2(minutes*2);
			
		}
		for(i=0; i<(minutes+1)*3; i++){
			var newAsteroid = new object(Math.random()*1200,Math.random()*1000,0,0,0);
			gameObjects.push(newAsteroid);  
		}
	}
	if(seconds==60){
		seconds=0;
		minutes++;
	}

	for (i = 0; i < gameObjects.length; i++) {
    	gameObjects[i].update();
		

		if(gameObjects[i].getX()>1300 || gameObjects[i].getX()<-200 || gameObjects[i].getY()<-200 || gameObjects[i].getY()>1300 ){
			gameObjects.splice(i,1);
			

		}
	} 
	 
	angle=angle+1;

	if(spaceship_x>1060-46)
		spaceship_x=1060-46;

	if(spaceship_x<100)
		spaceship_x=100;

	if(spaceship_y>820-46)
		spaceship_y=820-46;

	if(spaceship_y<100)
		spaceship_y=100;
	
	angle_radians=find_angle(spaceship_x,spaceship_y,mouse_x,mouse_y);

	angle_degrees=(angle_radians*57.2957795);
    angle_allegro=(angle_degrees/1.41176470588);
	
	spaceship_x_velocity = -(spaceship_x - mouse_x)/speed;
	spaceship_y_velocity = -(spaceship_y - mouse_y)/speed;
	
	spaceship_x+=spaceship_x_velocity;
	spaceship_y+=spaceship_y_velocity;
	
	
	

}


function setup(){

	
	var newAsteroid = new object(300,700,0,0,0);
	gameObjects.push(newAsteroid);  
	var newAsteroid = new object(500,900,0,0,0);
	gameObjects.push(newAsteroid);  
	var newAsteroid = new object(700,30,0,0,0);
	gameObjects.push(newAsteroid);  
	
	for(i=0; i<3; i++){
		create_asteroid_type_2();
		
	}
	
	frame = load_bmp("images/frame.png");
	background = load_bmp("images/background.png");
	asteroid_large = load_bmp("images/asteroid_large.png");
	asteroid_small = load_bmp("images/asteroid_small.png");
	spaceship = load_bmp("images/spaceship.png");
	
}

function main()
{
	enable_debug('debug');
	allegro_init_all("game_canvas", 1160,920);
	setup();
	ready(function(){
		loop(function(){
			clear_to_color(canvas,makecol(255,255,255));
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();

 