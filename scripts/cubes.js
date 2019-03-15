(() => {
    // Variables init
    let defaultState = {
        cubesPerDig : 2000,
        cubesIncome : 0,
        total : 0
    };
    let cubeSize = 2, dropSize = window.innerWidth, downSpeed = 5;
    let state,
        digButton, // Button to manually dig
        gameState, // An object containing the state of the game
        cubes, // Array containing all the spawned cubes
        heightIndex, // fake physics
        cubesPerX, // fake physics helper
        playScene; // The gamescene

    // App setup
    let app = new PIXI.Application();
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    document.body.appendChild(app.view);

    // Resize
    function resize() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }
    window.onresize = resize;
    resize();

    // Hello ! we can talk in the chat.txt file

    // Issue : When there are more than ~10k cubes, performance start to drop
    // To test, click the "mine" button about 5-10 times

    // Main state
    function play(delta){
        // Animate the cubes according to their states
        let cube;
        for(let c in cubes){
            cube = cubes[c];
            switch(cube.state) {
                case STATE.LANDING:
                    // fake physics
                    if(!cube.landed){
                        if (cube.y < heightIndex[cube.x]) {
                            cube.y+= downSpeed;
                        }else if (cube.y >= heightIndex[cube.x]) {
                            cube.y = heightIndex[cube.x];
                            cube.landed = 1;
                            heightIndex[cube.x] -= cubeSize;
                        }
                    }
                    break;
                case STATE.CONSUMING:
                    if(cube.y > -cubeSize){
                        cube.y -= cube.speed;
                    }else{
                        removeCube(c);
                    }
                    break;
                case STATE.EXPLODING:
                    if(boundings(c)){
                        continue;
                    }
                    cube.x += cube.eDirX;
                    cube.y += cube.eDirY;
                    break;
            }
        }
        updateUI();
    }

    // Game loop
    function gameLoop(delta){
        state(delta);
    }

    // Setup variables and gameState
    function setup(){
        state = play;
        digButton = document.getElementById('dig');
        digButton.addEventListener('click', mine);
        playScene = new PIXI.Container();
        gameState = defaultState;

        /* User inputs */
        // Mine
        document.getElementById('consume').addEventListener('click', () => {consumeCubes(50)});
        // Manual explode
        let explodeOrigin = null
        document.querySelector('canvas').addEventListener('click', e => {
            if(!explodeOrigin){
                explodeOrigin = {x: e.clientX, y: e.clientY};
            }else{
                explode(explodeOrigin, {x: e.clientX, y: e.clientY});
                explodeOrigin = null;
            }

        });
        window['explode'] = explode;

        heightIndex = {};
        cubesPerX = [];
        // Todo fill with gameState.total cubes
        cubes = [];
        app.ticker.add(delta => gameLoop(delta));
        app.stage.addChild(playScene);
    }

    /*
    * UI
    */
    function updateUI(){
        document.getElementById('total').innerHTML = cubes.length;
    }

    /*
    * Game logic
    */
    // Add cube when user clicks
    function mine(){
        for(let i = 0; i < gameState.cubesPerDig; i++){
            setTimeout(addCube, 5*i);
        }
    }

    // Consume a number of cubes
    function consumeCubes(nb){
        let candidates = _.sampleSize(cubes.filter(c => !c.eDirX), Math.min(nb, cubes.length));
        candidates = candidates.slice(0, nb);
        candidates.map(c => {
            dropCubes(c.x);
            c.state = STATE.CONSUMING;
        });
    }
    const STATE = {
        LANDING: 0,
        CONSUMING: 1,
        EXPLODING: 2
    }
    // Add a cube
    function addCube(){
        let c = new cube(cubeSize);
        let tres = dropSize / cubeSize / 2;
        c.x = window.innerWidth / 2 + (_.random(-tres, tres) * cubeSize);
        c.y = 0//-cubeSize;
        c.speed = _.random(5,8);
        cubes.push(c);
        c.landed = !1;
        c.state = STATE.LANDING;
        if(!cubesPerX[c.x]) cubesPerX[c.x] = [];
        if (!heightIndex[c.x]) heightIndex[c.x] = window.innerHeight - cubeSize;
        cubesPerX[c.x].push(c);
        playScene.addChild(c);
    }

    // Remove a cube
    function removeCube(c){
        let cube = cubes[c];
        playScene.removeChild(cube);
        cubes.splice(c,1);
    }

    // Delete the cube if offscreen
    function boundings(c){
        let cube = cubes[c];
        if(cube.x < 0 || cube.x + cubeSize > window.innerWidth || cube.y < 0 || cube.y > window.innerHeight)
        {
            removeCube(c);
            return true;
        }
    }

    // explode some cubes
    function explode(origin, dest){
        if(dest.x < origin.x){
            dest = [origin, origin = dest][0]; // swap
        }
        var candidates = cubes.filter(c => c.state != STATE.EXPLODING && c.x >= origin.x && c.x <= dest.x && c.y >= origin.y && c.y <= dest.y);
        if(!candidates.length)
            return;

        for(let i = origin.x; i <= dest.x; i++){
            dropCubes(i);
        }

        candidates.forEach(c => {
            c.explodingSpeed = _.random(5,6);
            c.eDirX = _.random(-1,1,1) * c.explodingSpeed * c.speed;
            c.eDirY = _.random(-1,1,1) * c.explodingSpeed * c.speed;
            c.state = STATE.EXPLODING;
        });
    }

    // Drop cubes
    function dropCubes(x){
        heightIndex[x] = window.innerHeight - cubeSize;
        if(cubesPerX[x] && cubesPerX[x].length)
            cubesPerX[x].forEach(c => {
                if(c.state == STATE.EXPLODING) return;
                c.landed = false; c.state = STATE.LANDING;
            });
    }

    /*
     * Graphic display
     */

    // Cube definition
    function cube(size){
        let graphic = new PIXI.Graphics();
        graphic.beginFill(Math.random() * 0xFFFFFF);
        graphic.drawRect(0, 0, size, size);
        graphic.endFill();
        return graphic;
    }

    // Init
    setup();
})()