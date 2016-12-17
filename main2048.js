
var board = new Array();
var score = 0;           
var highestscore = 0;   
var startx = 0;
var starty = 0 ;
var endx = 0 ; 
var endy = 0 ;
                                                                                 

$(document).ready(function(){
    prepareForMobile();
	newgame();
});

function prepareForMobile(){
	
	if (documentWidth>500){
		gridContainerWidth=415;
		cellSpace=15;
		cellSideLength=85;
	}
	$('#grid-container').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);
	
	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}


function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }
	for (var i = 0 ; i < 4 ; i ++ ){
		board[i]=new Array();
		for (var j = 0 ; j < 4 ; j ++ ){
			board[i][j]=0;
		}
	}
	
	updateBoardView();
	updateHighestScore(highestscore);
	score = 0 ;
	updateScore(score);
	}

function updateBoardView(){
		$(".number-cell").remove();
	for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
			$("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );		
			var theNumberCell=$('#number-cell-'+i+"-"+j);
			if (board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			} 
			else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			

            }
		}
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
	if (nospace(board))
		return false;
	//随机一个位置
	var spareCellNum=0;
	var spareCell = new Array();
	for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ )
			if (board[i][j] == 0)
			{
				spareCell[spareCellNum++]=j+(i*10);
			}
	var rand = parseInt(Math.floor( Math.random() * spareCellNum ));
	var randx= parseInt(spareCell[rand]/10);
	var randy=spareCell[rand]%10;
	
    //随机一个数字
    var randNumber = Math.random() < 0.7 ? 2 : 4;
	//var randNumber = spareCellNum ;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;

	
}

$(document).keydown( function(event){
	
	switch(event.keyCode)
	{
		case 37:  //left
			event.preventDefault();
			if (moveLeft()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
			break;
			
		case 38:  //up
			event.preventDefault();
			if (moveUp()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
			break;
			
		case 39:  //right
			event.preventDefault();
			if (moveRight()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
			break;
			
		case 40:  //down
			event.preventDefault();
			if (moveDown()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
			break;
		default:
			break;
	}
	
});

document.addEventListener('touchstart',function(event){
	
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

document.addEventListener('touchend',function(event){
	
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	var deltax = endx - startx ;
	var deltay = endy - starty ;
	
	if (Math.abs(deltax) < 0.2*documentWidth && Math.abs(deltay) < 0.2*documentWidth){
		return ;
	}
	
	if ( Math.abs(deltax) > Math.abs(deltay) ){
		
		//move right 
		if (deltax > 0 )  
		{
			if (moveRight()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
		}
		// move left
		else 
		{
			if (moveLeft()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
		}
	}
	else {
		//move up 
		if ( deltay > 0 )
		{
		if (moveDown()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
		}
		//move down 
		else 
		{	if (moveUp()){
				setTimeout("generateOneNumber()",150);
				setTimeout("isgameover()",200);
			}
			
		}
	}
});


function isgameover(){
	if ( nospace(board) && nomove(board)){
		gameover();
		exit();
	}
}

function gameover(){
	if ( score >= highestscore ){
		highestscore = score ;
		updateHighestScore(highestscore);
		alert('game over! you have beaten the highest score');
		return ;
	}
	if ( score < highestscore ){
		alert('game over!');
		return ;
	}
}

function moveLeft(){
	
	if (!canMoveLeft(board))
		return false;
	
	//move left 
	for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
			
			if ( board[i][j] != 0)
			{
				for ( var k = j-1; k >=0 ; k -- )
				{
					if ( board[i][k] == 0  )
					{
						// move 
						showMoveAnimation(i,k+1,i,k);
						board[i][k]=board[i][k+1];
						board[i][k+1]=0;
					}
					else if ( board[i][k] == board[i][k+1]  )
					{
						//move 
						showMoveAnimation(i,k+1,i,k);
						//add
						board[i][k]+=board[i][k+1];
						board[i][k+1]=0;
						
						score+=board[i][k];
						updateScore(score);
					}
				}
			}
			}	
	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){
	
	if (!canMoveRight(board))
		return false;
	
	//move right
	for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j > -1 ; j -- ){
			
			if ( board[i][j] != 0)
			{
				for ( var k = j+1; k < 4; k ++ )
				{
					if ( board[i][k] == 0 )
					{
						// move 
						showMoveAnimation(i,k-1,i,k);
						board[i][k]=board[i][k-1];
						board[i][k-1]=0;
					}
					else if ( board[i][k] == board[i][k-1] )
					{
						//move 
						showMoveAnimation(i,k-1,i,k);
						//add
						board[i][k]+=board[i][k-1];
						board[i][k-1]=0;
						
						score+=board[i][k];
						updateScore(score);
					}
				}
			}
			}	
	setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){
	
	if (!canMoveUp(board))
		return false;
	
	//move up 
	for( var i = 1 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
			if ( board[i][j] != 0)
			{
				for ( var k = i-1; k >-1 ; k -- )
				{
					if ( board[k][j] == 0  )
					{
						// move 
						showMoveAnimation(k+1,j,k,j);
						board[k][j]=board[k+1][j];
						board[k+1][j]=0;
					}
					else if ( board[k][j] == board[k+1][j] )
					{
						//move 
						showMoveAnimation(k+1,j,k,j);
						//add
						board[k][j]+=board[k+1][j];
						board[k+1][j]=0;
						
						score+=board[k][j];
						updateScore(score);
					}
				}
			}
			}	
	setTimeout("updateBoardView()",200);
	return true;
}

function moveDown(){
	
	if (!canMoveDown(board))
		return false;
	
	//move left 
	for( var i = 2 ; i > -1 ; i -- )
        for( var j = 0 ; j < 4 ; j ++ ){
			
			if ( board[i][j] != 0)
			{
				for ( var k = i+1; k <4 ; k ++)
				{
					if ( board[k][j] == 0  )
					{
						// move 
						showMoveAnimation(k-1,j,k,j);
						board[k][j]=board[k-1][j];
						board[k-1][j]=0;
					}
					else if ( board[k][j] == board[k-1][j] )
					{
						//move 
						showMoveAnimation(k-1,j,k,j);
						//add
						board[k][j]+=board[k-1][j];
						board[k-1][j]=0;
						
						score+=board[k][j];
						updateScore(score);
					}
				}
			}
			}	
	setTimeout("updateBoardView()",200);
	return true;
}

