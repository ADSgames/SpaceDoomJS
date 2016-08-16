var background;
var asteroid_small;
var spaceship;
var angle = 0;

function location_clicked(min_x,max_x,min_y,max_y){
    if(mouse_x>min_x && mouse_x<max_x && mouse_y>min_y && mouse_y<max_y && (mouse_b & 1 || mouse_b & 2)){
        return true;
	}else{
		return false;
	}
}

function location_right_clicked(min_x,max_x,min_y,max_y){
    if(mouse_x>min_x && mouse_x<max_x && mouse_y>min_y && mouse_y<max_y && mouse_b & 4){
        return true;
	}else{
		return false;
	}
}

function draw()
{	
    
    

	textout(canvas,font,"Hello",5,35,40,makecol(0,0,0));
	draw_sprite(canvas,background,0,0);

	draw_sprite(canvas,asteroid_large,0,0);
	draw_sprite(canvas,asteroid_small,45,0);
	rotate_sprite(canvas,spaceship,0,0,angle);
    
	
}

function update()
{	
	angle=angle+1;
	

}

function setup(){
	background = load_bmp("images/background.png");
	asteroid_large = load_bmp("images/asteroid_large.png");
	asteroid_small = load_bmp("images/asteroid_small.png");
	spaceship = load_bmp("images/spaceship.png");
	
}

function main()
{
	enable_debug('debug');
	allegro_init_all("game_canvas", 800,600);
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

 