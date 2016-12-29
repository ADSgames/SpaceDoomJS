var background;
var frame;
var asteroid_small;
var vortex;
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
var high_minutes = 0;
var high_seconds = 0;
var beat_highscore = false;
var music;
var vortex_sfx;
var death_sfx;
var gas_sfx;
var main_menu;
var about;
var help;
var tick=0;
var gas;
var spaceship_speed=100;
var cursor;

var GAME_STATE = 0;

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

	if(this.type==2){
		rotate_sprite(canvas,vortex,this.x,this.y,angle);
	}

	if(this.type==3){
		rotate_sprite(canvas,gas,this.x,this.y);
	}


}
object.prototype.update = function(){
	
	
	if(GAME_STATE==1){
		if(this.type==0){
			if(this.x > spaceship_x)this.x-=0.5;
			if(this.x < spaceship_x)this.x+=0.5;
			if(this.y < spaceship_y)this.y+=0.5;
			if(this.y > spaceship_y)this.y-=0.5;

			if(collision(this.x+5,this.x+40,spaceship_x,spaceship_x+30,this.y+5,this.y+30,spaceship_y,spaceship_y+30)){
				is_alive=false;
				play_sample(death_sfx);

			}
		}
		if(this.type==1){
			this.x+=this.x_velocity;
			this.y+=this.y_velocity;

			if(collision(this.x+10,this.x+82,spaceship_x+10,spaceship_x+30,this.y+10,this.y+90,spaceship_y+10,spaceship_y+30)){
				is_alive=false;
				play_sample(death_sfx);

			}
		}
		
		if(this.type==2){


			if(collision(this.x+10,this.x+30,spaceship_x+10,spaceship_x+30,this.y+10,this.y+30,spaceship_y+10,spaceship_y+30)){
				is_alive=false;
				play_sample(vortex_sfx);

			}
		}

		if(this.type==3){
		
			if(collision(this.x,this.x+32,spaceship_x+10,spaceship_x+30,this.y,this.y+32,spaceship_y+10,spaceship_y+30)){
				play_sample(gas_sfx);
				if(spaceship_speed>10)
					spaceship_speed-=10;
				gameObjects.splice(gameObjects.indexOf(this),1);
				//play_sample(vortex_sfx);

			}
		}
	
	}

}
function restart_game(){
	
	if(beat_highscore){
		high_minutes=minutes;
		high_seconds=seconds;
		beat_highscore=0;
 	}
	spaceship_speed=100;
	is_alive=true;
	seconds=0;
	frames=0;
	minutes=0;
	gameObjects.splice(0,gameObjects.length);
	create_asteroid(0,0);
	create_asteroid(0,0);
	create_asteroid(0,0);
	spaceship_x=450;
	spaceship_y=350;

}

function create_asteroid(newType,newSpeed){

	var random_x = 0;
	var random_y = 0;

	if(newType==1 || newType==0){
		var side = Math.ceil((Math.random()*4));
	
		if(newType==1){
			random_x=(Math.random()*newSpeed)-1;
			random_y=(Math.random()*newSpeed)-1;
		}
		
		if(side==1)
			var newAsteroid = new object((Math.random()*960),-50,newType,random_x,random_y);
		if(side==2)
			var newAsteroid = new object((Math.random()*960),720,newType,random_x,random_y);
		if(side==3)
			var newAsteroid = new object(960,-25+(Math.random()*720),newType,random_x,random_y);
		if(side==4)
			var newAsteroid = new object(-50,-25+(Math.random()*720),newType,random_x,random_y);

		gameObjects.push(newAsteroid); 
		

	}else if(newType==2){
		var newAsteroid = new object((Math.random()*960),(Math.random()*720),newType,random_x,random_y);
		gameObjects.push(newAsteroid);  
	
	}else if(newType==3){
		var newAsteroid = new object(100+(Math.random()*760),100+(Math.random()*520),newType,random_x,random_y);
		gameObjects.push(newAsteroid);  
	}

}

function draw()
{	
    
	
   if(GAME_STATE==1){
		draw_sprite(canvas,background,0,0);

		
		if(is_alive)rotate_sprite(canvas,spaceship,spaceship_x,spaceship_y,angle_allegro);
		
		for (i = 0; i < gameObjects.length; i++) {
			gameObjects[i].draw();
		} 

		
		var text_colour = makecol(255,255,255);
		var x=5;

		if(is_alive){
			
			if(high_minutes>minutes || (high_minutes == minutes && seconds>high_seconds)){
				if(seconds<10)
					textout(canvas,font,"" + minutes + ":" + "0" + seconds,x,40,40,text_colour);
				else
					textout(canvas,font,"" + minutes + ":" + seconds,x,40,40,text_colour);
			}else{
				if(high_seconds<10)
					textout(canvas,font,"" + high_minutes + ":" + "0" + high_seconds,x,40,40,text_colour);
				else
					textout(canvas,font,"" + high_minutes + ":" + high_seconds,x,40,40,text_colour);
			}
			if(seconds<10)
				textout(canvas,font,minutes + ":" + "0" + seconds,x,80,40,text_colour);
			else
				textout(canvas,font,minutes + ":" + seconds,x,80,40,text_colour);
		}
		if(!is_alive){
			textout(canvas,font,"You died. Press R to restart",0,40,40,text_colour);
			if(high_minutes<minutes || (high_minutes==minutes && seconds>high_seconds) ){
				beat_highscore=true;
				
				if(seconds<10)
					textout(canvas,font,"New Highscore!: " + minutes + ":" + "0" + seconds,x,80,40,text_colour);
				else
					textout(canvas,font,"New Highscore!: " + minutes + ":" + seconds,x,80,40,text_colour);
			}else{
				if(seconds<10)
					textout(canvas,font,minutes + ":" + "0" + seconds,x,80,40,text_colour);
				else
					textout(canvas,font,minutes + ":" + seconds,x,80,40,text_colour);
			}
		}
    }
	if(GAME_STATE==0){
		draw_sprite(canvas,background,0,0);
		draw_sprite(canvas,main_menu,0,0);

	}
	if(GAME_STATE==2){
		draw_sprite(canvas,background,0,0);
		draw_sprite(canvas,help,0,0);

	}
	if(GAME_STATE==3){
		draw_sprite(canvas,background,0,0);
		draw_sprite(canvas,about,0,0);

	}

	draw_sprite(canvas,cursor,mouse_x,mouse_y);
	//textout(canvas,font,gameObjects.length,5,65,40,makecol(0,0,0));

	
}

function update()

{	


	tick+=1;

	if(GAME_STATE==1){

		

		if(key[KEY_B]){
			GAME_STATE=0;
			restart_game();
		}
		if(key[KEY_R])
			restart_game();

		if(is_alive)frames++;
		if(frames==60){
			seconds++;
			frames=0;

			if(Math.ceil(Math.random()*10)==1){
				create_asteroid(3,0);
			}	
		}
		if(seconds%10==0 && frames==0){
			if(minutes>0){
				for(i=0; i<(minutes+1)*5; i++){
					create_asteroid(1,(minutes+1)*2);
				}
				
			}
			for(i=0; i<(minutes+1)*3; i++){
				create_asteroid(0,0);
				create_asteroid(2,0);
			}
		}
		if(seconds==60){
			seconds=0;
			minutes++;
		}

		for (i = 0; i < gameObjects.length; i++) {
			if(gameObjects[i].getX()>1300 || gameObjects[i].getX()<-200 || gameObjects[i].getY()<-200 || gameObjects[i].getY()>1300 ){
				gameObjects.splice(i,1);
				

			}
			
			gameObjects[i].update();
			

		
		} 
		
		angle=angle+1;
		
		if(angle==256)
			angle=0;

		if(spaceship_x>960-46)
			spaceship_x=960-46;

		if(spaceship_x<0)
			spaceship_x=0;

		if(spaceship_y>720-46)
			spaceship_y=720-46;

		if(spaceship_y<0)
			spaceship_y=0;
		
		if(is_alive){
			angle_radians=find_angle(spaceship_x,spaceship_y,mouse_x,mouse_y);

			angle_degrees=(angle_radians*57.2957795);
			angle_allegro=(angle_degrees/1.41176470588);
		

			spaceship_x_velocity = -(spaceship_x - mouse_x)/spaceship_speed;
			spaceship_y_velocity = -(spaceship_y - mouse_y)/spaceship_speed;
		
			spaceship_x+=spaceship_x_velocity;
			spaceship_y+=spaceship_y_velocity;
		}else{
			spaceship_x=10000;
			spaceship_y=10000;
		}
	}
	if(GAME_STATE==0 && tick>10){
	if(location_clicked(290,700,360,460)){
			tick=0;
			restart_game();
			create_asteroid(0,0);
			create_asteroid(0,0);
			create_asteroid(0,0);
			GAME_STATE=1;
		}
		if(location_clicked(290,700,460,560)){
			tick=0;
			GAME_STATE=2;
		}
		if(location_clicked(290,700,560,660)){
			tick=0;
			
			GAME_STATE=3;
		}
	}
	if((GAME_STATE==2 || GAME_STATE==3)){
		if(mouse_b & 1 && tick>10){
			GAME_STATE=0;
			tick=0;
		}
		if(key[KEY_B]){
			GAME_STATE=0;
		}
	}
		
	

}


function setup(){


	//Website path
	/*
	frame = load_bmp("files/deepspace/images/frame.png");
	background = load_bmp("files/deepspace/images/background.png");
	main_menu = load_bmp("files/deepspace/images/main_menu.png");
	asteroid_large = load_bmp("files/deepspace/images/asteroid_large.png");
	asteroid_small = load_bmp("files/deepspace/images/asteroid_small.png");
	spaceship = load_bmp("files/deepspace/images/spaceship.png");
	vortex = load_bmp("files/deepspace/images/vortex.png");
	help = load_bmp("files/deepspace/images/help.png");
	about = load_bmp("files/deepspace/images/about.png");

	gas = load_bmp("files/deepspace/images/gas.png");
	cursor = load_bmp("files/deepspace/images/cursor.png");


	music = load_sample("files/deepspace/audio/music.mp3");
	vortex_sfx = load_sample("files/deepspace/audio/vortex_sfx.mp3");
	death_sfx = load_sample("files/deepspace/audio/death_sfx.mp3");
	gas_sfx = load_sample("files/deepspace/audio/gas_sfx.mp3");
	*/

	// Local files
	frame = load_bmp("images/frame.png");
	background = load_bmp("images/background.png");
	main_menu = load_bmp("images/main_menu.png");
	asteroid_large = load_bmp("images/asteroid_large.png");
	asteroid_small = load_bmp("images/asteroid_small.png");
	spaceship = load_bmp("images/spaceship.png");
	vortex = load_bmp("images/vortex.png");
	help = load_bmp("images/help.png");
	about = load_bmp("images/about.png");

	gas = load_bmp("images/gas.png");
	cursor = load_bmp("images/cursor.png");


	music = load_sample("audio/music.mp3");
	vortex_sfx = load_sample("audio/vortex_sfx.mp3");
	death_sfx = load_sample("audio/death_sfx.mp3");
	gas_sfx = load_sample("audio/gas_sfx.mp3");
	
	play_sample(music,255,1000,1);
	
	
}

function main()
{
	enable_debug('debug');
	allegro_init_all("game_canvas", 960,720);
	
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

 
