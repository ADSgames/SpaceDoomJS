var coin;

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
	draw_sprite(canvas,game,0,0);
	
	
    
	
}

function update()
{	
	

}

function setup(){
	game = load_bmp("images/game.png");
	
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

 