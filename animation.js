function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    //frame
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);
    //console.log(xindex);
    //console.log(this.frameWidth);
    //console.log(this.startX);
    ctx.drawImage(this.spriteSheet,
    				// source from sheet
    			  xindex * this.frameWidth + this.startX, yindex * this.frameHeight + this.startY,  
                  this.frameWidth, this.frameHeight,
                  x, y,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
    
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
	//console.log(this.elapsedTime >= this.totalTime);
    return (this.elapsedTime >= this.totalTime);
}