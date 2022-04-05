class Universe {
    #START_SIZE = 500;
    #OFFSET = 10;
    
    #canvasSize = -1;
    #universeSize = -1;
    #squaresCount = -1;
    #SquareSize = -1;
        
    #Root = null;
    #Context = null;
    #HashSet = new TreesCollection();

    #IsWorking = false;
    Animation = null;
    AnimationSpeed = 1;

    /**
     * Test
     * @returns glider
     */
    #CreateGlider() {
        return this.#HashSet.CreateTree(
            2,
            [
                this.#HashSet.CreateTree(
                    1,
                    [
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, true)
                    ],
                ),
                this.#HashSet.CreateTree(
                    1,
                    [
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, false),
                    ],
                ),
                this.#HashSet.CreateTree(
                    1,
                    [
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, true),
                        this.#HashSet.CreateTree(0, true),
                    ],
                ),
                this.#HashSet.CreateTree(
                    1,
                    [
                        this.#HashSet.CreateTree(0, true),
                        this.#HashSet.CreateTree(0, false),
                        this.#HashSet.CreateTree(0, true),
                        this.#HashSet.CreateTree(0, false),
                    ],
                ),
            ]
        );
    }
    
    constructor() {
        this.#InitializeCanvas();
        this.#SetUniverseSize(this.#START_SIZE);
        //this.#SetRoot(this.#CreateGlider());
        let u = this;        
        $("#universe").off("mousedown");
        $("#universe").mousedown(function (e) { 
            u.#OnClick(e.clientX, e.clientY);
        });
    }
    
    Draw() {
        if (this.#Root === null) {
            alert("Tree is not created");
        } else {
            this.#DrawRoot();
        }
    }
    NextGeneration() {
        this.#SetRoot(this.#Root.NextGeneration(this.#HashSet));
    }
    DrawNextGeneration() {
        this.NextGeneration();
        this.Draw();
    }
    AnimateDrawNextGeneration() {
        if (this.Animation != null) {
            this.NextGeneration();
            this.Draw();
            this.Animation = window.requestAnimationFrame(() => {
                setTimeout(() => {  
                    this.AnimateDrawNextGeneration();
                }, Math.floor(2000 / this.AnimationSpeed));        
            });
        }        
    }
    SetLevel(level) {
        if (level > 0) {
            this.#SetRoot(this.#HashSet.CreateTree(level, undefined));   
        } else {
            alert("Wrong root tree level")
        }
    }
    DrawSetLevel(level) {
        this.SetLevel(level);
        this.Draw();
    }
    GetAnimationMarker() {
        return this.#IsWorking;
    }
    SetAnimationMarker(value) {
        this.#IsWorking = value;
    }


    #InitializeCanvas() {
        this.#Context = document.getElementById("universe").getContext("2d");
    }
    #SetRoot(root) {
        this.#Root = root;
    }
    #SetUniverseSize(uSize) {    
        $("#universe").attr("width", uSize+"px");
        $("#universe").attr("height", uSize+"px");
    }
    #CalculateSquareSize() {
        this.#canvasSize = parseInt($("#universe").attr("width").replace("px", ""));
        this.#universeSize = this.#canvasSize  - this.#OFFSET * 2;
        this.#squaresCount = Math.pow(2, this.#Root.level);
        this.#SquareSize = Math.floor(this.#universeSize / this.#squaresCount);    
        if (this.#SquareSize < 10) {
            this.#SetUniverseSize(this.#canvasSize*2);
            this.#CalculateSquareSize();
        } else if (this.#SquareSize > 150) {            
            this.#SetUniverseSize(Math.floor(this.#canvasSize/2));
            this.#CalculateSquareSize();
        }
    }    
    #DrawRoot() {
        this.#CalculateSquareSize();
        this.#ClearCanvas();
        this.#DrawQuadTree(this.#Root);
        this.#DrawGrid();
    }
    #ClearCanvas() {
        this.#Context.fillStyle = 'gray';
        this.#Context.fillRect(0, 0, this.#canvasSize, this.#canvasSize);
    }
    #DrawQuadTree(tree, x = 0, y = 0) {    
        if (tree.level == 0) {
            if(tree.hasValue) {
                this.#Context.fillStyle = '#D6C100';
                this.#Context.fillRect(x + this.#OFFSET,y + this.#OFFSET,this.#SquareSize,this.#SquareSize);
            }
        }
        else {
            this.#DrawQuadTree(tree[NW], x, y);
            this.#DrawQuadTree(tree[NE], x + Math.pow(2, tree.level - 1) * this.#SquareSize, y);
            this.#DrawQuadTree(tree[SW], x, y + Math.pow(2, tree.level - 1) * this.#SquareSize);
            this.#DrawQuadTree(tree[SE], x + Math.pow(2, tree.level - 1) * this.#SquareSize, y + Math.pow(2, tree.level - 1) * this.#SquareSize);
        }
    }
    #DrawGrid() {
        this.#Context.strokeStyle ='white';
        this.#Context.lineWidth = 5;
        this.#Context.beginPath();
        for (let i = 0; i <= this.#squaresCount; i++) {
            this.#Context.moveTo(i * this.#SquareSize + this.#OFFSET, this.#OFFSET);
            this.#Context.lineTo(i * this.#SquareSize + this.#OFFSET, this.#squaresCount*this.#SquareSize + this.#OFFSET);
            this.#Context.moveTo(this.#OFFSET, i * this.#SquareSize + this.#OFFSET);
            this.#Context.lineTo(this.#squaresCount*this.#SquareSize + this.#OFFSET, i * this.#SquareSize + this.#OFFSET);
        }
        this.#Context.stroke();
    }

    #OnClick(clientX, clientY) {
        clientX -= 250;
        if (this.#Root != null  &&  !this.#IsWorking &&
            clientX > this.#OFFSET && clientX < this.#SquareSize * this.#squaresCount + this.#OFFSET && 
            clientY > this.#OFFSET && clientY < this.#SquareSize * this.#squaresCount + this.#OFFSET) {
                let uX = clientX - this.#OFFSET;
                let uY = clientY - this.#OFFSET;
                let qX = Math.floor(uX / this.#SquareSize);
                let qY = Math.floor(uY / this.#SquareSize);
                this.#SetRoot(this.#ChooseQuad(this.#Root, qX, qY));
                this.Draw();
        }
    }
    #ChooseQuad(tree, x, y) {
        if (tree.level == 0) {
            return this.#HashSet.CreateTree(0, !tree.hasValue);
        } else {
            let treeSize = Math.pow(2, tree.level - 1);
            let index = (y >= treeSize ? 2 : 0) + (x >= treeSize ? 1 : 0)
            let newX = x >= treeSize ? x - treeSize : x;
            let newY = y >= treeSize ? y - treeSize : y;
            return this.#HashSet.CreateTree(
                tree.level,[
                    index == 0 ? this.#ChooseQuad(tree[index], newX, newY) : tree[0],
                    index == 1 ? this.#ChooseQuad(tree[index], newX, newY) : tree[1],
                    index == 2 ? this.#ChooseQuad(tree[index], newX, newY) : tree[2],
                    index == 3 ? this.#ChooseQuad(tree[index], newX, newY) : tree[3]
            ]);            
        }
    }            
};