var background;
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

var object = function (x,y,type) {
	this.type=type;
	this.x = x;
	this.y = y;

}
object.prototype.draw  = function(){
	if(this.type==0){
		draw_sprite(canvas,asteroid_small,this.x,this.y);
	}
}
object.prototype.update = function(){
	if(this.type==0){
		if(this.x > spaceship_x)this.x--;
		if(this.x < spaceship_x)this.x++;
		if(this.y < spaceship_y)this.y++;
		if(this.y > spaceship_y)this.y--;
	
	
	}
}

function draw()
{	
    
    
	textout(canvas,font,"Hello",5,35,40,makecol(0,0,0));
	draw_sprite(canvas,background,100,100);

	draw_sprite(canvas,asteroid_large,0,0);
	draw_sprite(canvas,asteroid_small,45,0);
	rotate_sprite(canvas,spaceship,spaceship_x,spaceship_y,angle_allegro);
    
	for (i = 0; i < gameObjects.length; i++) {
    	gameObjects[i].draw();
	} 

	
}



function update()
{	
	for (i = 0; i < gameObjects.length; i++) {
    	gameObjects[i].update();
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

	var newAsteroid = new object(200,200,0);
	gameObjects.push(newAsteroid);  
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

 